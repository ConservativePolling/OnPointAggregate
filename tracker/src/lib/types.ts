export type MemberStatus = "active" | "inactive" | "acting";
export type Party = "D" | "R" | "I" | "Nonpartisan";
export type MemberGroup = "House" | "Senate" | "Cabinet" | "White House";
export type BillStatus =
  | "Introduced"
  | "In Committee"
  | "Reported"
  | "Passed House"
  | "Passed Senate"
  | "To President"
  | "Signed"
  | "Vetoed";

export interface ServiceTerm {
  office: string;
  start: string;
  end?: string;
}

export interface Member {
  id: string;
  name: string;
  roleTitle: string;
  group: MemberGroup;
  party: Party;
  state?: string;
  district?: string;
  status: MemberStatus;
  serviceStart: string;
  terms: ServiceTerm[];
  committees: string[];
  focusAreas: string[];
  xHandle?: string;
  portrait?: string;
}

export interface BillAction {
  date: string;
  chamber: "House" | "Senate" | "Executive";
  action: string;
}

export interface BillVote {
  date: string;
  chamber: "House" | "Senate";
  result: "Passed" | "Failed" | "Pending";
  yeas: number;
  nays: number;
}

export type VotePosition = "Yea" | "Nay" | "Not Voting" | "Present";

export interface RollCallMemberVote {
  memberId: string;
  memberName: string;
  party: Party;
  state: string;
  position: VotePosition;
}

export interface DetailedRollCall {
  rollCall: string;
  chamber: "House" | "Senate";
  date: string;
  congress: string;
  question: string;
  result: string;
  description: string;
  billId?: string;
  billNumber?: string;
  totals: {
    yea: number;
    nay: number;
    notVoting: number;
    present: number;
  };
  votes: RollCallMemberVote[];
}

export interface BillVersion {
  label: string;
  url: string;
}

export interface Bill {
  id: string;
  congress?: string;
  number: string;
  title: string;
  summary: string;
  sponsorId: string;
  status: BillStatus;
  introducedDate: string;
  lastAction: string;
  topics: string[];
  actions: BillAction[];
  votes: BillVote[];
  versions: BillVersion[];
}

export interface MemberVote {
  date: string;
  chamber: "House" | "Senate";
  position: string;
  result: string;
  question: string;
  description: string;
  billId?: string;
  billNumber?: string;
  billTitle?: string;
  rollCall?: string;
  url?: string;
}

export type ExecutiveActionType =
  | "Executive Order"
  | "Presidential Memorandum"
  | "Proclamation"
  | "Presidential Notice";

export interface ExecutiveOrder {
  id: string;
  number?: string;
  title: string;
  type: ExecutiveActionType;
  signedDate: string;
  publishedDate?: string;
  summary?: string;
  topics: string[];
  pdfUrl?: string;
  htmlUrl?: string;
  federalRegisterUrl?: string;
}

export type CaseDecision = "majority" | "minority" | "plurality" | "per_curiam" | "unanimous";

export interface CaseTimeline {
  event: string;
  date: string;
}

export interface JusticeVote {
  id: string;
  name: string;
  vote: "majority" | "minority";
  opinion?: string;
}

export interface CaseAdvocate {
  name: string;
  description?: string;
  side: "petitioner" | "respondent" | "amicus";
}

export interface WrittenOpinion {
  type: string;
  author?: string;
  justicesJoined?: string[];
  pdfUrl?: string;
}

export interface OralArgument {
  title?: string;
  date?: string;
  audioUrl?: string;
  duration?: number;
}

export interface SupremeCourtCase {
  id: string;
  name: string;
  docketNumber: string;
  term: string;
  arguedDate?: string;
  decidedDate?: string;
  grantedDate?: string;
  question?: string;
  questionRaw?: string;
  description?: string;
  factsOfTheCase?: string;
  conclusion?: string;
  timeline: CaseTimeline[];
  justiaUrl?: string;
  oyezUrl?: string;
  citation?: {
    volume?: string;
    page?: string;
    year?: string;
  };
  votes?: {
    majority: number;
    minority: number;
  };
  decisionType?: string;
  winningParty?: string;
  winningPartyLabel?: string;
  firstParty?: string;
  firstPartyLabel?: string;
  secondParty?: string;
  secondPartyLabel?: string;
  lowerCourt?: string;
  advocates?: CaseAdvocate[];
  justiceVotes?: JusticeVote[];
  writtenOpinions?: WrittenOpinion[];
  oralArguments?: OralArgument[];
  relatedCases?: Array<{ name: string; href: string }>;
  majorityAuthor?: string;
  dissentAuthors?: string[];
}
