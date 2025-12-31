import Link from "next/link";
import { redirect } from "next/navigation";
import RoleTimeline from "@/components/RoleTimeline";
import SectionHeader from "@/components/SectionHeader";
import StatusBadge from "@/components/StatusBadge";
import VotesList from "@/components/VotesList";
import XTimeline from "@/components/XTimeline";
import {
  getLiveMemberById,
  getLiveMemberDetails,
  getLiveMemberLegislation,
  getLiveMembers,
  getLiveMemberVotes,
} from "@/lib/data/live";
import { formatDate, formatYearsServed } from "@/lib/utils";

interface MemberProfilePageProps {
  params: Promise<{ id: string }>;
}

export const dynamic = "force-dynamic";

export default async function MemberProfilePage({
  params,
}: MemberProfilePageProps) {
  const { id } = await params;

  // Redirect President to dedicated page
  if (id === "trump") {
    redirect("/president");
  }

  const [member, legislation, members, voteData, memberDetails] = await Promise.all([
    getLiveMemberById(id),
    getLiveMemberLegislation(id),
    getLiveMembers(),
    getLiveMemberVotes(id),
    getLiveMemberDetails(id),
  ]);

  if (!member) {
    return (
      <div className="space-y-4">
        <SectionHeader title="Profile" subtitle="Member not found" />
        <Link href="/directory" className="underline">
          Back to directory
        </Link>
      </div>
    );
  }

  const yearsServed = formatYearsServed(member.terms);
  const joinedDate = member.terms[0]?.start ?? member.serviceStart;
  const sponsoredBills = [...legislation.sponsored].sort((a, b) =>
    b.introducedDate.localeCompare(a.introducedDate)
  );
  const cosponsoredBills = [...legislation.cosponsored].sort((a, b) =>
    b.introducedDate.localeCompare(a.introducedDate)
  );
  const voteRows = [...voteData.votes].sort((a, b) =>
    b.date.localeCompare(a.date)
  );
  const recommendedMembers = members
    .filter((item) => item.group === member.group && item.id !== member.id)
    .slice(0, 6);
  const districtLabel = member.district ? `District ${member.district}` : "";
  const regionLabel = [member.state, districtLabel].filter(Boolean).join(" · ");
  // Use fetched committees if member committees are empty
  const committees = member.committees.length > 0
    ? member.committees
    : memberDetails.committees;
  const handleUrl = member.xHandle
    ? `https://x.com/${member.xHandle}`
    : "";

  return (
    <div className="space-y-12">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-faint pb-4 text-xs font-mono text-faint">
        <Link href="/directory" className="underline">
          Back to directory
        </Link>
        <span>{member.group}</span>
        <span>{regionLabel || "Federal office"}</span>
      </div>

      <header className="grid gap-10 border-b border-faint pb-10 lg:grid-cols-[1.6fr_0.4fr]">
        <div className="space-y-6">
          <div className="space-y-3">
            <p className="label">Member dossier</p>
            <h1 className="font-display text-4xl tracking-tight md:text-5xl">
              {member.name}
            </h1>
            <p className="text-lg text-muted">{member.roleTitle}</p>
            {member.xHandle ? (
              <a
                href={handleUrl}
                target="_blank"
                rel="noreferrer"
                className="text-xs font-mono text-faint underline"
              >
                @{member.xHandle}
              </a>
            ) : null}
          </div>
          <div className="grid gap-4 text-sm text-muted sm:grid-cols-2">
            <div>
              <p className="label">Service</p>
              <p>{yearsServed} years served</p>
              {joinedDate ? <p>Joined {formatDate(joinedDate)}</p> : null}
            </div>
            <div>
              <p className="label">Affiliation</p>
              <p>Party {member.party}</p>
              <p>{regionLabel || "Federal office"}</p>
            </div>
          </div>
        </div>
          <div className="space-y-6 border-l border-faint pl-6">
            <div className="space-y-3">
              <p className="label">Status</p>
              <StatusBadge status={member.status} />
            </div>
          <div className="space-y-2 text-sm text-muted">
            <p className="label">Committees</p>
            {committees.length === 0 ? (
              <p>Committee data pending.</p>
            ) : (
              committees.map((committee) => (
                <p key={committee}>{committee}</p>
              ))
            )}
          </div>
          <div className="space-y-2 text-sm text-muted">
            <p className="label">Focus</p>
            {member.focusAreas.length === 0 ? (
              <p>Focus areas pending.</p>
            ) : (
              member.focusAreas.map((area) => <p key={area}>{area}</p>)
            )}
          </div>
        </div>
      </header>

      <section className="grid gap-10 lg:grid-cols-[1fr_340px]">
        <div className="space-y-8">
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="space-y-4 rounded-lg border border-faint p-5">
              <div className="flex items-center justify-between">
                <p className="label-strong label">Sponsored</p>
                <span className="rounded-full bg-ink px-2.5 py-0.5 text-[0.65rem] font-mono text-paper">
                  {sponsoredBills.length}
                </span>
              </div>
              {sponsoredBills.length === 0 ? (
                <p className="text-sm text-muted">No sponsored bills yet.</p>
              ) : (
                <div className="max-h-[320px] space-y-3 overflow-y-auto pr-2">
                  {sponsoredBills.slice(0, 8).map((bill) => (
                    <Link
                      key={bill.id}
                      href={`/bills/${encodeURIComponent(bill.id)}`}
                      className="block border-b border-faint pb-3 transition-colors hover:text-muted last:border-0"
                    >
                      <p className="text-[0.65rem] font-mono text-faint">{bill.number}</p>
                      <p className="mt-1 text-sm font-medium leading-snug tracking-tight">
                        {bill.title}
                      </p>
                    </Link>
                  ))}
                  {sponsoredBills.length > 8 && (
                    <p className="pt-2 text-xs text-faint">+{sponsoredBills.length - 8} more bills</p>
                  )}
                </div>
              )}
            </div>
            <div className="space-y-4 rounded-lg border border-faint p-5">
              <div className="flex items-center justify-between">
                <p className="label-strong label">Cosponsored</p>
                <span className="rounded-full border border-faint bg-ghost px-2.5 py-0.5 text-[0.65rem] font-mono text-muted">
                  {cosponsoredBills.length}
                </span>
              </div>
              {cosponsoredBills.length === 0 ? (
                <p className="text-sm text-muted">
                  {legislation.cosponsorStatus === "unavailable"
                    ? "Cosponsorship data unavailable."
                    : "No cosponsored bills listed."}
                </p>
              ) : (
                <div className="max-h-[320px] space-y-3 overflow-y-auto pr-2">
                  {cosponsoredBills.slice(0, 8).map((bill) => (
                    <Link
                      key={bill.id}
                      href={`/bills/${encodeURIComponent(bill.id)}`}
                      className="block border-b border-faint pb-3 transition-colors hover:text-muted last:border-0"
                    >
                      <p className="text-[0.65rem] font-mono text-faint">{bill.number}</p>
                      <p className="mt-1 text-sm font-medium leading-snug tracking-tight">
                        {bill.title}
                      </p>
                    </Link>
                  ))}
                  {cosponsoredBills.length > 8 && (
                    <p className="pt-2 text-xs text-faint">+{cosponsoredBills.length - 8} more bills</p>
                  )}
                </div>
              )}
            </div>
          </div>

          <VotesList votes={voteRows} status={voteData.status} />
        </div>

        <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
          <div className="space-y-4 rounded-lg border border-faint p-5">
            <p className="label">Service ledger</p>
            <RoleTimeline terms={member.terms} />
            <div className="space-y-1.5 border-t border-faint pt-4 text-sm text-muted">
              <p>Status: <span className="text-ink">{member.status}</span></p>
              <p>Party: <span className="text-ink">{member.party}</span></p>
              {regionLabel ? <p>Region: <span className="text-ink">{regionLabel}</span></p> : null}
            </div>
          </div>

          {member.xHandle && (
            <div className="space-y-4 rounded-lg border border-faint p-5">
              <div className="flex items-center justify-between">
                <p className="label">X Signal</p>
                <a
                  href={handleUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs text-faint underline hover:text-ink"
                >
                  @{member.xHandle}
                </a>
              </div>
              <XTimeline handle={member.xHandle} height={450} tweetLimit={10} />
            </div>
          )}

          <div className="space-y-4 rounded-lg border border-faint p-5">
            <div>
              <p className="label">Related officials</p>
              <p className="mt-1 text-xs text-faint">In the {member.group}</p>
            </div>
            <div className="space-y-3">
              {recommendedMembers.length === 0 ? (
                <p className="text-sm text-muted">No recommendations yet.</p>
              ) : (
                recommendedMembers.slice(0, 4).map((rec) => {
                  const recYears = formatYearsServed(rec.terms);
                  return (
                    <Link
                      key={rec.id}
                      href={`/people/${rec.id}`}
                      className="block border-b border-faint pb-3 transition-colors hover:text-muted last:border-0"
                    >
                      <p className="text-sm font-medium tracking-tight">{rec.name}</p>
                      <p className="text-xs text-faint">{rec.roleTitle} · {recYears}y</p>
                    </Link>
                  );
                })
              )}
            </div>
          </div>
        </aside>
      </section>
    </div>
  );
}
