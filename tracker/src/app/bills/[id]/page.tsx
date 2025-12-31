import Link from "next/link";
import BillStatus from "@/components/BillStatus";
import BillVotesSection from "@/components/BillVotesSection";
import { getLiveBillById, getLiveMemberById } from "@/lib/data/live";
import { formatDate } from "@/lib/utils";
import type { BillStatus as BillStatusType } from "@/lib/types";

interface BillDetailPageProps {
  params: Promise<{ id: string }>;
}

export const dynamic = "force-dynamic";

const STATUS_PIPELINE: BillStatusType[] = [
  "Introduced",
  "In Committee",
  "Reported",
  "Passed House",
  "Passed Senate",
  "To President",
  "Signed",
];

function getStatusIndex(status: BillStatusType): number {
  if (status === "Vetoed") return 6;
  return STATUS_PIPELINE.indexOf(status);
}

function pickBillPreview(versions: { label: string; url: string }[]) {
  if (!versions.length) return null;
  const pdfVersion = versions.find((version) =>
    version.label.toLowerCase().includes("pdf")
  );
  const formattedVersion = versions.find((version) =>
    version.label.toLowerCase().includes("formatted")
  );
  const htmlVersion = versions.find((version) =>
    version.label.toLowerCase().includes("html")
  );
  const selected = pdfVersion ?? formattedVersion ?? htmlVersion;
  if (!selected) return null;
  const isPdf =
    selected.label.toLowerCase().includes("pdf") ||
    selected.url.toLowerCase().endsWith(".pdf");
  return { ...selected, isPdf };
}

function inferActionType(action: string) {
  const lower = action.toLowerCase();
  if (lower.includes("introduced")) return "Introduction";
  if (lower.includes("referred")) return "Referral";
  if (lower.includes("reported")) return "Reported";
  if (lower.includes("passed")) return "Passage";
  if (lower.includes("vote")) return "Vote";
  if (lower.includes("conference")) return "Conference";
  if (lower.includes("presented")) return "Presentation";
  if (lower.includes("signed")) return "Signature";
  if (lower.includes("veto")) return "Veto";
  return "Action";
}

function getActionTypeStyle(type: string) {
  switch (type) {
    case "Passage":
    case "Signature":
      return "bg-ink text-paper border-ink";
    case "Vote":
      return "bg-ghost text-ink border-faint";
    case "Veto":
      return "bg-paper text-ink border-ink";
    default:
      return "bg-paper text-muted border-faint";
  }
}

export default async function BillDetailPage({ params }: BillDetailPageProps) {
  const { id } = await params;
  const bill = await getLiveBillById(id);

  if (!bill) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center">
        <div className="rounded-lg border border-faint bg-ghost p-12 text-center">
          <p className="label">Bill not found</p>
          <p className="mt-3 font-display text-2xl">This bill doesn&apos;t exist</p>
          <p className="mt-2 text-sm text-muted">The bill may have been removed or the ID is incorrect.</p>
          <Link
            href="/bills"
            className="mt-6 inline-flex rounded-full border border-ink bg-ink px-5 py-2 text-xs font-mono text-paper transition-colors hover:bg-transparent hover:text-ink"
          >
            Back to bills
          </Link>
        </div>
      </div>
    );
  }

  const sponsor = bill.sponsorId
    ? await getLiveMemberById(bill.sponsorId)
    : undefined;
  const summaryText =
    bill.summary?.trim() || "Summary pending from Congress.gov.";
  const sessionLabel = bill.congress
    ? `${bill.congress}th Congress`
    : "Current session";
  const latestActionLabel = bill.lastAction?.trim() || "Action pending.";
  const sortedActions = [...bill.actions].sort((a, b) =>
    b.date.localeCompare(a.date)
  );
  const actionGroups = sortedActions.reduce<
    Array<{ date: string; items: typeof bill.actions }>
  >((groups, action) => {
    const lastGroup = groups[groups.length - 1];
    if (lastGroup && lastGroup.date === action.date) {
      lastGroup.items.push(action);
      return groups;
    }
    groups.push({ date: action.date, items: [action] });
    return groups;
  }, []);
  const preview = pickBillPreview(bill.versions);
  const statusIndex = getStatusIndex(bill.status);
  const isVetoed = bill.status === "Vetoed";
  const isSigned = bill.status === "Signed";

  return (
    <div className="space-y-10">
      {/* Breadcrumb */}
      <div className="flex items-center gap-3 text-xs font-mono text-faint">
        <Link href="/bills" className="transition-colors hover:text-ink">
          Bills
        </Link>
        <span>/</span>
        <span className="text-ink">{bill.number}</span>
      </div>

      {/* Hero Section */}
      <header className="space-y-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="space-y-1">
            <p className="font-mono text-sm text-muted">{bill.number}</p>
            <h1 className="max-w-3xl font-display text-3xl tracking-tight md:text-4xl lg:text-5xl">
              {bill.title}
            </h1>
          </div>
          <BillStatus status={bill.status} />
        </div>

        <p className="max-w-2xl text-lg leading-relaxed text-muted">{summaryText}</p>

        {/* Quick Stats Row */}
        <div className="flex flex-wrap gap-6 border-t border-faint pt-6">
          <div>
            <p className="label">Sponsor</p>
            {sponsor ? (
              <Link
                href={`/people/${sponsor.id}`}
                className="mt-1 block text-sm transition-colors hover:text-muted"
              >
                {sponsor.name} →
              </Link>
            ) : (
              <p className="mt-1 text-sm text-muted">Unlisted</p>
            )}
          </div>
          <div>
            <p className="label">Introduced</p>
            <p className="mt-1 text-sm">{formatDate(bill.introducedDate)}</p>
          </div>
          <div>
            <p className="label">Session</p>
            <p className="mt-1 text-sm">{sessionLabel}</p>
          </div>
          {bill.topics.length > 0 && (
            <div className="flex-1">
              <p className="label">Topics</p>
              <div className="mt-1.5 flex flex-wrap gap-1.5">
                {bill.topics.slice(0, 4).map((topic, index) => (
                  <span
                    key={`${topic}-${index}`}
                    className="rounded-full bg-ghost px-2.5 py-0.5 text-xs text-muted"
                  >
                    {topic}
                  </span>
                ))}
                {bill.topics.length > 4 && (
                  <span className="text-xs text-faint">+{bill.topics.length - 4}</span>
                )}
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Status Pipeline */}
      <section className="rounded-lg border border-faint p-6">
        <div className="flex items-center justify-between">
          <p className="label">Legislative progress</p>
          <p className="text-xs text-faint">
            {isSigned ? "Enacted into law" : isVetoed ? "Vetoed by President" : `${statusIndex + 1} of ${STATUS_PIPELINE.length} stages`}
          </p>
        </div>
        <div className="mt-5 flex items-center gap-1">
          {STATUS_PIPELINE.map((stage, index) => {
            const isComplete = index <= statusIndex;
            const isCurrent = index === statusIndex;
            const isVetoPoint = isVetoed && index === 6;
            return (
              <div key={stage} className="flex flex-1 flex-col items-center">
                <div
                  className={`h-1.5 w-full rounded-full transition-colors ${
                    isVetoPoint
                      ? "bg-ink"
                      : isComplete
                      ? "bg-ink"
                      : "bg-ghost"
                  }`}
                />
                <p
                  className={`mt-2 hidden text-center font-mono text-[0.6rem] sm:block ${
                    isCurrent ? "text-ink" : "text-faint"
                  }`}
                >
                  {stage.replace(" ", "\n")}
                </p>
              </div>
            );
          })}
        </div>
        {isVetoed && (
          <p className="mt-4 rounded-md border border-ink/20 bg-ghost px-3 py-2 text-center text-xs text-muted">
            This bill was vetoed and did not become law.
          </p>
        )}
      </section>

      {/* Main Content Grid */}
      <div className="grid gap-10 lg:grid-cols-[1fr_360px]">
        {/* Left Column - Primary Content */}
        <div className="space-y-10">
          {/* Bill Text Section */}
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="label">Bill text</p>
                <p className="mt-1 text-sm text-muted">Official versions from Congress.gov</p>
              </div>
              {bill.versions.length > 0 && (
                <div className="flex gap-2">
                  {bill.versions.slice(0, 3).map((version, index) => (
                    <a
                      key={`${version.label}-${index}`}
                      href={version.url}
                      target="_blank"
                      rel="noreferrer"
                      className="rounded-full border border-faint px-3 py-1 text-xs font-mono text-faint transition-all hover:border-ink hover:text-ink"
                    >
                      {version.label}
                    </a>
                  ))}
                </div>
              )}
            </div>
            {preview ? (
              <div className="overflow-hidden rounded-lg border border-faint">
                <div className="flex items-center justify-between border-b border-faint bg-ghost px-4 py-2">
                  <span className="text-xs font-mono text-faint">{preview.label}</span>
                  <a
                    href={preview.url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs text-faint transition-colors hover:text-ink"
                  >
                    Open in new tab →
                  </a>
                </div>
                {preview.isPdf ? (
                  <object
                    data={preview.url}
                    type="application/pdf"
                    className="h-[500px] w-full bg-ghost"
                  >
                    <div className="flex h-[500px] flex-col items-center justify-center p-6 text-center">
                      <div className="rounded-lg border border-faint bg-paper p-8">
                        <p className="font-mono text-sm text-muted">PDF preview unavailable</p>
                        <a
                          href={preview.url}
                          target="_blank"
                          rel="noreferrer"
                          className="mt-3 inline-flex rounded-full border border-ink bg-ink px-4 py-1.5 text-xs font-mono text-paper transition-colors hover:bg-transparent hover:text-ink"
                        >
                          Download PDF
                        </a>
                      </div>
                    </div>
                  </object>
                ) : (
                  <iframe
                    src={preview.url}
                    className="h-[500px] w-full"
                    referrerPolicy="no-referrer"
                    title="Bill text preview"
                  />
                )}
              </div>
            ) : (
              <div className="flex h-[200px] flex-col items-center justify-center rounded-lg border border-dashed border-faint bg-ghost">
                <p className="text-sm text-muted">No text versions published yet</p>
                <p className="mt-1 text-xs text-faint">Check back after committee review</p>
              </div>
            )}
          </section>

          {/* Legislative Timeline */}
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="label">Legislative timeline</p>
                <p className="mt-1 text-sm text-muted">Actions grouped by date and chamber</p>
              </div>
              <span className="rounded-full bg-ghost px-3 py-1 text-xs font-mono text-muted">
                {bill.actions.length} {bill.actions.length === 1 ? "action" : "actions"}
              </span>
            </div>
            {bill.actions.length === 0 ? (
              <div className="flex h-[120px] flex-col items-center justify-center rounded-lg border border-dashed border-faint bg-ghost">
                <p className="text-sm text-muted">No actions recorded</p>
                <p className="mt-1 text-xs text-faint">Actions will appear as the bill progresses</p>
              </div>
            ) : (
              <div className="relative space-y-6 pl-4">
                <div className="absolute bottom-0 left-[3px] top-2 w-px bg-faint" />
                {actionGroups.map((group, groupIndex) => (
                  <div key={group.date} className="relative">
                    <div className="mb-3 flex items-center gap-3">
                      <div className={`relative z-10 h-2 w-2 rounded-full ${groupIndex === 0 ? "bg-ink" : "border border-ink bg-paper"}`} />
                      <span className="font-mono text-xs text-faint">{formatDate(group.date)}</span>
                    </div>
                    <div className="ml-5 space-y-3">
                      {group.items.map((action, index) => {
                        const actionType = inferActionType(action.action);
                        const typeStyle = getActionTypeStyle(actionType);
                        return (
                          <div
                            key={`${action.date}-${action.chamber}-${index}`}
                            className="rounded-lg border border-faint bg-paper p-4 transition-all hover:border-ink/30 hover:shadow-[0_2px_8px_rgba(0,0,0,0.04)]"
                          >
                            <div className="flex flex-wrap items-center gap-2">
                              <span className={`rounded-full border px-2 py-0.5 text-[0.6rem] font-mono uppercase ${typeStyle}`}>
                                {actionType}
                              </span>
                              <span className="rounded-full border border-faint px-2 py-0.5 text-[0.6rem] font-mono text-muted">
                                {action.chamber}
                              </span>
                            </div>
                            <p className="mt-2 text-sm leading-relaxed">{action.action}</p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>

        {/* Right Column - Sidebar */}
        <aside className="space-y-6 lg:sticky lg:top-20 lg:self-start">
          {/* Latest Action Card */}
          <div className="rounded-lg border border-faint p-5">
            <p className="label">Latest action</p>
            <p className="mt-3 text-sm leading-relaxed">{latestActionLabel}</p>
            {sortedActions[0] && (
              <p className="mt-2 font-mono text-xs text-faint">
                {formatDate(sortedActions[0].date)} · {sortedActions[0].chamber}
              </p>
            )}
          </div>

          {/* Vote Results */}
          <BillVotesSection votes={bill.votes} congress={bill.congress} />

          {/* All Topics */}
          {bill.topics.length > 0 && (
            <div className="rounded-lg border border-faint p-5">
              <p className="label">All topics</p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {bill.topics.map((topic, index) => (
                  <span
                    key={`${topic}-${index}`}
                    className="rounded-full bg-ghost px-2.5 py-1 text-xs text-muted"
                  >
                    {topic}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* External Links */}
          <div className="rounded-lg border border-faint bg-ghost p-5">
            <p className="label">External resources</p>
            <div className="mt-3 space-y-2">
              <a
                href={`https://www.congress.gov/bill/${bill.congress}th-congress/${bill.number.toLowerCase().replace('.', '').replace(' ', '-')}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-between text-sm text-muted transition-colors hover:text-ink"
              >
                <span>Congress.gov</span>
                <span>→</span>
              </a>
              <a
                href={`https://www.govtrack.us/congress/bills/${bill.congress}/${bill.number.toLowerCase().replace('. ', '')}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-between text-sm text-muted transition-colors hover:text-ink"
              >
                <span>GovTrack</span>
                <span>→</span>
              </a>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
