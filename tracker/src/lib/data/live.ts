import type { Bill, ExecutiveOrder, Member, MemberGroup, MemberVote } from "@/lib/types";
import { bills as fallbackBills } from "@/lib/data/bills";
import { members as fallbackMembers } from "@/lib/data/members";
import { executiveRoster } from "@/lib/data/executive";
import { socialHandles, nameToXHandle } from "@/lib/data/socials";
import {
  fetchCongressBillById,
  fetchCongressBills,
  fetchCongressMembers,
  fetchHouseMemberCommittees,
  fetchMemberCosponsoredBills,
  fetchMemberDetails,
  fetchMemberSponsoredBills,
  type MemberDetails,
} from "@/lib/ingest/congressGov";
import {
  fetchRecentHouseMemberVotes,
  fetchRecentSenateMemberVotes,
} from "@/lib/ingest/rollCalls";
import { fetchRecentExecutiveOrders } from "@/lib/ingest/federalRegister";

const MEMBER_REVALIDATE_SECONDS = 60 * 60;
const BILL_REVALIDATE_SECONDS = 15 * 60;
const VOTE_REVALIDATE_SECONDS = 30 * 60;
const REQUEST_TIMEOUT_MS = 10000;
// Fetching bills - reasonable timeout with streaming (default 60 seconds)
const billTimeoutEnv = process.env.CONGRESS_BILL_TIMEOUT_MS;
const parsedBillTimeout = billTimeoutEnv ? Number(billTimeoutEnv) : NaN;
const ALL_BILLS_TIMEOUT_MS =
  Number.isFinite(parsedBillTimeout) && parsedBillTimeout > 0
    ? parsedBillTimeout
    : 60000;
// Member legislation timeouts
const MEMBER_SPONSORED_TIMEOUT_MS = 20000;
const MEMBER_COSPONSORED_TIMEOUT_MS = 20000;
// 3 pages = 750 bills per type - enough for recent history
const MEMBER_BILL_PAGE_LIMIT = 3;
const ROLL_CALL_FETCH_LIMIT = 30;

const billPageLimitEnv = process.env.CONGRESS_BILL_PAGE_LIMIT;
const parsedBillLimit = billPageLimitEnv ? Number(billPageLimitEnv) : NaN;
// 20 pages = 5,000 bills - comprehensive with infinite scroll on frontend
// Set CONGRESS_BILL_PAGE_LIMIT=0 for unlimited pages
const BILL_PAGE_LIMIT =
  Number.isFinite(parsedBillLimit) && parsedBillLimit >= 0
    ? parsedBillLimit || undefined
    : 20;
// Default to 119th Congress (2025-2026) if not specified
const CONGRESS_SESSION = process.env.CONGRESS_SESSION?.trim() || "119";

function resolveCongressStartYear(congress?: string) {
  const congressNumber = congress ? Number(congress) : NaN;
  if (!Number.isFinite(congressNumber)) return new Date().getFullYear();
  return 1789 + (congressNumber - 1) * 2;
}

function resolveCongressSessionNumber(startYear: number) {
  const currentYear = new Date().getFullYear();
  return currentYear > startYear ? "2" : "1";
}

type CacheEntry<T> = {
  data: T;
  expiresAt: number;
};

let memberCache: CacheEntry<Member[]> | null = null;
let billCache: CacheEntry<Bill[]> | null = null;

function mergeSocialHandles(members: Member[]): Member[] {
  // Build a lookup from fallback members for X handles
  const fallbackHandles: Record<string, string> = {};
  fallbackMembers.forEach((m) => {
    if (m.xHandle) fallbackHandles[m.id] = m.xHandle;
    // Also try matching by name for Congress API members with different IDs
    fallbackHandles[m.name.toLowerCase()] = m.xHandle ?? "";
  });

  return members.map((member) => {
    // First check socials.json by bioguide ID
    const social = socialHandles[member.id];
    if (social?.xHandle) {
      return { ...member, xHandle: social.xHandle };
    }
    // Then check fallback by ID
    if (fallbackHandles[member.id]) {
      return { ...member, xHandle: fallbackHandles[member.id] };
    }
    // Then try official pressgallery name-based lookup (comprehensive 440+ handles)
    const nameKey = member.name.toLowerCase().trim();
    if (nameToXHandle[nameKey]) {
      return { ...member, xHandle: nameToXHandle[nameKey] };
    }
    // Then try matching from fallback members by name
    if (fallbackHandles[nameKey]) {
      return { ...member, xHandle: fallbackHandles[nameKey] };
    }
    return member;
  });
}

function isCacheFresh<T>(cache: CacheEntry<T> | null): cache is CacheEntry<T> {
  return !!cache && Date.now() < cache.expiresAt;
}

function createTimeoutSignal(timeoutMs: number) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
  return {
    signal: controller.signal,
    clear: () => clearTimeout(timeoutId),
  };
}

function compactBillId(value: string) {
  if (!value) return "";
  return value.toLowerCase().replace(/[^a-z0-9]/g, "");
}

export function filterMembersByGroup(
  members: Member[],
  group: MemberGroup
): Member[] {
  return members.filter((member) => member.group === group);
}

export function pickFeaturedMembers(members: Member[], limit = 6): Member[] {
  return members.slice(0, limit);
}

export function buildSponsorLookup(members: Member[]): Record<string, string> {
  return members.reduce<Record<string, string>>((acc, member) => {
    acc[member.id] = member.name;
    return acc;
  }, {});
}

export async function getLiveMembers(): Promise<Member[]> {
  const apiKey = process.env.CONGRESS_API_KEY;
  if (!apiKey) return [...fallbackMembers, ...executiveRoster];
  if (isCacheFresh(memberCache)) return memberCache.data;

  const timeout = createTimeoutSignal(REQUEST_TIMEOUT_MS);
  try {
    const congressMembers = await fetchCongressMembers(apiKey, {
      next: { revalidate: MEMBER_REVALIDATE_SECONDS },
      signal: timeout.signal,
    });
    const enriched = mergeSocialHandles(congressMembers);
    // Only include executive roster - Congress API has all legislators
    // Social handles are merged via mergeSocialHandles, no need for duplicates
    const combined = [...enriched, ...executiveRoster];
    // Deduplicate by ID just in case
    const uniqueById = new Map<string, Member>();
    combined.forEach((m) => {
      if (!uniqueById.has(m.id)) {
        uniqueById.set(m.id, m);
      }
    });
    const deduped = Array.from(uniqueById.values());
    memberCache = {
      data: deduped,
      expiresAt: Date.now() + MEMBER_REVALIDATE_SECONDS * 1000,
    };
    return deduped;
  } catch (error) {
    console.warn("Falling back to sample members.", error);
    if (memberCache) return memberCache.data;
    return [...fallbackMembers, ...executiveRoster];
  } finally {
    timeout.clear();
  }
}

export async function getLiveBills(): Promise<Bill[]> {
  const apiKey = process.env.CONGRESS_API_KEY;
  if (!apiKey) return fallbackBills;
  if (isCacheFresh(billCache)) return billCache.data;

  // Use longer timeout for fetching bills from congress
  const timeout = createTimeoutSignal(ALL_BILLS_TIMEOUT_MS);
  try {
    const liveBills = await fetchCongressBills(
      apiKey,
      {
        next: { revalidate: BILL_REVALIDATE_SECONDS },
        signal: timeout.signal,
      },
      BILL_PAGE_LIMIT,
      CONGRESS_SESSION
    );
    const uniqueBills = new Map<string, Bill>();
    liveBills.forEach((bill) => {
      if (!uniqueBills.has(bill.id)) {
        uniqueBills.set(bill.id, bill);
      }
    });
    const normalizedBills = Array.from(uniqueBills.values());
    billCache = {
      data: normalizedBills,
      expiresAt: Date.now() + BILL_REVALIDATE_SECONDS * 1000,
    };
    return normalizedBills;
  } catch (error) {
    console.warn("Falling back to sample bills.", error);
    if (billCache) return billCache.data;
    return fallbackBills;
  } finally {
    timeout.clear();
  }
}

export async function getLiveMemberById(id: string): Promise<Member | undefined> {
  const members = await getLiveMembers();
  return members.find((member) => member.id === id);
}

export async function getLiveMemberDetails(
  memberId: string,
  chamber?: "House" | "Senate"
): Promise<MemberDetails> {
  const apiKey = process.env.CONGRESS_API_KEY;

  const result: MemberDetails = { committees: [] };

  // Fetch from multiple sources in parallel
  const timeout = createTimeoutSignal(REQUEST_TIMEOUT_MS * 2);
  try {
    const [houseCommitteesResult, congressDetailsResult] = await Promise.allSettled([
      // House Clerk XML (reliable for House members)
      fetchHouseMemberCommittees({
        next: { revalidate: MEMBER_REVALIDATE_SECONDS },
        signal: timeout.signal,
      }),
      // Congress API (works for both House and Senate, includes committees)
      apiKey
        ? fetchMemberDetails(apiKey, memberId, {
            next: { revalidate: MEMBER_REVALIDATE_SECONDS },
            signal: timeout.signal,
          })
        : Promise.resolve(null),
    ]);

    // Get House Clerk committees (primary source for House members)
    let houseClerkCommittees: string[] = [];
    if (houseCommitteesResult.status === "fulfilled") {
      const memberCommittees = houseCommitteesResult.value.get(memberId);
      if (memberCommittees && memberCommittees.length > 0) {
        houseClerkCommittees = memberCommittees;
      }
    }

    // Get Congress API data (includes committees for both chambers)
    let congressApiCommittees: string[] = [];
    if (congressDetailsResult.status === "fulfilled" && congressDetailsResult.value) {
      const details = congressDetailsResult.value;
      result.imageUrl = details.imageUrl;
      result.websiteUrl = details.websiteUrl;
      result.officeAddress = details.officeAddress;
      result.phoneNumber = details.phoneNumber;
      congressApiCommittees = details.committees || [];
    }

    // Merge committees: prefer House Clerk for House members, use Congress API as fallback/supplement
    // This ensures Senate members get committees from Congress API
    const allCommittees = new Set([...houseClerkCommittees, ...congressApiCommittees]);
    result.committees = Array.from(allCommittees);

  } catch (error) {
    console.warn(`Error fetching member details for ${memberId}:`, error);
  } finally {
    timeout.clear();
  }

  return result;
}

export async function getLiveBillById(id: string): Promise<Bill | undefined> {
  if (!id) return undefined;
  const apiKey = process.env.CONGRESS_API_KEY;
  if (!apiKey) {
    const bills = await getLiveBills();
    const compactId = compactBillId(id);
    return bills.find((bill) => compactBillId(bill.id) === compactId);
  }

  const timeout = createTimeoutSignal(REQUEST_TIMEOUT_MS);
  try {
    const detail = await fetchCongressBillById(apiKey, id, {
      next: { revalidate: BILL_REVALIDATE_SECONDS },
      signal: timeout.signal,
    });
    if (detail) return detail;
  } catch (error) {
    console.warn("Falling back to list lookup for bill detail.", error);
  } finally {
    timeout.clear();
  }

  const bills = await getLiveBills();
  const compactId = compactBillId(id);
  return bills.find((bill) => compactBillId(bill.id) === compactId);
}

export async function getLiveMemberLegislation(
  memberId: string
): Promise<{
  sponsored: Bill[];
  cosponsored: Bill[];
  cosponsorStatus: "live" | "unavailable";
}> {
  const apiKey = process.env.CONGRESS_API_KEY;
  // Don't filter by congress - fetch full legislative history
  if (!apiKey) {
    const bills = await getLiveBills();
    return {
      sponsored: bills.filter((bill) => bill.sponsorId === memberId),
      cosponsored: [],
      cosponsorStatus: "unavailable",
    };
  }

  // Use separate timeouts for sponsored and cosponsored - run in parallel
  const sponsoredTimeout = createTimeoutSignal(MEMBER_SPONSORED_TIMEOUT_MS);
  const cosponsoredTimeout = createTimeoutSignal(MEMBER_COSPONSORED_TIMEOUT_MS);

  try {
    // Fetch sponsored and cosponsored in parallel with independent timeouts
    const [sponsoredResult, cosponsoredResult] = await Promise.allSettled([
      fetchMemberSponsoredBills(
        apiKey,
        memberId,
        {
          next: { revalidate: BILL_REVALIDATE_SECONDS },
          signal: sponsoredTimeout.signal,
        },
        MEMBER_BILL_PAGE_LIMIT,
        undefined // Fetch all congresses
      ),
      fetchMemberCosponsoredBills(
        apiKey,
        memberId,
        {
          next: { revalidate: BILL_REVALIDATE_SECONDS },
          signal: cosponsoredTimeout.signal,
        },
        MEMBER_BILL_PAGE_LIMIT,
        undefined // Fetch all congresses
      ),
    ]);

    let sponsored: Bill[] = [];
    let cosponsored: Bill[] = [];
    let cosponsorStatus: "live" | "unavailable" = "live";

    if (sponsoredResult.status === "fulfilled") {
      sponsored = sponsoredResult.value;
    } else {
      console.warn(`Error fetching sponsored bills for ${memberId}:`, sponsoredResult.reason);
    }

    if (cosponsoredResult.status === "fulfilled") {
      cosponsored = cosponsoredResult.value;
    } else {
      console.warn(`Error fetching cosponsored bills for ${memberId}:`, cosponsoredResult.reason);
      cosponsorStatus = "unavailable";
    }

    const sponsoredUnique = new Map<string, Bill>();
    sponsored.forEach((bill) => {
      sponsoredUnique.set(bill.id, bill);
    });
    const cosponsoredUnique = new Map<string, Bill>();
    cosponsored.forEach((bill) => {
      if (!sponsoredUnique.has(bill.id)) {
        cosponsoredUnique.set(bill.id, bill);
      }
    });
    return {
      sponsored: Array.from(sponsoredUnique.values()),
      cosponsored: Array.from(cosponsoredUnique.values()),
      cosponsorStatus,
    };
  } catch (error) {
    console.warn("Falling back to list lookup for member legislation.", error);
    const bills = await getLiveBills();
    return {
      sponsored: bills.filter((bill) => bill.sponsorId === memberId),
      cosponsored: [],
      cosponsorStatus: "unavailable",
    };
  } finally {
    sponsoredTimeout.clear();
    cosponsoredTimeout.clear();
  }
}

export async function getLiveMemberVotes(
  memberId: string,
  limit = 10
): Promise<{
  votes: MemberVote[];
  status: "live" | "unavailable";
}> {
  const congress = CONGRESS_SESSION;
  if (!congress) {
    return { votes: [], status: "unavailable" };
  }

  const startYear = resolveCongressStartYear(congress);
  const rollCallYear = process.env.ROLLCALL_YEAR?.trim() || String(startYear);
  const sessionNumber =
    process.env.CONGRESS_SESSION_NUMBER?.trim() ||
    resolveCongressSessionNumber(startYear);

  const timeout = createTimeoutSignal(REQUEST_TIMEOUT_MS);
  try {
    const [houseVotes, senateVotes] = await Promise.all([
      fetchRecentHouseMemberVotes(
        memberId,
        rollCallYear,
        ROLL_CALL_FETCH_LIMIT,
        {
          next: { revalidate: VOTE_REVALIDATE_SECONDS },
          signal: timeout.signal,
        }
      ),
      fetchRecentSenateMemberVotes(
        memberId,
        congress,
        sessionNumber,
        ROLL_CALL_FETCH_LIMIT,
        {
          next: { revalidate: VOTE_REVALIDATE_SECONDS },
          signal: timeout.signal,
        }
      ),
    ]);
    const combined = [...houseVotes, ...senateVotes].sort((a, b) =>
      b.date.localeCompare(a.date)
    );
    return { votes: combined.slice(0, limit), status: "live" };
  } catch (error) {
    console.warn("Falling back to empty member votes.", error);
    return { votes: [], status: "unavailable" };
  } finally {
    timeout.clear();
  }
}

const EXECUTIVE_ORDER_REVALIDATE_SECONDS = 30 * 60;
let executiveOrderCache: CacheEntry<ExecutiveOrder[]> | null = null;

export async function getLiveExecutiveOrders(): Promise<{
  orders: ExecutiveOrder[];
  status: "live" | "unavailable";
}> {
  if (isCacheFresh(executiveOrderCache)) {
    return { orders: executiveOrderCache.data, status: "live" };
  }

  const timeout = createTimeoutSignal(REQUEST_TIMEOUT_MS * 2);
  try {
    const orders = await fetchRecentExecutiveOrders({
      next: { revalidate: EXECUTIVE_ORDER_REVALIDATE_SECONDS },
      signal: timeout.signal,
    });
    executiveOrderCache = {
      data: orders,
      expiresAt: Date.now() + EXECUTIVE_ORDER_REVALIDATE_SECONDS * 1000,
    };
    return { orders, status: "live" };
  } catch (error) {
    console.warn("Falling back to empty executive orders.", error);
    if (executiveOrderCache) {
      return { orders: executiveOrderCache.data, status: "live" };
    }
    return { orders: [], status: "unavailable" };
  } finally {
    timeout.clear();
  }
}
