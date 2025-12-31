import type { Member } from "@/lib/types";

export const members: Member[] = [
  {
    id: "aoc",
    name: "Alexandria Ocasio-Cortez",
    roleTitle: "Representative",
    group: "House",
    party: "D",
    state: "NY",
    district: "14",
    status: "active",
    serviceStart: "2019-01-03",
    terms: [{ office: "U.S. House (NY-14)", start: "2019-01-03" }],
    committees: ["Oversight", "Financial Services"],
    focusAreas: ["Housing", "Labor", "Climate"],
    xHandle: "AOC",
  },
  {
    id: "jeffries",
    name: "Hakeem Jeffries",
    roleTitle: "Representative",
    group: "House",
    party: "D",
    state: "NY",
    district: "8",
    status: "active",
    serviceStart: "2013-01-03",
    terms: [{ office: "U.S. House (NY-8)", start: "2013-01-03" }],
    committees: ["Judiciary"],
    focusAreas: ["Voting Rights", "Justice"],
    xHandle: "RepJeffries",
  },
  {
    id: "mace",
    name: "Nancy Mace",
    roleTitle: "Representative",
    group: "House",
    party: "R",
    state: "SC",
    district: "1",
    status: "active",
    serviceStart: "2021-01-03",
    terms: [{ office: "U.S. House (SC-1)", start: "2021-01-03" }],
    committees: ["Armed Services", "Oversight"],
    focusAreas: ["Defense", "Veterans"],
    xHandle: "NancyMace",
  },
  {
    id: "youngkim",
    name: "Young Kim",
    roleTitle: "Representative",
    group: "House",
    party: "R",
    state: "CA",
    district: "40",
    status: "active",
    serviceStart: "2021-01-03",
    terms: [{ office: "U.S. House (CA-40)", start: "2021-01-03" }],
    committees: ["Foreign Affairs", "Small Business"],
    focusAreas: ["Trade", "Asia-Pacific"],
    xHandle: "RepYoungKim",
  },
  {
    id: "schumer",
    name: "Charles Schumer",
    roleTitle: "Senator",
    group: "Senate",
    party: "D",
    state: "NY",
    status: "active",
    serviceStart: "1999-01-03",
    terms: [{ office: "U.S. Senate (NY)", start: "1999-01-03" }],
    committees: ["Rules", "Finance"],
    focusAreas: ["Infrastructure", "Technology"],
    xHandle: "SenSchumer",
  },
  {
    id: "mccconnell",
    name: "Mitch McConnell",
    roleTitle: "Senator",
    group: "Senate",
    party: "R",
    state: "KY",
    status: "active",
    serviceStart: "1985-01-03",
    terms: [{ office: "U.S. Senate (KY)", start: "1985-01-03" }],
    committees: ["Appropriations", "Rules"],
    focusAreas: ["Judiciary", "Defense"],
    xHandle: "LeaderMcConnell",
  },
  {
    id: "sanders",
    name: "Bernie Sanders",
    roleTitle: "Senator",
    group: "Senate",
    party: "I",
    state: "VT",
    status: "active",
    serviceStart: "2007-01-03",
    terms: [{ office: "U.S. Senate (VT)", start: "2007-01-03" }],
    committees: ["Budget", "Health"],
    focusAreas: ["Healthcare", "Labor"],
    xHandle: "SenSanders",
  },
];

export const memberGroups = ["House", "Senate", "Cabinet", "White House"] as const;

export const featuredMembers = members.slice(0, 8);

export function getMemberById(id: string): Member | undefined {
  return members.find((member) => member.id === id);
}

export function membersByGroup(group: string): Member[] {
  return members.filter((member) => member.group === group);
}
