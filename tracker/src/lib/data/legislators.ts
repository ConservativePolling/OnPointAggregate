import lisMap from "@/lib/data/legislatorIds.json";

export function lookupBioguideFromLis(lisId?: string) {
  if (!lisId) return undefined;
  return lisMap[lisId as keyof typeof lisMap];
}

