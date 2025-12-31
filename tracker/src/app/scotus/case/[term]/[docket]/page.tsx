import { notFound } from "next/navigation";
import Link from "next/link";
import { fetchSupremeCourtCaseByDocket } from "@/lib/ingest/oyez";
import { formatShortDate, formatLongDate } from "@/lib/utils";

function VoteVisualization({
  majority,
  minority,
  winningParty,
}: {
  majority: number;
  minority: number;
  winningParty?: string;
}) {
  const total = majority + minority || 9;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted">Vote Breakdown</span>
        <span className="font-mono text-2xl tracking-tight">
          {majority}-{minority}
        </span>
      </div>

      <div className="flex gap-1">
        {Array.from({ length: 9 }).map((_, i) => {
          const isMajority = i < majority;
          return (
            <div
              key={i}
              className={`h-12 flex-1 rounded-lg transition-colors ${
                isMajority
                  ? "bg-ink"
                  : i < majority + minority
                    ? "bg-faint/50"
                    : "bg-ghost"
              }`}
            />
          );
        })}
      </div>

      <div className="flex justify-between text-xs">
        <span className="text-muted">
          {majority} Justice{majority !== 1 ? "s" : ""} in Majority
        </span>
        <span className="text-muted">
          {minority} in Dissent
        </span>
      </div>

      {winningParty && (
        <div className="flex items-center gap-2 rounded-lg bg-ghost p-3">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-green-600">
            <path d="M20 6L9 17l-5-5" />
          </svg>
          <span className="text-sm">
            Decided for <span className="font-semibold">{winningParty}</span>
          </span>
        </div>
      )}
    </div>
  );
}

function JusticeVoteCard({
  justice,
  isAuthor,
  isDissentAuthor,
}: {
  justice: { name: string; vote: string; opinion?: string };
  isAuthor: boolean;
  isDissentAuthor: boolean;
}) {
  const isMajority = justice.vote === "majority";

  return (
    <div
      className={`flex items-center justify-between rounded-lg border p-3 transition-colors ${
        isMajority ? "border-ink bg-ink/5" : "border-faint bg-ghost"
      }`}
    >
      <div className="flex items-center gap-3">
        <div
          className={`h-8 w-8 rounded-full flex items-center justify-center text-xs font-medium ${
            isMajority ? "bg-ink text-paper" : "bg-faint/50 text-muted"
          }`}
        >
          {justice.name.split(" ").pop()?.charAt(0)}
        </div>
        <div>
          <p className="font-medium text-sm">{justice.name}</p>
          {justice.opinion && justice.opinion !== "none" && (
            <p className="text-xs text-muted capitalize">{justice.opinion}</p>
          )}
        </div>
      </div>
      <div className="flex items-center gap-2">
        {isAuthor && (
          <span className="rounded-full bg-ink px-2 py-0.5 text-xs font-medium text-paper">
            Author
          </span>
        )}
        {isDissentAuthor && (
          <span className="rounded-full border border-ink px-2 py-0.5 text-xs font-medium">
            Dissent
          </span>
        )}
        <span className={`text-xs font-medium ${isMajority ? "text-ink" : "text-muted"}`}>
          {isMajority ? "Majority" : "Dissent"}
        </span>
      </div>
    </div>
  );
}

function AudioPlayer({ title, audioUrl }: { title?: string; audioUrl?: string }) {
  if (!audioUrl) return null;

  return (
    <div className="space-y-3 rounded-xl border border-faint p-4">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-ink">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="text-paper ml-0.5">
            <path d="M8 5v14l11-7z" />
          </svg>
        </div>
        <div>
          <p className="text-sm font-medium">{title || "Oral Argument"}</p>
          <p className="text-xs text-muted">Audio Recording</p>
        </div>
      </div>
      <audio controls className="w-full h-10" preload="none">
        <source src={audioUrl} type="audio/mpeg" />
        Your browser does not support audio.
      </audio>
    </div>
  );
}

function TimelineItem({ event, date, isLast }: { event: string; date: string; isLast: boolean }) {
  return (
    <div className="flex gap-4">
      <div className="flex flex-col items-center">
        <div className="h-3 w-3 rounded-full bg-ink" />
        {!isLast && <div className="w-0.5 flex-1 bg-faint" />}
      </div>
      <div className="pb-6">
        <p className="font-medium">{event}</p>
        <p className="text-sm text-muted">{formatShortDate(date)}</p>
      </div>
    </div>
  );
}

export default async function CaseDetailPage({
  params,
}: {
  params: Promise<{ term: string; docket: string }>;
}) {
  const { term, docket } = await params;

  const caseData = await fetchSupremeCourtCaseByDocket(term, docket);

  if (!caseData) {
    notFound();
  }

  const hasDecision = !!caseData.decidedDate;
  const majorityJustices = caseData.justiceVotes?.filter((v) => v.vote === "majority") || [];
  const dissentJustices = caseData.justiceVotes?.filter((v) => v.vote !== "majority") || [];

  return (
    <div className="space-y-12">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm">
        <Link href="/scotus" className="text-muted hover:text-ink transition-colors">
          Supreme Court
        </Link>
        <span className="text-faint">/</span>
        <span className="text-muted">{term} Term</span>
        <span className="text-faint">/</span>
        <span className="font-mono">{caseData.docketNumber}</span>
      </nav>

      {/* Hero */}
      <header className="space-y-6">
        <div className="flex flex-wrap items-center gap-3">
          {hasDecision ? (
            <span className="inline-flex items-center gap-2 rounded-full bg-ink px-4 py-1.5 text-sm font-medium text-paper">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                <path d="M20 6L9 17l-5-5" />
              </svg>
              Decided
            </span>
          ) : (
            <span className="inline-flex items-center gap-2 rounded-full border-2 border-red-500 px-4 py-1.5 text-sm font-medium text-red-600">
              <span className="h-2 w-2 animate-pulse rounded-full bg-red-500" />
              Pending Decision
            </span>
          )}
          <span className="font-mono text-sm text-muted">{caseData.docketNumber}</span>
        </div>

        <h1 className="font-display text-4xl tracking-tight md:text-5xl lg:text-6xl">
          {caseData.name}
        </h1>

        {caseData.lowerCourt && (
          <p className="text-lg text-muted">
            On appeal from the <span className="text-ink">{caseData.lowerCourt}</span>
          </p>
        )}

        {/* Key Dates */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 rounded-xl border border-faint p-4">
          <div>
            <p className="text-xs text-faint uppercase tracking-wider">Granted</p>
            <p className="mt-1 font-mono">{formatShortDate(caseData.grantedDate) || "—"}</p>
          </div>
          <div>
            <p className="text-xs text-faint uppercase tracking-wider">Argued</p>
            <p className="mt-1 font-mono">{formatShortDate(caseData.arguedDate) || "—"}</p>
          </div>
          <div>
            <p className="text-xs text-faint uppercase tracking-wider">Decided</p>
            <p className="mt-1 font-mono">{formatShortDate(caseData.decidedDate) || "Pending"}</p>
          </div>
          <div>
            <p className="text-xs text-faint uppercase tracking-wider">Citation</p>
            <p className="mt-1 font-mono">
              {caseData.citation?.volume
                ? `${caseData.citation.volume} U.S. ${caseData.citation.page || "___"}`
                : "—"}
            </p>
          </div>
        </div>
      </header>

      {/* Main Content Grid */}
      <div className="grid gap-12 lg:grid-cols-[1fr_380px]">
        <main className="space-y-12">
          {/* Parties */}
          <section>
            <h2 className="mb-4 font-display text-xl">Parties</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-xl border-2 border-ink p-5">
                <p className="text-xs text-muted uppercase tracking-wider">
                  {caseData.firstPartyLabel || "Petitioner"}
                </p>
                <p className="mt-2 font-display text-xl">{caseData.firstParty || "—"}</p>
              </div>
              <div className="rounded-xl border border-faint p-5">
                <p className="text-xs text-muted uppercase tracking-wider">
                  {caseData.secondPartyLabel || "Respondent"}
                </p>
                <p className="mt-2 font-display text-xl">{caseData.secondParty || "—"}</p>
              </div>
            </div>
          </section>

          {/* Question Presented */}
          {caseData.question && (
            <section>
              <h2 className="mb-4 font-display text-xl">Question Presented</h2>
              <blockquote className="border-l-4 border-ink bg-ghost p-6 text-lg leading-relaxed">
                {caseData.question}
              </blockquote>
            </section>
          )}

          {/* Facts of the Case */}
          {caseData.factsOfTheCase && (
            <section>
              <h2 className="mb-4 font-display text-xl">Facts of the Case</h2>
              <div className="prose prose-sm max-w-none">
                <p className="leading-relaxed text-muted">{caseData.factsOfTheCase}</p>
              </div>
            </section>
          )}

          {/* Decision / Holding */}
          {(caseData.conclusion || caseData.description) && (
            <section>
              <h2 className="mb-4 font-display text-xl">Holding</h2>
              <div className="rounded-xl border-2 border-ink bg-ink/5 p-6">
                <p className="text-lg leading-relaxed">{caseData.conclusion || caseData.description}</p>
                {caseData.majorityAuthor && (
                  <p className="mt-4 text-sm text-muted">
                    Opinion delivered by Justice <span className="font-semibold text-ink">{caseData.majorityAuthor}</span>
                  </p>
                )}
              </div>
            </section>
          )}

          {/* Justice Votes */}
          {caseData.justiceVotes && caseData.justiceVotes.length > 0 && (
            <section>
              <h2 className="mb-4 font-display text-xl">How the Justices Voted</h2>

              {caseData.votes && (
                <div className="mb-6">
                  <VoteVisualization
                    majority={caseData.votes.majority}
                    minority={caseData.votes.minority}
                    winningParty={caseData.winningParty}
                  />
                </div>
              )}

              <div className="grid gap-6 md:grid-cols-2">
                {majorityJustices.length > 0 && (
                  <div className="space-y-3">
                    <h3 className="flex items-center gap-2 text-sm font-medium">
                      <span className="h-3 w-3 rounded-full bg-ink" />
                      Majority ({majorityJustices.length})
                    </h3>
                    <div className="space-y-2">
                      {majorityJustices.map((j) => (
                        <JusticeVoteCard
                          key={j.id || j.name}
                          justice={j}
                          isAuthor={j.name === caseData.majorityAuthor}
                          isDissentAuthor={false}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {dissentJustices.length > 0 && (
                  <div className="space-y-3">
                    <h3 className="flex items-center gap-2 text-sm font-medium">
                      <span className="h-3 w-3 rounded-full border-2 border-faint" />
                      Dissent ({dissentJustices.length})
                    </h3>
                    <div className="space-y-2">
                      {dissentJustices.map((j) => (
                        <JusticeVoteCard
                          key={j.id || j.name}
                          justice={j}
                          isAuthor={false}
                          isDissentAuthor={caseData.dissentAuthors?.includes(j.name) || false}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </section>
          )}
        </main>

        {/* Sidebar */}
        <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
          {/* Oral Arguments */}
          {caseData.oralArguments && caseData.oralArguments.length > 0 && (
            <div className="space-y-3">
              <h3 className="font-medium">Oral Arguments</h3>
              {caseData.oralArguments.map((arg, i) => (
                <AudioPlayer key={i} title={arg.title} audioUrl={arg.audioUrl} />
              ))}
            </div>
          )}

          {/* Advocates */}
          {caseData.advocates && caseData.advocates.length > 0 && (
            <div className="rounded-xl border border-faint p-5">
              <h3 className="mb-4 font-medium">Counsel</h3>
              <div className="space-y-4">
                {caseData.advocates.map((adv, i) => (
                  <div key={i} className="border-b border-faint pb-4 last:border-0 last:pb-0">
                    <p className="font-medium text-sm">{adv.name}</p>
                    {adv.description && (
                      <p className="mt-0.5 text-xs text-muted">{adv.description}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Written Opinions */}
          {caseData.writtenOpinions && caseData.writtenOpinions.length > 0 && (
            <div className="rounded-xl border border-faint p-5">
              <h3 className="mb-4 font-medium">Written Opinions</h3>
              <div className="space-y-3">
                {caseData.writtenOpinions.map((op, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div>
                      <p className="text-sm capitalize">{op.type}</p>
                      {op.author && <p className="text-xs text-muted">{op.author}</p>}
                    </div>
                    {op.pdfUrl && (
                      <a
                        href={op.pdfUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="rounded-lg bg-ghost px-3 py-1.5 text-xs font-medium transition-colors hover:bg-ink hover:text-paper"
                      >
                        Read
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Timeline */}
          {caseData.timeline.length > 0 && (
            <div className="rounded-xl border border-faint p-5">
              <h3 className="mb-4 font-medium">Timeline</h3>
              <div>
                {caseData.timeline.map((item, i) => (
                  <TimelineItem
                    key={i}
                    event={item.event}
                    date={item.date}
                    isLast={i === caseData.timeline.length - 1}
                  />
                ))}
              </div>
            </div>
          )}

          {/* External Links */}
          <div className="space-y-2">
            {caseData.oyezUrl && (
              <a
                href={caseData.oyezUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-between rounded-xl border border-faint px-5 py-4 transition-all hover:border-ink hover:shadow-md"
              >
                <span className="font-medium">View on Oyez</span>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M7 17L17 7M17 7H7M17 7V17" />
                </svg>
              </a>
            )}
            {caseData.justiaUrl && (
              <a
                href={caseData.justiaUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-between rounded-xl border border-faint px-5 py-4 transition-all hover:border-ink hover:shadow-md"
              >
                <span className="font-medium">View on Justia</span>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M7 17L17 7M17 7H7M17 7V17" />
                </svg>
              </a>
            )}
          </div>
        </aside>
      </div>

      {/* Back Link */}
      <div className="border-t border-faint pt-8">
        <Link
          href="/scotus"
          className="inline-flex items-center gap-2 rounded-lg bg-ghost px-4 py-2 text-sm font-medium transition-colors hover:bg-ink hover:text-paper"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          Back to all cases
        </Link>
      </div>
    </div>
  );
}
