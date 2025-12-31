import fs from "node:fs/promises";
import path from "node:path";
import process from "node:process";

const SOURCE_URLS = [
  "https://raw.githubusercontent.com/unitedstates/congress-legislators/main/legislators-current.json",
  "https://raw.githubusercontent.com/unitedstates/congress-legislators/master/legislators-current.json",
];

async function run() {
  let response;
  for (const url of SOURCE_URLS) {
    response = await fetch(url);
    if (response.ok) break;
  }
  if (!response || !response.ok) {
    throw new Error(`Failed to fetch socials: ${response?.status ?? "unknown"}`);
  }

  const data = await response.json();
  const socials = {};
  const lisMap = {};

  for (const person of data) {
    const bioguide = person?.id?.bioguide;
    if (!bioguide) continue;
    const twitter = person?.social?.twitter;
    const website = person?.url;
    const lisId = person?.id?.lis;

    if (twitter || website) {
      socials[bioguide] = {
        ...(twitter ? { xHandle: twitter } : null),
        ...(website ? { website } : null),
      };
    }

    if (lisId) {
      lisMap[lisId] = bioguide;
    }
  }

  const outputPath = path.join(
    process.cwd(),
    "src",
    "lib",
    "data",
    "socials.json"
  );
  await fs.writeFile(outputPath, JSON.stringify(socials, null, 2));

  const idsPath = path.join(
    process.cwd(),
    "src",
    "lib",
    "data",
    "legislatorIds.json"
  );
  await fs.writeFile(idsPath, JSON.stringify(lisMap, null, 2));

  console.log(`Wrote ${Object.keys(socials).length} social profiles.`);
  console.log(`Wrote ${Object.keys(lisMap).length} LIS mappings.`);
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
