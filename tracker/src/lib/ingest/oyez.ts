import type {
  SupremeCourtCase,
  CaseTimeline,
  JusticeVote,
  CaseAdvocate,
  WrittenOpinion,
  OralArgument,
} from "@/lib/types";

const OYEZ_API_BASE = "https://api.oyez.org";

interface OyezJustice {
  member?: {
    ID?: number;
    name?: string;
  };
  vote?: string;
  opinion_type?: string;
  joining?: Array<{ name?: string }>;
}

interface OyezDecision {
  votes?: Array<OyezJustice>;
  majority_vote?: number;
  minority_vote?: number;
  winning_party?: string;
  decision_type?: string;
}

interface OyezAdvocate {
  advocate?: {
    name?: string;
    ID?: number;
  };
  advocate_description?: string;
}

interface OyezWrittenOpinion {
  type?: { value?: string };
  justia_opinion_id?: string;
  justia_opinion_url?: string;
  judge_full_name?: string;
  author?: { name?: string };
}

interface OyezOralArgument {
  title?: string;
  href?: string;
  public_note?: string;
  media_file?: Array<{
    mime?: string;
    href?: string;
    size?: number;
  }>;
}

interface OyezCase {
  ID?: number;
  id?: number;
  name?: string;
  docket_number?: string;
  term?: string;
  question?: string;
  description?: string;
  conclusion?: string;
  facts_of_the_case?: string;
  first_party?: string;
  first_party_label?: string;
  second_party?: string;
  second_party_label?: string;
  timeline?: Array<{
    event?: string;
    dates?: Array<number | { date?: number }>;
  }>;
  lower_court?: {
    name?: string;
  };
  justia_url?: string;
  href?: string;
  citation?: {
    volume?: string;
    page?: string;
    year?: string;
  };
  decisions?: OyezDecision[];
  advocates?: OyezAdvocate[];
  written_opinion?: OyezWrittenOpinion[];
  oral_argument_audio?: OyezOralArgument[];
  related_cases?: Array<{ name?: string; href?: string }>;
}

function stripHtmlTags(html: string | undefined): string {
  if (!html) return "";
  return html
    .replace(/<[^>]*>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}

function parseOyezDate(timestamp: number | undefined): string | undefined {
  if (!timestamp) return undefined;
  const date = new Date(timestamp * 1000);
  return date.toISOString().split("T")[0];
}

function parseTimeline(timeline: OyezCase["timeline"]): CaseTimeline[] {
  if (!timeline || !Array.isArray(timeline)) return [];

  return timeline
    .filter((item) => item.event && item.dates?.[0])
    .map((item) => {
      // dates can be either raw timestamps or objects with date property
      const rawDate = item.dates![0];
      const timestamp = typeof rawDate === "number" ? rawDate : rawDate?.date;
      return {
        event: item.event!,
        date: parseOyezDate(timestamp) || "",
      };
    })
    .filter((item) => item.date);
}

function findTimelineDate(
  timeline: CaseTimeline[],
  event: string
): string | undefined {
  const item = timeline.find((t) =>
    t.event.toLowerCase().includes(event.toLowerCase())
  );
  return item?.date;
}

function parseJusticeVotes(decisions: OyezDecision[] | undefined): JusticeVote[] {
  if (!decisions?.[0]?.votes) return [];

  return decisions[0].votes
    .filter((v) => v.member?.name)
    .map((v) => ({
      id: String(v.member?.ID || ""),
      name: v.member!.name!,
      vote: v.vote === "majority" ? "majority" : "minority",
      opinion: v.opinion_type,
    }));
}

function parseAdvocates(advocates: OyezAdvocate[] | undefined): CaseAdvocate[] {
  if (!advocates) return [];

  return advocates
    .filter((a) => a.advocate?.name)
    .map((a) => {
      const desc = (a.advocate_description || "").toLowerCase();
      let side: CaseAdvocate["side"] = "amicus";
      if (desc.includes("petitioner") || desc.includes("appellant")) {
        side = "petitioner";
      } else if (desc.includes("respondent") || desc.includes("appellee")) {
        side = "respondent";
      }

      return {
        name: a.advocate!.name!,
        description: a.advocate_description,
        side,
      };
    });
}

function parseWrittenOpinions(
  opinions: OyezWrittenOpinion[] | undefined
): WrittenOpinion[] {
  if (!opinions) return [];

  return opinions
    .filter((o) => o.type?.value)
    .map((o) => ({
      type: o.type!.value!,
      author: o.judge_full_name || o.author?.name,
      pdfUrl: o.justia_opinion_url,
    }));
}

function parseOralArguments(
  audio: OyezOralArgument[] | undefined
): OralArgument[] {
  if (!audio) return [];

  return audio.map((a) => {
    const mp3 = a.media_file?.find((m) => m.mime === "audio/mpeg");
    return {
      title: a.title || a.public_note,
      audioUrl: mp3?.href,
      duration: mp3?.size,
    };
  });
}

function getMajorityAuthor(decisions: OyezDecision[] | undefined): string | undefined {
  if (!decisions?.[0]?.votes) return undefined;

  const author = decisions[0].votes.find(
    (v) => v.vote === "majority" && v.opinion_type === "majority"
  );
  return author?.member?.name;
}

function getDissentAuthors(decisions: OyezDecision[] | undefined): string[] {
  if (!decisions?.[0]?.votes) return [];

  return decisions[0].votes
    .filter((v) => v.opinion_type === "dissent")
    .map((v) => v.member?.name)
    .filter((n): n is string => !!n);
}

function transformCase(oyezCase: OyezCase, full = false): SupremeCourtCase {
  const timeline = parseTimeline(oyezCase.timeline);
  const decision = oyezCase.decisions?.[0];

  const baseCase: SupremeCourtCase = {
    id: String(oyezCase.ID || oyezCase.id || ""),
    name: oyezCase.name || "Unknown Case",
    docketNumber: oyezCase.docket_number?.trim() || "",
    term: oyezCase.term || "",
    arguedDate: findTimelineDate(timeline, "Argued"),
    decidedDate: findTimelineDate(timeline, "Decided"),
    grantedDate: findTimelineDate(timeline, "Granted"),
    question: stripHtmlTags(oyezCase.question),
    questionRaw: oyezCase.question,
    description: oyezCase.description,
    timeline,
    justiaUrl: oyezCase.justia_url,
    oyezUrl: oyezCase.href
      ? `https://www.oyez.org${oyezCase.href.replace("https://api.oyez.org", "")}`
      : undefined,
    citation: oyezCase.citation
      ? {
          volume: oyezCase.citation.volume,
          page: oyezCase.citation.page,
          year: oyezCase.citation.year,
        }
      : undefined,
    votes: decision
      ? {
          majority: decision.majority_vote || 0,
          minority: decision.minority_vote || 0,
        }
      : undefined,
    decisionType: decision?.decision_type,
    winningParty: decision?.winning_party,
  };

  if (full) {
    baseCase.factsOfTheCase = stripHtmlTags(oyezCase.facts_of_the_case);
    baseCase.conclusion = stripHtmlTags(oyezCase.conclusion);
    baseCase.firstParty = oyezCase.first_party;
    baseCase.firstPartyLabel = oyezCase.first_party_label;
    baseCase.secondParty = oyezCase.second_party;
    baseCase.secondPartyLabel = oyezCase.second_party_label;
    baseCase.lowerCourt = oyezCase.lower_court?.name;
    baseCase.advocates = parseAdvocates(oyezCase.advocates);
    baseCase.justiceVotes = parseJusticeVotes(oyezCase.decisions);
    baseCase.writtenOpinions = parseWrittenOpinions(oyezCase.written_opinion);
    baseCase.oralArguments = parseOralArguments(oyezCase.oral_argument_audio);
    baseCase.majorityAuthor = getMajorityAuthor(oyezCase.decisions);
    baseCase.dissentAuthors = getDissentAuthors(oyezCase.decisions);
    baseCase.relatedCases = oyezCase.related_cases
      ?.filter((r) => r.name)
      .map((r) => ({
        name: r.name!,
        href: r.href || "",
      }));
  }

  return baseCase;
}

export async function fetchSupremeCourtCases(
  term?: string,
  limit: number = 100,
  fetchOptions?: RequestInit
): Promise<SupremeCourtCase[]> {
  const params = new URLSearchParams();
  params.set("per_page", String(limit));

  if (term) {
    params.set("filter", `term:${term}`);
  }

  const url = `${OYEZ_API_BASE}/cases?${params.toString()}`;

  const response = await fetch(url, {
    ...fetchOptions,
    headers: {
      Accept: "application/json",
      ...fetchOptions?.headers,
    },
  });

  if (!response.ok) {
    throw new Error(`Oyez API error: ${response.status}`);
  }

  const data: OyezCase[] = await response.json();

  if (!Array.isArray(data)) {
    return [];
  }

  return data.map((c) => transformCase(c, false)).filter((c) => c.id && c.name);
}

export async function fetchSupremeCourtCaseByDocket(
  term: string,
  docketNumber: string,
  fetchOptions?: RequestInit
): Promise<SupremeCourtCase | null> {
  const url = `${OYEZ_API_BASE}/cases/${term}/${docketNumber}`;

  const response = await fetch(url, {
    ...fetchOptions,
    headers: {
      Accept: "application/json",
      ...fetchOptions?.headers,
    },
  });

  if (!response.ok) {
    if (response.status === 404) return null;
    throw new Error(`Oyez API error: ${response.status}`);
  }

  const data: OyezCase = await response.json();
  return transformCase(data, true);
}

export async function fetchSupremeCourtCase(
  caseId: string,
  fetchOptions?: RequestInit
): Promise<SupremeCourtCase | null> {
  const url = `${OYEZ_API_BASE}/cases/${caseId}`;

  const response = await fetch(url, {
    ...fetchOptions,
    headers: {
      Accept: "application/json",
      ...fetchOptions?.headers,
    },
  });

  if (!response.ok) {
    if (response.status === 404) return null;
    throw new Error(`Oyez API error: ${response.status}`);
  }

  const data: OyezCase = await response.json();
  return transformCase(data, true);
}
