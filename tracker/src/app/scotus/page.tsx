"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import useSWR from "swr";
import type { SupremeCourtCase } from "@/lib/types";
import { formatShortDate } from "@/lib/utils";

const fetcher = async (url: string) => {
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch");
  return res.json();
};

const currentYear = new Date().getFullYear();
const terms = Array.from({ length: 15 }, (_, i) => String(currentYear - i));

type FilterMode = "all" | "decided" | "pending";

function DecidedBadge({ date }: { date?: string }) {
  if (!date) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full border border-red-600/30 bg-red-50 px-2.5 py-1 text-xs font-medium text-red-700">
        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-red-500" />
        Pending
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-ink px-2.5 py-1 text-xs font-medium text-paper">
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
        <path d="M20 6L9 17l-5-5" />
      </svg>
      Decided {formatShortDate(date)}
    </span>
  );
}

function HeroCase({ caseData }: { caseData: SupremeCourtCase }) {
  return (
    <Link
      href={`/scotus/case/${caseData.term}/${caseData.docketNumber.trim()}`}
      className="group relative block overflow-hidden rounded-2xl border-2 border-ink bg-ink text-paper transition-all hover:shadow-2xl"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-white/10" />
      <div className="relative p-8 md:p-10">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-3">
              <span className="rounded-lg bg-paper/20 px-3 py-1 font-mono text-sm backdrop-blur-sm">
                {caseData.docketNumber}
              </span>
              <span className="text-sm text-paper/70">
                {caseData.term} Term
              </span>
            </div>
            <h2 className="font-display text-3xl tracking-tight md:text-4xl lg:text-5xl">
              {caseData.name}
            </h2>
            {caseData.question && (
              <p className="max-w-2xl text-lg leading-relaxed text-paper/80">
                {caseData.question}
              </p>
            )}
          </div>
        </div>

        <div className="mt-8 flex flex-wrap items-center gap-6 border-t border-paper/20 pt-6">
          <div>
            <p className="text-xs text-paper/50">Argued</p>
            <p className="font-mono text-sm">{formatShortDate(caseData.arguedDate) || "—"}</p>
          </div>
          <div>
            <p className="text-xs text-paper/50">Decided</p>
            <p className="font-mono text-sm">{formatShortDate(caseData.decidedDate) || "Pending"}</p>
          </div>
          <div className="ml-auto">
            <span className="inline-flex items-center gap-2 rounded-full bg-paper px-4 py-2 text-sm font-medium text-ink transition-transform group-hover:scale-105">
              View Case
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}

function CaseCard({ caseData, rank }: { caseData: SupremeCourtCase; rank: number }) {
  const isDecided = !!caseData.decidedDate;

  return (
    <Link
      href={`/scotus/case/${caseData.term}/${caseData.docketNumber.trim()}`}
      className="group block rounded-xl border border-faint bg-paper p-6 transition-all hover:border-ink hover:shadow-lg"
    >
      <div className="flex items-start justify-between gap-4">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-ghost font-mono text-sm text-muted">
          {rank}
        </span>
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className="font-mono text-xs text-faint">{caseData.docketNumber}</span>
            <DecidedBadge date={caseData.decidedDate} />
          </div>
          <h3 className="font-display text-xl tracking-tight transition-colors group-hover:text-muted line-clamp-2">
            {caseData.name}
          </h3>
          {caseData.question && (
            <p className="mt-2 text-sm text-muted line-clamp-2">{caseData.question}</p>
          )}
        </div>
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          className="shrink-0 text-faint transition-all group-hover:translate-x-1 group-hover:text-ink"
        >
          <path d="M9 18l6-6-6-6" />
        </svg>
      </div>

      <div className="mt-4 flex items-center gap-4 text-xs text-faint">
        {caseData.arguedDate && (
          <span>Argued {formatShortDate(caseData.arguedDate)}</span>
        )}
        {isDecided && caseData.description && (
          <span className="truncate max-w-[200px]">{caseData.description}</span>
        )}
      </div>
    </Link>
  );
}

function CaseListItem({ caseData }: { caseData: SupremeCourtCase }) {
  const isDecided = !!caseData.decidedDate;

  return (
    <Link
      href={`/scotus/case/${caseData.term}/${caseData.docketNumber.trim()}`}
      className="group flex items-center gap-4 border-b border-faint py-4 transition-colors hover:bg-ghost last:border-0"
    >
      <div className={`h-3 w-3 shrink-0 rounded-full ${isDecided ? "bg-ink" : "border-2 border-red-500"}`} />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs text-faint">{caseData.docketNumber}</span>
          {isDecided ? (
            <span className="text-xs text-muted">{formatShortDate(caseData.decidedDate)}</span>
          ) : (
            <span className="text-xs text-red-600">Pending</span>
          )}
        </div>
        <h4 className="font-medium transition-colors group-hover:text-muted truncate">
          {caseData.name}
        </h4>
      </div>
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        className="shrink-0 text-faint group-hover:text-ink"
      >
        <path d="M9 18l6-6-6-6" />
      </svg>
    </Link>
  );
}

export default function SupremeCourtPage() {
  const [selectedTerm, setSelectedTerm] = useState(String(currentYear));
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<FilterMode>("all");

  const { data, isLoading, error } = useSWR<{
    cases: SupremeCourtCase[];
    status: string;
  }>(`/api/scotus?term=${selectedTerm}&limit=100`, fetcher, {
    revalidateOnFocus: false,
    dedupingInterval: 60000,
  });

  const cases = data?.cases ?? [];
  const status = data?.status ?? "unavailable";

  const filtered = useMemo(() => {
    let list = cases;

    if (filter === "decided") {
      list = list.filter((c) => c.decidedDate);
    } else if (filter === "pending") {
      list = list.filter((c) => !c.decidedDate);
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.docketNumber?.toLowerCase().includes(q) ||
          c.question?.toLowerCase().includes(q)
      );
    }

    return list;
  }, [cases, search, filter]);

  const stats = useMemo(() => {
    const decided = cases.filter((c) => c.decidedDate).length;
    const pending = cases.filter((c) => !c.decidedDate).length;
    return { decided, pending, total: cases.length };
  }, [cases]);

  const heroCase = filtered[0];
  const featuredCases = filtered.slice(1, 5);
  const remainingCases = filtered.slice(5);

  return (
    <div className="space-y-16">
      {/* Header */}
      <header className="space-y-8">
        <div className="flex items-center gap-3 text-xs font-mono text-faint">
          <span>Judicial Branch</span>
          <span className="text-faint/30">/</span>
          <span>Supreme Court of the United States</span>
          <span className="ml-auto flex items-center gap-2">
            <span className={`h-2 w-2 rounded-full ${status === "live" ? "bg-green-500" : "bg-faint"}`} />
            {status === "live" ? "Live" : "Offline"}
          </span>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1fr_auto]">
          <div className="space-y-4">
            <h1 className="font-display text-5xl tracking-tight md:text-6xl lg:text-7xl">
              Supreme Court
            </h1>
            <p className="max-w-xl text-xl text-muted">
              Rulings, oral arguments, and decisions from the nation's highest court.
            </p>
          </div>

          <div className="flex items-end">
            <div className="grid grid-cols-3 gap-6 rounded-2xl border border-faint p-6">
              <div className="text-center">
                <p className="font-mono text-4xl tracking-tight">{stats.total}</p>
                <p className="text-xs text-faint">Total</p>
              </div>
              <div className="text-center border-x border-faint px-6">
                <p className="font-mono text-4xl tracking-tight">{stats.decided}</p>
                <p className="text-xs text-faint">Decided</p>
              </div>
              <div className="text-center">
                <p className="font-mono text-4xl tracking-tight text-red-600">{stats.pending}</p>
                <p className="text-xs text-faint">Pending</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Controls */}
      <div className="flex flex-wrap items-center gap-4 border-y border-faint py-4">
        <select
          value={selectedTerm}
          onChange={(e) => setSelectedTerm(e.target.value)}
          className="rounded-lg border-2 border-faint bg-transparent px-4 py-2.5 font-medium transition-colors focus:border-ink focus:outline-none"
        >
          {terms.map((term) => (
            <option key={term} value={term}>
              {term} Term
            </option>
          ))}
        </select>

        <div className="flex overflow-hidden rounded-lg border-2 border-faint">
          {(["all", "decided", "pending"] as FilterMode[]).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2.5 text-sm font-medium capitalize transition-colors ${
                filter === f
                  ? "bg-ink text-paper"
                  : "bg-transparent text-muted hover:bg-ghost hover:text-ink"
              }`}
            >
              {f} {f === "decided" ? `(${stats.decided})` : f === "pending" ? `(${stats.pending})` : ""}
            </button>
          ))}
        </div>

        <div className="relative flex-1 max-w-sm ml-auto">
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="absolute left-4 top-1/2 -translate-y-1/2 text-faint"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="M21 21l-4.35-4.35" />
          </svg>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search cases..."
            className="w-full rounded-lg border-2 border-faint bg-transparent py-2.5 pl-12 pr-4 transition-colors placeholder:text-faint focus:border-ink focus:outline-none"
          />
        </div>
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="py-32 text-center">
          <div className="inline-block h-10 w-10 animate-spin rounded-full border-4 border-faint border-t-ink" />
          <p className="mt-4 text-lg text-muted">Loading cases...</p>
        </div>
      ) : error ? (
        <div className="rounded-2xl border-2 border-faint bg-ghost p-16 text-center">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="mx-auto text-faint">
            <circle cx="12" cy="12" r="10" />
            <path d="M12 8v4M12 16h.01" />
          </svg>
          <p className="mt-6 text-xl text-muted">Failed to load cases</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 rounded-lg bg-ink px-6 py-2 text-paper transition-opacity hover:opacity-80"
          >
            Retry
          </button>
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-2xl border-2 border-faint bg-ghost p-16 text-center">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="mx-auto text-faint">
            <circle cx="11" cy="11" r="8" />
            <path d="M21 21l-4.35-4.35" />
          </svg>
          <p className="mt-6 text-xl text-muted">
            {cases.length === 0 ? `No cases for ${selectedTerm} term` : "No matching cases"}
          </p>
        </div>
      ) : (
        <div className="space-y-12">
          {/* Hero Case */}
          {heroCase && <HeroCase caseData={heroCase} />}

          {/* Featured Grid */}
          {featuredCases.length > 0 && (
            <div className="grid gap-4 md:grid-cols-2">
              {featuredCases.map((c, i) => (
                <CaseCard key={c.id} caseData={c} rank={i + 2} />
              ))}
            </div>
          )}

          {/* Remaining Cases List */}
          {remainingCases.length > 0 && (
            <div className="rounded-2xl border border-faint">
              <div className="border-b border-faint px-6 py-4">
                <h3 className="font-medium">
                  All Cases
                  <span className="ml-2 text-sm text-faint">({remainingCases.length})</span>
                </h3>
              </div>
              <div className="px-6">
                {remainingCases.map((c) => (
                  <CaseListItem key={c.id} caseData={c} />
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Footer */}
      <footer className="rounded-2xl bg-ghost p-8">
        <div className="flex items-start gap-6">
          <div className="rounded-xl bg-ink p-3">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-paper">
              <path d="M12 2L2 7l10 5 10-5-10-5z" />
              <path d="M2 17l10 5 10-5" />
              <path d="M2 12l10 5 10-5" />
            </svg>
          </div>
          <div className="space-y-3">
            <h4 className="font-display text-xl">Data Sources</h4>
            <p className="text-muted max-w-2xl">
              Case information, oral argument audio, and vote breakdowns powered by{" "}
              <a href="https://www.oyez.org" target="_blank" rel="noreferrer" className="font-medium text-ink underline">
                Oyez
              </a>
              , a free law project by Cornell Law, Chicago-Kent, and Justia. Click any case to view
              full details including justice votes, written opinions, and audio recordings.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
