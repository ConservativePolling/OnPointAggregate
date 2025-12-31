import type {
  Bill,
  BillAction,
  BillStatus,
  BillVersion,
  Member,
  MemberGroup,
  MemberStatus,
  Party,
  ServiceTerm,
} from "@/lib/types";

const BASE_URL = "https://api.congress.gov/v3";

interface CongressGovPagination {
  next?: string | null;
}

interface CongressGovResponse<T> {
  pagination?: CongressGovPagination;
  [key: string]: unknown;
  members?: T[];
  bills?: T[];
}

interface CongressGovMemberCommittee {
  name?: string;
  chamber?: string;
  type?: string;
}

interface CongressGovMemberDetail {
  bioguideId?: string;
  name?: string;
  firstName?: string;
  lastName?: string;
  directOrderName?: string;
  invertedOrderName?: string;
  partyHistory?: Array<{
    partyName?: string;
    startYear?: number;
    endYear?: number;
  }>;
  terms?: Array<{
    chamber?: string;
    startYear?: number;
    endYear?: number;
    memberType?: string;
    stateCode?: string;
    stateName?: string;
    district?: number;
  }>;
  depiction?: {
    imageUrl?: string;
  };
  officialWebsiteUrl?: string;
  addressInformation?: {
    officeAddress?: string;
    city?: string;
    phoneNumber?: string;
  };
}

interface CongressGovMember {
  bioguideId?: string;
  name?: string;
  firstName?: string;
  lastName?: string;
  partyName?: string;
  party?: string;
  state?: string;
  district?: string;
  currentMember?: boolean;
  terms?: {
    item?: Array<{
      chamber?: string;
      startYear?: string;
      endYear?: string;
    }>;
  };
}

interface CongressGovBill {
  billNumber?: string;
  number?: string;
  billType?: string;
  type?: string;
  congress?: string | number;
  congressNumber?: string | number;
  title?: string;
  introducedDate?: string;
  summary?: string | { text?: string };
  summaries?: Array<{ text?: string }> | { summaries?: Array<{ text?: string }> };
  sponsor?: {
    bioguideId?: string;
    name?: string;
  };
  sponsors?: Array<{
    bioguideId?: string;
    name?: string;
  }>;
  latestAction?: {
    actionDate?: string;
    text?: string;
  };
}

interface CongressGovBillSummary {
  text?: string;
  actionDate?: string;
  updateDate?: string;
}

interface CongressGovBillSummariesResponse {
  summaries?: CongressGovBillSummary[] | { summaries?: CongressGovBillSummary[] };
}

interface CongressGovBillAction {
  actionDate?: string;
  text?: string;
  chamber?: string;
}

interface CongressGovBillActionsResponse {
  actions?: CongressGovBillAction[];
}

interface CongressGovBillTextFormat {
  type?: string;
  url?: string;
}

interface CongressGovBillTextVersion {
  type?: string;
  date?: string;
  formats?: CongressGovBillTextFormat[];
}

interface CongressGovBillTextResponse {
  textVersions?: CongressGovBillTextVersion[];
}

type CongressGovMemberLegislationResponse =
  | {
      bills?: CongressGovBill[];
      sponsoredLegislation?: CongressGovBill[];
      cosponsoredLegislation?: CongressGovBill[];
      legislation?: CongressGovBill[];
    }
  | {
      bills?: { bills?: CongressGovBill[] };
      sponsoredLegislation?: { bills?: CongressGovBill[] };
      cosponsoredLegislation?: { bills?: CongressGovBill[] };
      legislation?: { bills?: CongressGovBill[] };
    };

function buildHeaders(fetchOptions: RequestInit | undefined, apiKey: string) {
  const headers = new Headers(fetchOptions?.headers ?? {});
  headers.set("Accept", "application/json");
  headers.set("User-Agent", "PoliticalTracker/1.0");
  headers.set("X-API-Key", apiKey);
  return headers;
}

function ensureApiKey(url: string, apiKey: string) {
  try {
    const nextUrl = new URL(url, BASE_URL);
    if (!nextUrl.searchParams.has("api_key")) {
      nextUrl.searchParams.set("api_key", apiKey);
    }
    return nextUrl.toString();
  } catch {
    return url;
  }
}

async function fetchPaginatedFlexible<T>(
  path: string,
  apiKey: string,
  fetchOptions: RequestInit | undefined,
  maxPages: number | undefined,
  extractItems: (data: unknown) => T[]
) {
  const base = `${BASE_URL}/${path}`;
  const separator = base.includes("?") ? "&" : "?";
  let url: string | undefined = `${base}${separator}api_key=${apiKey}&limit=250`;
  const results: T[] = [];
  let pageCount = 0;

  while (url) {
    pageCount += 1;
    const headers = buildHeaders(fetchOptions, apiKey);

    try {
      const response = await fetch(url, { ...fetchOptions, headers });
      if (!response.ok) {
        // On error, return what we have so far instead of throwing
        console.warn(`Congress.gov error on page ${pageCount}: ${response.status}, returning ${results.length} results collected so far`);
        break;
      }
      const data = (await response.json()) as unknown;
      results.push(...extractItems(data));
      const pagination = (data as { pagination?: CongressGovPagination })
        ?.pagination;
      const next = pagination?.next ?? undefined;
      url = next ? ensureApiKey(next, apiKey) : undefined;
      if (maxPages && pageCount >= maxPages) {
        break;
      }
    } catch (error) {
      // On timeout/abort or network error, return accumulated results
      const isAbort = error instanceof Error && error.name === "AbortError";
      console.warn(
        `${isAbort ? "Timeout" : "Error"} fetching page ${pageCount}, returning ${results.length} results collected so far:`,
        error
      );
      break;
    }
  }

  return results;
}

async function fetchPaginated<T>(
  path: string,
  listKey: string,
  apiKey: string,
  fetchOptions?: RequestInit,
  maxPages?: number
) {
  const base = `${BASE_URL}/${path}`;
  const separator = base.includes("?") ? "&" : "?";
  let url: string | undefined = `${base}${separator}api_key=${apiKey}&limit=250`;
  const results: T[] = [];
  let pageCount = 0;

  while (url) {
    pageCount += 1;
    const headers = buildHeaders(fetchOptions, apiKey);

    try {
      const response = await fetch(url, {
        ...fetchOptions,
        headers,
      });
      if (!response.ok) {
        // On error, return what we have so far instead of throwing
        console.warn(`Congress.gov error on page ${pageCount}: ${response.status}, returning ${results.length} results collected so far`);
        break;
      }
      const data = (await response.json()) as CongressGovResponse<T>;
      const page = (data[listKey] as T[] | undefined) ?? [];
      results.push(...page);
      const next = data.pagination?.next ?? undefined;
      url = next ? ensureApiKey(next, apiKey) : undefined;
      if (maxPages && pageCount >= maxPages) {
        break;
      }
    } catch (error) {
      // On timeout/abort or network error, return accumulated results
      const isAbort = error instanceof Error && error.name === "AbortError";
      console.warn(
        `${isAbort ? "Timeout" : "Error"} fetching page ${pageCount}, returning ${results.length} results collected so far:`,
        error
      );
      break;
    }
  }

  return results;
}

function inferParty(value?: string): Party {
  const normalized = value?.toUpperCase();
  if (normalized === "DEMOCRATIC" || normalized === "DEMOCRAT" || normalized === "D") return "D";
  if (normalized === "REPUBLICAN" || normalized === "R") return "R";
  if (normalized === "INDEPENDENT" || normalized === "I") return "I";
  return "Nonpartisan";
}

function inferStatus(currentMember?: boolean): MemberStatus {
  if (currentMember === false) return "inactive";
  return "active";
}

function inferGroup(member: CongressGovMember): MemberGroup {
  // Check if they have a district (Representatives)
  if (member.district) return "House";
  // Check the most recent term's chamber
  const terms = member.terms?.item;
  if (terms && terms.length > 0) {
    const latestTerm = terms[terms.length - 1];
    const chamber = latestTerm.chamber?.toLowerCase() ?? "";
    if (chamber.includes("house")) return "House";
    if (chamber.includes("senate")) return "Senate";
  }
  // If state but no district, likely a Senator
  if (member.state) return "Senate";
  return "House";
}

function normalizeName(member: CongressGovMember): string {
  if (member.name) return member.name;
  return [member.firstName, member.lastName].filter(Boolean).join(" ") || "Unknown";
}

function normalizeTerms(member: CongressGovMember): ServiceTerm[] {
  const terms = member.terms?.item;
  if (!terms || terms.length === 0) return [];

  return terms
    .filter((term) => term.startYear)
    .map((term) => ({
      office: term.chamber
        ? `U.S. ${term.chamber}`
        : "U.S. Congress",
      start: `${term.startYear}-01-03`,
      end: term.endYear ? `${term.endYear}-01-03` : undefined,
    }))
    .sort((a, b) => a.start.localeCompare(b.start));
}

function inferBillStatus(actionText?: string): BillStatus {
  if (!actionText) return "Introduced";
  const lower = actionText.toLowerCase();
  if (lower.includes("signed")) return "Signed";
  if (lower.includes("veto")) return "Vetoed";
  if (lower.includes("passed house")) return "Passed House";
  if (lower.includes("passed senate")) return "Passed Senate";
  if (lower.includes("presented") || lower.includes("to president")) {
    return "To President";
  }
  if (lower.includes("reported")) return "Reported";
  if (lower.includes("committee") || lower.includes("referred")) {
    return "In Committee";
  }
  return "Introduced";
}

function normalizeBillType(value: string) {
  return value.toLowerCase().replace(/[^a-z]/g, "");
}

function normalizeBillNumber(value: string) {
  return value.replace(/[^0-9]/g, "");
}

function formatBillTypeDisplay(value: string) {
  const clean = normalizeBillType(value);
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
  return map[clean] ?? value.toUpperCase();
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function extractSummary(bill: CongressGovBill) {
  if (typeof bill.summary === "string") return bill.summary;
  if (bill.summary && typeof bill.summary === "object") {
    const text = bill.summary.text;
    if (text) return text;
  }
  if (Array.isArray(bill.summaries)) {
    return bill.summaries[0]?.text ?? "";
  }
  if (bill.summaries && "summaries" in bill.summaries) {
    const summaries = bill.summaries.summaries ?? [];
    return summaries[0]?.text ?? "";
  }
  return "";
}

function normalizeBillSummary(summaries: CongressGovBillSummary[]) {
  const withText = summaries.filter((summary) => summary.text?.trim());
  if (withText.length === 0) return "";

  const sorted = [...withText].sort((a, b) => {
    const dateA = a.updateDate ?? a.actionDate ?? "";
    const dateB = b.updateDate ?? b.actionDate ?? "";
    return dateB.localeCompare(dateA);
  });
  return sorted[0]?.text?.trim() ?? "";
}

function unwrapBillEntry(entry: unknown): CongressGovBill | undefined {
  if (!entry || typeof entry !== "object") return undefined;
  const record = entry as { bill?: CongressGovBill };
  return record.bill ?? (entry as CongressGovBill);
}

function extractMemberBills(data: unknown): CongressGovBill[] {
  if (!data || typeof data !== "object") return [];
  const payload = data as CongressGovMemberLegislationResponse;
  const candidates: Array<unknown> = [
    payload.bills,
    payload.sponsoredLegislation,
    payload.cosponsoredLegislation,
    payload.legislation,
  ];

  for (const candidate of candidates) {
    if (Array.isArray(candidate)) {
      return candidate
        .map(unwrapBillEntry)
        .filter((bill): bill is CongressGovBill => !!bill);
    }
    if (candidate && typeof candidate === "object") {
      const nested = candidate as { bills?: CongressGovBill[] };
      if (Array.isArray(nested.bills)) {
        return nested.bills
          .map(unwrapBillEntry)
          .filter((bill): bill is CongressGovBill => !!bill);
      }
    }
  }

  return [];
}

function normalizeBill(bill: CongressGovBill): Bill {
  const numberRaw = `${bill.billNumber ?? bill.number ?? ""}`.trim();
  const number = normalizeBillNumber(numberRaw);
  const typeRaw = bill.billType ?? bill.type ?? "";
  const type = normalizeBillType(typeRaw);
  const congressRaw = bill.congress ?? bill.congressNumber ?? "";
  const congress = congressRaw ? String(congressRaw) : "";
  const idParts = [congress, type, number].filter(Boolean);
  let billId = idParts.join("-").toLowerCase();
  if (!billId) {
    billId = slugify(bill.title ?? "bill");
  }
  const sponsorId =
    bill.sponsors?.[0]?.bioguideId ?? bill.sponsor?.bioguideId ?? "";
  const latestActionText = bill.latestAction?.text ?? "";
  const status = inferBillStatus(latestActionText);
  const displayNumber =
    type && number
      ? `${formatBillTypeDisplay(typeRaw)} ${number}`
      : numberRaw || bill.title || "Bill";

  // Infer chamber from bill type and latest action text
  const inferredChamber = (): "House" | "Senate" | "Executive" => {
    const actionText = latestActionText.toLowerCase();
    if (actionText.includes("senate") || actionText.includes("s.")) return "Senate";
    if (actionText.includes("house") || actionText.includes("h.r.")) return "House";
    // Use bill type as fallback
    const billType = type.toLowerCase();
    if (billType.startsWith("s") && !billType.startsWith("sres")) return "Senate";
    if (billType.startsWith("h")) return "House";
    return "House";
  };

  return {
    id: billId,
    congress: congress || undefined,
    number: displayNumber,
    title: bill.title ?? "Untitled Bill",
    summary: extractSummary(bill),
    sponsorId,
    status,
    introducedDate: bill.introducedDate ?? new Date().toISOString(),
    lastAction: latestActionText,
    topics: [],
    actions: bill.latestAction?.actionDate
      ? [
          {
            date: bill.latestAction.actionDate,
            chamber: inferredChamber(),
            action: bill.latestAction.text ?? "Latest action recorded.",
          },
        ]
      : [],
    votes: [],
    versions: [],
  };
}

function normalizeActionChamber(
  action: CongressGovBillAction
): BillAction["chamber"] {
  const chamber = action.chamber?.toLowerCase() ?? "";
  const text = action.text?.toLowerCase() ?? "";
  const combined = `${chamber} ${text}`;
  if (combined.includes("senate")) return "Senate";
  if (combined.includes("house")) return "House";
  return "Executive";
}

function normalizeBillActions(actions: CongressGovBillAction[]): BillAction[] {
  const seen = new Set<string>();
  return actions
    .filter((action) => action.actionDate && action.text)
    .map((action) => ({
      date: action.actionDate ?? new Date().toISOString(),
      chamber: normalizeActionChamber(action),
      action: action.text ?? "",
    }))
    .filter((action) => {
      const key = `${action.date}|${action.chamber}|${action.action}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
}

function normalizeBillVersions(
  versions: CongressGovBillTextVersion[]
): BillVersion[] {
  const output: BillVersion[] = [];

  versions.forEach((version) => {
    const versionLabel = version.type?.trim() || "Bill text";
    version.formats?.forEach((format) => {
      if (!format.url) return;
      const formatLabel = format.type?.trim();
      output.push({
        label: formatLabel ? `${versionLabel} · ${formatLabel}` : versionLabel,
        url: format.url,
      });
    });
  });

  return output;
}

export async function fetchCongressMembers(
  apiKey: string,
  fetchOptions?: RequestInit
): Promise<Member[]> {
  const rawMembers = await fetchPaginated<CongressGovMember>(
    "member?currentMember=true",
    "members",
    apiKey,
    fetchOptions
  );

  return rawMembers.map((member) => {
    const name = normalizeName(member);
    const terms = normalizeTerms(member);
    const group = inferGroup(member);
    return {
      id: member.bioguideId ?? name.toLowerCase().replace(/\s+/g, "-"),
      name,
      roleTitle: group === "House" ? "Representative" : "Senator",
      group,
      party: inferParty(member.partyName ?? member.party),
      state: member.state,
      district: member.district,
      status: inferStatus(member.currentMember),
      serviceStart: terms[0]?.start ?? new Date().toISOString(),
      terms,
      committees: [],
      focusAreas: [],
    };
  });
}

export async function fetchCongressBills(
  apiKey: string,
  fetchOptions?: RequestInit,
  maxPages?: number,
  congress?: string
): Promise<Bill[]> {
  const congressFilter = congress?.trim();
  const path = congressFilter ? `bill?congress=${congressFilter}` : "bill";
  const rawBills = await fetchPaginated<CongressGovBill>(
    path,
    "bills",
    apiKey,
    fetchOptions,
    maxPages
  );

  return rawBills.map(normalizeBill);
}

async function fetchMemberLegislation(
  apiKey: string,
  memberId: string,
  pathSegment: string,
  fetchOptions?: RequestInit,
  maxPages?: number,
  congress?: string
): Promise<Bill[]> {
  const congressQuery = congress ? `?congress=${congress}` : "";
  const path = `member/${memberId}/${pathSegment}${congressQuery}`;
  const bills = await fetchPaginatedFlexible<CongressGovBill>(
    path,
    apiKey,
    fetchOptions,
    maxPages,
    (data) => extractMemberBills(data)
  );

  return bills.map(normalizeBill);
}

export async function fetchMemberSponsoredBills(
  apiKey: string,
  memberId: string,
  fetchOptions?: RequestInit,
  maxPages?: number,
  congress?: string
): Promise<Bill[]> {
  return fetchMemberLegislation(
    apiKey,
    memberId,
    "sponsored-legislation",
    fetchOptions,
    maxPages,
    congress
  );
}

export async function fetchMemberCosponsoredBills(
  apiKey: string,
  memberId: string,
  fetchOptions?: RequestInit,
  maxPages?: number,
  congress?: string
): Promise<Bill[]> {
  return fetchMemberLegislation(
    apiKey,
    memberId,
    "cosponsored-legislation",
    fetchOptions,
    maxPages,
    congress
  );
}

async function fetchCongressBillActions(
  apiKey: string,
  congress: string,
  type: string,
  number: string,
  fetchOptions?: RequestInit
): Promise<BillAction[]> {
  const url = `${BASE_URL}/bill/${congress}/${type}/${number}/actions?api_key=${apiKey}&limit=250`;
  const headers = buildHeaders(fetchOptions, apiKey);
  const response = await fetch(url, { ...fetchOptions, headers });
  if (!response.ok) {
    throw new Error(`Congress.gov error: ${response.status}`);
  }
  const data = (await response.json()) as CongressGovBillActionsResponse;
  return normalizeBillActions(data.actions ?? []);
}

async function fetchCongressBillTextVersions(
  apiKey: string,
  congress: string,
  type: string,
  number: string,
  fetchOptions?: RequestInit
): Promise<BillVersion[]> {
  const url = `${BASE_URL}/bill/${congress}/${type}/${number}/text?api_key=${apiKey}`;
  const headers = buildHeaders(fetchOptions, apiKey);
  const response = await fetch(url, { ...fetchOptions, headers });
  if (!response.ok) {
    throw new Error(`Congress.gov error: ${response.status}`);
  }
  const data = (await response.json()) as CongressGovBillTextResponse;
  return normalizeBillVersions(data.textVersions ?? []);
}

async function fetchCongressBillSummary(
  apiKey: string,
  congress: string,
  type: string,
  number: string,
  fetchOptions?: RequestInit
): Promise<string> {
  const url = `${BASE_URL}/bill/${congress}/${type}/${number}/summaries?api_key=${apiKey}`;
  const headers = buildHeaders(fetchOptions, apiKey);
  const response = await fetch(url, { ...fetchOptions, headers });
  if (!response.ok) {
    throw new Error(`Congress.gov error: ${response.status}`);
  }
  const data = (await response.json()) as CongressGovBillSummariesResponse;
  const payload = data.summaries;
  const summaries = Array.isArray(payload)
    ? payload
    : payload?.summaries ?? [];
  return normalizeBillSummary(summaries);
}

export async function fetchCongressBillById(
  apiKey: string,
  id: string,
  fetchOptions?: RequestInit
): Promise<Bill | undefined> {
  const match = id.match(/^(\d+)-([a-z.]+)-(\d+)$/i);
  if (!match) return undefined;

  const [, congress, typeRaw, number] = match;
  const type = normalizeBillType(typeRaw);
  if (!type) return undefined;
  const url = `${BASE_URL}/bill/${congress}/${type}/${number}?api_key=${apiKey}`;
  const headers = buildHeaders(fetchOptions, apiKey);
  const response = await fetch(url, { ...fetchOptions, headers });
  if (!response.ok) {
    throw new Error(`Congress.gov error: ${response.status}`);
  }
  const data = (await response.json()) as { bill?: CongressGovBill };
  const detail = data.bill ?? (data as unknown as CongressGovBill);
  if (!detail) return undefined;

  const [actions, versions, summaryText] = await Promise.all([
    fetchCongressBillActions(apiKey, congress, type, number, fetchOptions).catch(
      () => []
    ),
    fetchCongressBillTextVersions(apiKey, congress, type, number, fetchOptions).catch(
      () => []
    ),
    fetchCongressBillSummary(apiKey, congress, type, number, fetchOptions).catch(
      () => ""
    ),
  ]);

  const normalized = normalizeBill(detail);
  return {
    ...normalized,
    summary: summaryText || normalized.summary,
    actions: actions.length ? actions : normalized.actions,
    versions,
  };
}

interface CongressGovMemberDetailResponse {
  member?: CongressGovMemberDetail;
}

interface CongressGovMemberCommitteesResponse {
  committeeMemberships?: Array<{
    item?: CongressGovMemberCommittee[];
  }>;
  committees?: CongressGovMemberCommittee[];
}

export interface MemberDetails {
  committees: string[];
  imageUrl?: string;
  websiteUrl?: string;
  officeAddress?: string;
  phoneNumber?: string;
}

export async function fetchMemberDetails(
  apiKey: string,
  memberId: string,
  fetchOptions?: RequestInit
): Promise<MemberDetails> {
  const headers = buildHeaders(fetchOptions, apiKey);

  const result: MemberDetails = {
    committees: [],
  };

  // Fetch member details and committees in parallel
  try {
    const [detailsRes, committeesRes] = await Promise.allSettled([
      fetch(`${BASE_URL}/member/${memberId}?api_key=${apiKey}`, { ...fetchOptions, headers }),
      fetch(`${BASE_URL}/member/${memberId}/committees?api_key=${apiKey}`, { ...fetchOptions, headers }),
    ]);

    // Parse member details
    if (detailsRes.status === "fulfilled" && detailsRes.value.ok) {
      const data = (await detailsRes.value.json()) as CongressGovMemberDetailResponse;
      const member = data.member;
      if (member) {
        result.imageUrl = member.depiction?.imageUrl;
        result.websiteUrl = member.officialWebsiteUrl;
        result.officeAddress = member.addressInformation?.officeAddress;
        result.phoneNumber = member.addressInformation?.phoneNumber;
      }
    }

    // Parse committees from Congress API (works for both House and Senate)
    if (committeesRes.status === "fulfilled" && committeesRes.value.ok) {
      const data = (await committeesRes.value.json()) as {
        committees?: Array<{ name?: string; chamber?: string; type?: string }>;
      };
      if (data.committees && Array.isArray(data.committees)) {
        const committeeNames = data.committees
          .map((c) => c.name)
          .filter((name): name is string => !!name && name.length > 0);
        // Deduplicate
        result.committees = [...new Set(committeeNames)];
      }
    }
  } catch {
    // Member details unavailable
  }

  return result;
}

// Committee code to full name mapping (House)
const HOUSE_COMMITTEE_NAMES: Record<string, string> = {
  AG00: "Agriculture",
  AP00: "Appropriations",
  AS00: "Armed Services",
  BA00: "Financial Services",
  BU00: "Budget",
  ED00: "Education and the Workforce",
  FA00: "Foreign Affairs",
  GO00: "Oversight and Accountability",
  HA00: "House Administration",
  HM00: "Homeland Security",
  IF00: "Energy and Commerce",
  IG00: "Intelligence",
  II00: "Natural Resources",
  JU00: "Judiciary",
  PW00: "Transportation and Infrastructure",
  RU00: "Rules",
  SM00: "Small Business",
  SY00: "Science, Space, and Technology",
  VR00: "Veterans' Affairs",
  WM00: "Ways and Means",
  EC00: "Joint Economic Committee",
  JP00: "Joint Committee on Printing",
  ZS00: "Ethics",
};

function parseHouseCommitteeCode(code: string): string {
  if (HOUSE_COMMITTEE_NAMES[code]) {
    return HOUSE_COMMITTEE_NAMES[code];
  }
  const mainCode = code.replace(/\d+$/, "00");
  return HOUSE_COMMITTEE_NAMES[mainCode] || "";
}

let houseCommitteesCache: Map<string, string[]> | null = null;

export async function fetchHouseMemberCommittees(
  fetchOptions?: RequestInit
): Promise<Map<string, string[]>> {
  if (houseCommitteesCache) {
    return houseCommitteesCache;
  }

  const url = "https://clerk.house.gov/xml/lists/MemberData.xml";
  try {
    // Use browser-like headers to avoid 406 errors
    const response = await fetch(url, {
      ...fetchOptions,
      headers: {
        Accept: "text/xml, application/xml, */*",
        "User-Agent": "Mozilla/5.0 (compatible; PoliticalTracker/1.0)",
      },
    });

    if (!response.ok) {
      console.warn(`House clerk XML fetch failed: ${response.status}`);
      return new Map();
    }

    const xml = await response.text();
    const result = new Map<string, string[]>();

    // Parse XML to extract committee assignments by bioguideID
    const memberMatches = xml.matchAll(
      /<member>[\s\S]*?<bioguideID>([A-Z]\d{6})<\/bioguideID>[\s\S]*?<committee-assignments>([\s\S]*?)<\/committee-assignments>[\s\S]*?<\/member>/g
    );

    for (const match of memberMatches) {
      const bioguideId = match[1];
      const committeesXml = match[2];
      const committees: string[] = [];

      const committeeMatches = committeesXml.matchAll(
        /<committee\s+comcode="([A-Z]{2}\d{2})"/g
      );

      for (const commMatch of committeeMatches) {
        const code = commMatch[1];
        const name = parseHouseCommitteeCode(code);
        if (name && !committees.includes(name)) {
          committees.push(name);
        }
      }

      if (committees.length > 0) {
        result.set(bioguideId, committees);
      }
    }

    houseCommitteesCache = result;
    return result;
  } catch (error) {
    console.warn("Error fetching House member committees:", error);
    return new Map();
  }
}
