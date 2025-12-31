import { Suspense } from "react";
import BillsDirectory from "@/components/BillsDirectory";
import SectionHeader from "@/components/SectionHeader";
import { buildSponsorLookup, getLiveBills, getLiveMembers } from "@/lib/data/live";

function BillsLoading() {
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-4 rounded-xl border border-faint bg-ghost p-4">
        <div className="h-10 w-64 animate-pulse rounded-lg bg-faint/30" />
        <div className="h-10 w-40 animate-pulse rounded-lg bg-faint/30" />
        <div className="h-10 flex-1 animate-pulse rounded-lg bg-faint/30" />
      </div>
      <div className="grid gap-8 lg:grid-cols-[260px_1fr]">
        <aside className="space-y-4">
          <div className="rounded-xl border border-faint p-4">
            <div className="h-4 w-24 animate-pulse rounded bg-faint/30" />
            <div className="mt-4 space-y-2">
              {Array.from({ length: 9 }).map((_, i) => (
                <div key={i} className="h-10 animate-pulse rounded-lg bg-faint/20" />
              ))}
            </div>
          </div>
        </aside>
        <div className="space-y-4">
          <div className="h-5 w-32 animate-pulse rounded bg-faint/30" />
          <div className="space-y-3">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="rounded-xl border border-faint p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 space-y-3">
                    <div className="flex gap-2">
                      <div className="h-4 w-20 animate-pulse rounded bg-faint/30" />
                      <div className="h-4 w-24 animate-pulse rounded bg-faint/30" />
                    </div>
                    <div className="h-6 w-3/4 animate-pulse rounded bg-faint/30" />
                    <div className="h-4 w-full animate-pulse rounded bg-faint/20" />
                  </div>
                  <div className="h-6 w-24 animate-pulse rounded-full bg-faint/30" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

async function BillsContent() {
  const [bills, members] = await Promise.all([
    getLiveBills(),
    getLiveMembers(),
  ]);
  const sponsorLookup = buildSponsorLookup(members);

  return <BillsDirectory bills={bills} sponsorLookup={sponsorLookup} />;
}

export default function BillsPage() {
  return (
    <div className="space-y-10">
      <SectionHeader
        title="Bills"
        subtitle="Track legislation by status, sponsor, and movement."
      />
      <Suspense fallback={<BillsLoading />}>
        <BillsContent />
      </Suspense>
    </div>
  );
}
