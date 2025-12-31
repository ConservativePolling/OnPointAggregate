import type { Bill } from "@/lib/types";

export const bills: Bill[] = [
  {
    id: "hr1283",
    number: "H.R. 1283",
    title: "Clean Procurement Modernization Act",
    summary:
      "Modernizes federal procurement rules to prioritize low-emission supply chains and public transparency.",
    sponsorId: "aoc",
    status: "In Committee",
    introducedDate: "2025-02-14",
    lastAction: "Referred to the Committee on Oversight and Accountability.",
    topics: ["Procurement", "Climate", "Transparency"],
    actions: [
      {
        date: "2025-02-14",
        chamber: "House",
        action: "Introduced in the House and referred to Oversight.",
      },
    ],
    votes: [],
    versions: [
      {
        label: "Introduced",
        url: "https://www.congress.gov/",
      },
    ],
  },
  {
    id: "s412",
    number: "S. 412",
    title: "Regional Infrastructure Acceleration Act",
    summary:
      "Accelerates permitting timelines for critical regional infrastructure projects while expanding community review.",
    sponsorId: "schumer",
    status: "Reported",
    introducedDate: "2025-01-22",
    lastAction: "Reported by the Senate Committee on Environment and Public Works.",
    topics: ["Infrastructure", "Permitting"],
    actions: [
      {
        date: "2025-01-22",
        chamber: "Senate",
        action: "Introduced in the Senate and referred to committee.",
      },
      {
        date: "2025-02-18",
        chamber: "Senate",
        action: "Reported with amendments.",
      },
    ],
    votes: [],
    versions: [
      {
        label: "Reported",
        url: "https://www.congress.gov/",
      },
    ],
  },
  {
    id: "hr772",
    number: "H.R. 772",
    title: "Secure Elections Cyber Act",
    summary:
      "Creates a permanent grant program for state and local election cybersecurity upgrades.",
    sponsorId: "jeffries",
    status: "Passed House",
    introducedDate: "2025-01-09",
    lastAction: "Passed House by recorded vote (298-131).",
    topics: ["Elections", "Cybersecurity"],
    actions: [
      {
        date: "2025-01-09",
        chamber: "House",
        action: "Introduced in the House and referred to Administration.",
      },
      {
        date: "2025-02-06",
        chamber: "House",
        action: "Passed House by recorded vote.",
      },
    ],
    votes: [
      {
        date: "2025-02-06",
        chamber: "House",
        result: "Passed",
        yeas: 298,
        nays: 131,
      },
    ],
    versions: [
      {
        label: "Engrossed House",
        url: "https://www.congress.gov/",
      },
    ],
  },
  {
    id: "s88",
    number: "S. 88",
    title: "Rural Broadband Resilience Act",
    summary:
      "Funds redundant fiber routes and resiliency upgrades for rural broadband networks.",
    sponsorId: "sanders",
    status: "In Committee",
    introducedDate: "2025-01-15",
    lastAction: "Hearing held by the Committee on Commerce, Science, and Transportation.",
    topics: ["Broadband", "Rural"],
    actions: [
      {
        date: "2025-01-15",
        chamber: "Senate",
        action: "Introduced in the Senate and referred to committee.",
      },
      {
        date: "2025-02-12",
        chamber: "Senate",
        action: "Committee hearing held.",
      },
    ],
    votes: [],
    versions: [
      {
        label: "Introduced",
        url: "https://www.congress.gov/",
      },
    ],
  },
  {
    id: "hr1401",
    number: "H.R. 1401",
    title: "Veterans Workforce Bridge Act",
    summary:
      "Creates regional workforce pipelines connecting veterans to federal and defense contractors.",
    sponsorId: "mace",
    status: "In Committee",
    introducedDate: "2025-02-03",
    lastAction: "Referred to the Committee on Veterans' Affairs.",
    topics: ["Veterans", "Workforce"],
    actions: [
      {
        date: "2025-02-03",
        chamber: "House",
        action: "Introduced in the House and referred to committee.",
      },
    ],
    votes: [],
    versions: [
      {
        label: "Introduced",
        url: "https://www.congress.gov/",
      },
    ],
  },
  {
    id: "s510",
    number: "S. 510",
    title: "Indo-Pacific Partnership Act",
    summary:
      "Expands trade finance and cultural exchange initiatives across Indo-Pacific allies.",
    sponsorId: "mccconnell",
    status: "Reported",
    introducedDate: "2025-02-01",
    lastAction: "Reported by the Committee on Foreign Affairs.",
    topics: ["Foreign Affairs", "Trade"],
    actions: [
      {
        date: "2025-02-01",
        chamber: "House",
        action: "Introduced in the House and referred to Foreign Affairs.",
      },
      {
        date: "2025-02-26",
        chamber: "House",
        action: "Reported with amendments.",
      },
    ],
    votes: [],
    versions: [
      {
        label: "Reported",
        url: "https://www.congress.gov/",
      },
    ],
  },
];

export const featuredBills = bills.slice(0, 4);

export function getBillById(id: string): Bill | undefined {
  return bills.find((bill) => bill.id === id);
}
