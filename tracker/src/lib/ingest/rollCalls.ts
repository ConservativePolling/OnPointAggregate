import { XMLParser } from "fast-xml-parser";
import type { MemberVote, DetailedRollCall, RollCallMemberVote, VotePosition, Party } from "@/lib/types";
import { lookupBioguideFromLis } from "@/lib/data/legislators";

const HOUSE_INDEX_URL = "https://clerk.house.gov/evs";
const HOUSE_VOTE_URL = "https://clerk.house.gov/evs";
const SENATE_MENU_URL =
  "https://www.senate.gov/legislative/LIS/roll_call_lists";
const SENATE_VOTE_URL =
  "https://www.senate.gov/legislative/LIS/roll_call_votes";

const parser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: "",
});

const billTypes = new Set([
  "hr",
  "s",
  "hjres",
  "sjres",
  "hres",
  "sres",
  "hconres",
  "sconres",
]);

type HouseRollSummary = {
  rollNumber: string;
  billNumberText: string;
  title: string;
};

function arrayify<T>(value: T | T[] | undefined | null): T[] {
  if (!value) return [];
  return Array.isArray(value) ? value : [value];
}

function stripTags(value: string) {
  return value.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

function parseHouseIndex(html: string): HouseRollSummary[] {
  const rows = html.match(/<TR>.*?<\/TR>/gis) ?? [];
  const summaries: HouseRollSummary[] = [];

  rows.forEach((row) => {
    if (!row.includes("rollnumber=")) return;
    const columns = [...row.matchAll(/<TD[^>]*>(.*?)<\/TD>/gis)].map(
      (match) => stripTags(match[1])
    );
    if (columns.length < 6) return;
    const rollNumber = columns[0].replace(/[^0-9]/g, "");
    if (!rollNumber) return;
    summaries.push({
      rollNumber,
      billNumberText: columns[2],
      title: columns[5],
    });
  });

  return summaries;
}

function normalizeBillType(typeRaw: string) {
  return typeRaw.toLowerCase().replace(/[^a-z]/g, "");
}

function formatBillType(type: string) {
  const map: Record<string, string> = {
    hr: "H.R.",
    s: "S.",
    hjres: "H.J.Res.",
    sjres: "S.J.Res.",
    hconres: "H.Con.Res.",
    sconres: "S.Con.Res.",
    hres: "H.Res.",
    sres: "S.Res.",
  };
  return map[type] ?? type.toUpperCase();
}

function normalizeBillId(
  typeRaw: string,
  numberRaw: string | number,
  congress?: string
) {
  const type = normalizeBillType(typeRaw);
  const number = String(numberRaw).replace(/[^0-9]/g, "");
  if (!type || !number || !billTypes.has(type)) return undefined;
  if (!congress) return undefined;
  return {
    billId: `${congress}-${type}-${number}`,
    billNumber: `${formatBillType(type)} ${number}`,
  };
}

function normalizeLegisNum(
  legisNum: string,
  congress?: string
): { billId: string; billNumber: string } | undefined {
  const cleaned = legisNum.replace(/\s+/g, "").replace(/\./g, "");
  const match = cleaned.match(/^([A-Za-z]+)(\d+)$/);
  if (!match) return undefined;
  const [, typeRaw, numberRaw] = match;
  return normalizeBillId(typeRaw, numberRaw, congress);
}

function normalizeHouseDate(value: string) {
  const parts = value.split("-");
  if (parts.length !== 3) return value;
  const [day, month, year] = parts;
  const monthMap: Record<string, string> = {
    Jan: "01",
    Feb: "02",
    Mar: "03",
    Apr: "04",
    May: "05",
    Jun: "06",
    Jul: "07",
    Aug: "08",
    Sep: "09",
    Oct: "10",
    Nov: "11",
    Dec: "12",
  };
  const monthValue = monthMap[month] ?? "01";
  return `${year}-${monthValue}-${day.padStart(2, "0")}`;
}

function normalizeSenateDate(value: string) {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;
  return parsed.toISOString();
}

async function fetchHouseRollSummaries(
  year: string,
  fetchOptions?: RequestInit
) {
  const response = await fetch(`${HOUSE_INDEX_URL}/${year}/index.asp`, {
    ...fetchOptions,
  });
  if (!response.ok) {
    throw new Error(`House Clerk error: ${response.status}`);
  }
  const html = await response.text();
  return parseHouseIndex(html);
}

async function fetchHouseRollCallXml(
  year: string,
  rollNumber: string,
  fetchOptions?: RequestInit
) {
  const padded = rollNumber.padStart(3, "0");
  const response = await fetch(
    `${HOUSE_VOTE_URL}/${year}/roll${padded}.xml`,
    {
      ...fetchOptions,
    }
  );
  if (!response.ok) {
    throw new Error(`House roll call error: ${response.status}`);
  }
  return response.text();
}

function parseHouseRollCall(
  xml: string,
  summary: HouseRollSummary
): {
  metadata: {
    congress?: string;
    question: string;
    result: string;
    date: string;
    description: string;
    billId?: string;
    billNumber?: string;
    billTitle?: string;
  };
  votes: Array<{ memberId: string; position: string }>;
} {
  const parsed = parser.parse(xml);
  const root = parsed["rollcall-vote"];
  const meta = root?.["vote-metadata"] ?? {};
  const voteData = root?.["vote-data"] ?? {};
  const recordedVotes = arrayify(voteData["recorded-vote"]);
  const congress = meta["congress"] ? String(meta["congress"]) : undefined;
  const legisNum = meta["legis-num"] ?? summary.billNumberText ?? "";
  const billInfo = normalizeLegisNum(legisNum, congress);
  const actionDate = meta["action-date"] ?? "";
  const question = meta["vote-question"] ?? "";
  const result = meta["vote-result"] ?? "";
  const description = meta["vote-desc"] ?? summary.title ?? question;

  const votes = recordedVotes
    .map((vote: { legislator?: Record<string, string>; vote?: string }) => {
      const legislator = vote.legislator ?? {};
      const memberId = legislator["name-id"] ?? "";
      if (!memberId) return null;
      return {
        memberId,
        position: vote.vote ?? "Not Voting",
      };
    })
    .filter((vote): vote is { memberId: string; position: string } => !!vote);

  return {
    metadata: {
      congress,
      question,
      result,
      date: normalizeHouseDate(actionDate),
      description,
      billId: billInfo?.billId,
      billNumber: billInfo?.billNumber,
      billTitle: summary.title || undefined,
    },
    votes,
  };
}

function parseSenateMenu(xml: string) {
  const parsed = parser.parse(xml);
  const root = parsed["vote_summary"] ?? {};
  const votes = arrayify(root?.votes?.vote);
  return votes
    .map((vote: Record<string, string>) => ({
      voteNumber: String(vote.vote_number ?? "").padStart(5, "0"),
    }))
    .filter((vote) => vote.voteNumber && vote.voteNumber !== "00000");
}

async function fetchSenateVoteMenu(
  congress: string,
  session: string,
  fetchOptions?: RequestInit
) {
  const response = await fetch(
    `${SENATE_MENU_URL}/vote_menu_${congress}_${session}.xml`,
    {
      ...fetchOptions,
    }
  );
  if (!response.ok) {
    throw new Error(`Senate menu error: ${response.status}`);
  }
  return response.text();
}

async function fetchSenateRollCallXml(
  congress: string,
  session: string,
  voteNumber: string,
  fetchOptions?: RequestInit
) {
  const response = await fetch(
    `${SENATE_VOTE_URL}/vote${congress}${session}/vote_${congress}_${session}_${voteNumber}.xml`,
    {
      ...fetchOptions,
    }
  );
  if (!response.ok) {
    throw new Error(`Senate roll call error: ${response.status}`);
  }
  return response.text();
}

function parseSenateRollCall(xml: string, voteNumber: string) {
  const parsed = parser.parse(xml);
  const root = parsed["roll_call_vote"] ?? {};
  const document = root.document ?? {};
  const members = arrayify(root?.members?.member);
  const congress = root.congress ? String(root.congress) : undefined;
  const docType = document.document_type ?? "";
  const docNumber = document.document_number ?? "";
  const billInfo = normalizeBillId(docType, docNumber, congress);

  const title = root.vote_title ?? root.vote_document_text ?? "";
  const question = root.question ?? root.vote_question_text ?? "";
  const result = root.vote_result ?? root.vote_result_text ?? "";
  const date = normalizeSenateDate(root.vote_date ?? "");

  const votes: { memberId: string; position: string }[] = [];
  members.forEach((member: Record<string, string>) => {
    const lisId = member.lis_member_id;
    if (!lisId) return;
    const bioguide = lookupBioguideFromLis(lisId);
    if (!bioguide) return;
    votes.push({
      memberId: bioguide,
      position: member.vote_cast ?? "Not Voting",
    });
  });

  // Include all votes, not just bill-related ones
  return {
    metadata: {
      congress,
      question,
      result,
      date,
      description: title || question,
      billId: billInfo?.billId,
      billNumber: billInfo?.billNumber || `Senate Vote ${voteNumber}`,
      billTitle: title || question,
    },
    votes,
  };
}

export async function fetchRecentHouseMemberVotes(
  memberId: string,
  year: string,
  limit: number,
  fetchOptions?: RequestInit
): Promise<MemberVote[]> {
  const summaries = await fetchHouseRollSummaries(year, fetchOptions);
  const recent = summaries.slice(0, limit);

  const votes: MemberVote[] = [];
  for (const summary of recent) {
    try {
      const xml = await fetchHouseRollCallXml(year, summary.rollNumber, fetchOptions);
      const parsed = parseHouseRollCall(xml, summary);
      const memberVote = parsed.votes.find((vote) => vote.memberId === memberId);
      if (!memberVote) continue;

      // Include all votes, not just bill-related ones
      votes.push({
        date: parsed.metadata.date,
        chamber: "House",
        position: memberVote.position,
        result: parsed.metadata.result,
        question: parsed.metadata.question,
        description: parsed.metadata.description || parsed.metadata.question,
        billId: parsed.metadata.billId,
        billNumber: parsed.metadata.billNumber || `Roll Call ${summary.rollNumber}`,
        billTitle: parsed.metadata.billTitle || parsed.metadata.description,
        rollCall: summary.rollNumber,
        url: `https://clerk.house.gov/cgi-bin/vote.asp?year=${year}&rollnumber=${summary.rollNumber}`,
      });
    } catch {
      // Skip failed roll calls but continue with others
      continue;
    }
  }

  return votes;
}

export async function fetchRecentSenateMemberVotes(
  memberId: string,
  congress: string,
  session: string,
  limit: number,
  fetchOptions?: RequestInit
): Promise<MemberVote[]> {
  const menuXml = await fetchSenateVoteMenu(congress, session, fetchOptions);
  const votes = parseSenateMenu(menuXml).slice(0, limit);
  const results: MemberVote[] = [];

  for (const vote of votes) {
    try {
      const xml = await fetchSenateRollCallXml(
        congress,
        session,
        vote.voteNumber,
        fetchOptions
      );
      const parsed = parseSenateRollCall(xml, vote.voteNumber);
      const memberVote = parsed.votes.find((item) => item.memberId === memberId);
      if (!memberVote) continue;

      results.push({
        date: parsed.metadata.date,
        chamber: "Senate",
        position: memberVote.position,
        result: parsed.metadata.result,
        question: parsed.metadata.question,
        description: parsed.metadata.description,
        billId: parsed.metadata.billId,
        billNumber: parsed.metadata.billNumber,
        billTitle: parsed.metadata.billTitle,
        rollCall: vote.voteNumber,
        url: `${SENATE_VOTE_URL}/vote${congress}${session}/vote_${congress}_${session}_${vote.voteNumber}.htm`,
      });
    } catch {
      // Skip failed vote fetches but continue with others
      continue;
    }
  }

  return results;
}

function normalizeVotePosition(position: string): VotePosition {
  const p = position.toLowerCase().trim();
  if (p === "yea" || p === "aye" || p === "yes") return "Yea";
  if (p === "nay" || p === "no") return "Nay";
  if (p === "present") return "Present";
  return "Not Voting";
}

function parseParty(partyStr: string): Party {
  const p = partyStr?.toUpperCase()?.charAt(0);
  if (p === "D") return "D";
  if (p === "R") return "R";
  return "I";
}

function parseHouseDetailedRollCall(
  xml: string,
  year: string,
  rollNumber: string
): DetailedRollCall | null {
  try {
    const parsed = parser.parse(xml);
    const root = parsed["rollcall-vote"];
    if (!root) return null;

    const meta = root["vote-metadata"] ?? {};
    const voteData = root["vote-data"] ?? {};
    const recordedVotes = arrayify(voteData["recorded-vote"]);

    const congress = meta["congress"] ? String(meta["congress"]) : "";
    const legisNum = meta["legis-num"] ?? "";
    const billInfo = normalizeLegisNum(legisNum, congress);
    const actionDate = meta["action-date"] ?? "";
    const question = meta["vote-question"] ?? "";
    const result = meta["vote-result"] ?? "";
    const description = meta["vote-desc"] ?? question;

    const votes: RollCallMemberVote[] = [];
    let yea = 0, nay = 0, notVoting = 0, present = 0;

    recordedVotes.forEach((vote: Record<string, unknown>) => {
      const legislator = (vote.legislator ?? {}) as Record<string, string>;
      const memberId = legislator["name-id"] ?? "";
      if (!memberId) return;

      const position = normalizeVotePosition(String(vote.vote ?? ""));
      const memberName = [
        legislator["unaccented-name"] || legislator["name"],
        legislator["first-name"],
        legislator["last-name"],
      ]
        .filter(Boolean)
        .join(" ")
        .trim() || memberId;

      votes.push({
        memberId,
        memberName: memberName || legislator["unaccented-name"] || memberId,
        party: parseParty(legislator["party"] ?? ""),
        state: legislator["state"] ?? "",
        position,
      });

      if (position === "Yea") yea++;
      else if (position === "Nay") nay++;
      else if (position === "Present") present++;
      else notVoting++;
    });

    return {
      rollCall: rollNumber,
      chamber: "House",
      date: normalizeHouseDate(actionDate),
      congress,
      question,
      result,
      description,
      billId: billInfo?.billId,
      billNumber: billInfo?.billNumber,
      totals: { yea, nay, notVoting, present },
      votes,
    };
  } catch {
    return null;
  }
}

function parseSenateDetailedRollCall(
  xml: string,
  congress: string,
  session: string,
  voteNumber: string
): DetailedRollCall | null {
  try {
    const parsed = parser.parse(xml);
    const root = parsed["roll_call_vote"] ?? {};
    if (!root) return null;

    const document = root.document ?? {};
    const members = arrayify(root?.members?.member);

    const docType = document.document_type ?? "";
    const docNumber = document.document_number ?? "";
    const billInfo = normalizeBillId(docType, docNumber, congress);

    const title = root.vote_title ?? root.vote_document_text ?? "";
    const question = root.question ?? root.vote_question_text ?? "";
    const result = root.vote_result ?? root.vote_result_text ?? "";
    const date = normalizeSenateDate(root.vote_date ?? "");

    const votes: RollCallMemberVote[] = [];
    let yea = 0, nay = 0, notVoting = 0, present = 0;

    members.forEach((member: Record<string, string>) => {
      const lisId = member.lis_member_id;
      if (!lisId) return;

      const bioguide = lookupBioguideFromLis(lisId);
      const position = normalizeVotePosition(member.vote_cast ?? "");
      const memberName = [member.first_name, member.last_name]
        .filter(Boolean)
        .join(" ")
        .trim();

      votes.push({
        memberId: bioguide || lisId,
        memberName: memberName || lisId,
        party: parseParty(member.party ?? ""),
        state: member.state ?? "",
        position,
      });

      if (position === "Yea") yea++;
      else if (position === "Nay") nay++;
      else if (position === "Present") present++;
      else notVoting++;
    });

    return {
      rollCall: voteNumber,
      chamber: "Senate",
      date,
      congress,
      question,
      result,
      description: title || question,
      billId: billInfo?.billId,
      billNumber: billInfo?.billNumber,
      totals: { yea, nay, notVoting, present },
      votes,
    };
  } catch {
    return null;
  }
}

export async function fetchHouseRollCall(
  year: string,
  rollNumber: string,
  fetchOptions?: RequestInit
): Promise<DetailedRollCall | null> {
  try {
    const xml = await fetchHouseRollCallXml(year, rollNumber, fetchOptions);
    return parseHouseDetailedRollCall(xml, year, rollNumber);
  } catch {
    return null;
  }
}

export async function fetchSenateRollCall(
  congress: string,
  session: string,
  voteNumber: string,
  fetchOptions?: RequestInit
): Promise<DetailedRollCall | null> {
  try {
    const xml = await fetchSenateRollCallXml(congress, session, voteNumber, fetchOptions);
    return parseSenateDetailedRollCall(xml, congress, session, voteNumber);
  } catch {
    return null;
  }
}

// Fetch roll calls for a specific bill by searching recent roll calls
export async function fetchBillRollCalls(
  billId: string,
  chamber: "House" | "Senate",
  year: string,
  congress: string,
  session: string,
  fetchOptions?: RequestInit
): Promise<DetailedRollCall[]> {
  const rollCalls: DetailedRollCall[] = [];
  const normalizedBillId = billId.toLowerCase().replace(/[^a-z0-9]/g, "");

  try {
    if (chamber === "House") {
      const summaries = await fetchHouseRollSummaries(year, fetchOptions);
      // Check recent roll calls for this bill
      for (const summary of summaries.slice(0, 100)) {
        const xml = await fetchHouseRollCallXml(year, summary.rollNumber, fetchOptions);
        const rollCall = parseHouseDetailedRollCall(xml, year, summary.rollNumber);
        if (rollCall?.billId) {
          const rcBillId = rollCall.billId.toLowerCase().replace(/[^a-z0-9]/g, "");
          if (rcBillId === normalizedBillId || rcBillId.includes(normalizedBillId)) {
            rollCalls.push(rollCall);
          }
        }
      }
    } else {
      const menuXml = await fetchSenateVoteMenu(congress, session, fetchOptions);
      const votes = parseSenateMenu(menuXml).slice(0, 100);
      for (const vote of votes) {
        const xml = await fetchSenateRollCallXml(congress, session, vote.voteNumber, fetchOptions);
        const rollCall = parseSenateDetailedRollCall(xml, congress, session, vote.voteNumber);
        if (rollCall?.billId) {
          const rcBillId = rollCall.billId.toLowerCase().replace(/[^a-z0-9]/g, "");
          if (rcBillId === normalizedBillId || rcBillId.includes(normalizedBillId)) {
            rollCalls.push(rollCall);
          }
        }
      }
    }
  } catch {
    // Return whatever we found
  }

  return rollCalls;
}
