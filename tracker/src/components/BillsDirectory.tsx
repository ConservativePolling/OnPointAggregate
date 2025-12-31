"use client";

import Link from "next/link";
import { useMemo, useState, useCallback, useEffect, useRef } from "react";
import type { Bill, BillStatus as BillStatusType } from "@/lib/types";
import BillStatus from "@/components/BillStatus";
import { formatDate } from "@/lib/utils";

const statusFilters: Array<"All" | BillStatusType> = [
  "All",
  "Introduced",
  "In Committee",
  "Reported",
  "Passed House",
  "Passed Senate",
  "To President",
  "Signed",
  "Vetoed",
];

type SortOption = "newest" | "oldest" | "status" | "sponsor";
type BillCategory = "all" | "substantive" | "procedural";

// Keywords that indicate procedural/administrative bills
const PROCEDURAL_KEYWORDS = [
  "speaker",
  "clerk",
  "sergeant at arms",
  "chaplain",
  "adjournment",
  "sine die",
  "recess",
  "rules of the house",
  "committee funding",
  "committee expenses",
  "authorizing the speaker",
  "directing the clerk",
  "electing",
  "providing for consideration",
  "waiving a requirement",
  "providing amounts",
  "designating",
  "permitting the use",
  "authorizing the use of",
];

function isProcedural(bill: Bill): boolean {
  const title = bill.title.toLowerCase();
  const lastAction = bill.lastAction?.toLowerCase() || "";
  const combined = `${title} ${lastAction}`;
  return PROCEDURAL_KEYWORDS.some(keyword => combined.includes(keyword));
}

// Pagination config
const ITEMS_PER_PAGE = 25;

interface BillsDirectoryProps {
  bills: Bill[];
  sponsorLookup: Record<string, string>;
}

export default function BillsDirectory({
  bills,
  sponsorLookup,
}: BillsDirectoryProps) {
  const [statusFilter, setStatusFilter] = useState<(typeof statusFilters)[number]>("All");
  const [query, setQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("newest");
  const [category, setCategory] = useState<BillCategory>("substantive");
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  const statusCounts = useMemo(() => {
    const filteredByCategory = category === "all"
      ? bills
      : category === "substantive"
        ? bills.filter(b => !isProcedural(b))
        : bills.filter(b => isProcedural(b));

    const counts: Record<(typeof statusFilters)[number], number> = {
      All: filteredByCategory.length,
      Introduced: 0,
      "In Committee": 0,
      Reported: 0,
      "Passed House": 0,
      "Passed Senate": 0,
      "To President": 0,
      Signed: 0,
      Vetoed: 0,
    };

    filteredByCategory.forEach((bill) => {
      counts[bill.status] += 1;
    });

    return counts;
  }, [bills, category]);

  const categoryCounts = useMemo(() => {
    const substantive = bills.filter(b => !isProcedural(b)).length;
    const procedural = bills.filter(b => isProcedural(b)).length;
    return { all: bills.length, substantive, procedural };
  }, [bills]);

  const filteredAndSortedBills = useMemo(() => {
    let list = [...bills];

    // Filter by category
    if (category === "substantive") {
      list = list.filter(b => !isProcedural(b));
    } else if (category === "procedural") {
      list = list.filter(b => isProcedural(b));
    }

    // Filter by status
    if (statusFilter !== "All") {
      list = list.filter(bill => bill.status === statusFilter);
    }

    // Filter by search query
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(bill =>
        `${bill.title} ${bill.number} ${sponsorLookup[bill.sponsorId] || ""}`
          .toLowerCase()
          .includes(q)
      );
    }

    // Sort
    switch (sortBy) {
      case "newest":
        list.sort((a, b) => new Date(b.introducedDate).getTime() - new Date(a.introducedDate).getTime());
        break;
      case "oldest":
        list.sort((a, b) => new Date(a.introducedDate).getTime() - new Date(b.introducedDate).getTime());
        break;
      case "status":
        const statusOrder = statusFilters.slice(1);
        list.sort((a, b) => statusOrder.indexOf(a.status) - statusOrder.indexOf(b.status));
        break;
      case "sponsor":
        list.sort((a, b) => {
          const nameA = sponsorLookup[a.sponsorId] || "";
          const nameB = sponsorLookup[b.sponsorId] || "";
          return nameA.localeCompare(nameB);
        });
        break;
    }

    return list;
  }, [bills, statusFilter, query, sortBy, category, sponsorLookup]);

  // Reset visible count when filters change
  useEffect(() => {
    setVisibleCount(ITEMS_PER_PAGE);
  }, [statusFilter, query, sortBy, category]);

  // Infinite scroll observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && visibleCount < filteredAndSortedBills.length) {
          setIsLoadingMore(true);
          // Small delay for smooth UX
          setTimeout(() => {
            setVisibleCount(prev => Math.min(prev + ITEMS_PER_PAGE, filteredAndSortedBills.length));
            setIsLoadingMore(false);
          }, 150);
        }
      },
      { threshold: 0.1, rootMargin: "100px" }
    );

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }

    return () => observer.disconnect();
  }, [visibleCount, filteredAndSortedBills.length]);

  const visibleBills = filteredAndSortedBills.slice(0, visibleCount);
  const hasMore = visibleCount < filteredAndSortedBills.length;

  return (
    <div className="space-y-6">
      {/* Refined Controls Bar */}
      <div className="flex flex-wrap items-center gap-3 border-b border-faint pb-4">
        {/* Category Pills - Minimal & Elegant */}
        <div className="flex items-center gap-1 rounded-full border border-faint p-1">
          {(["substantive", "procedural"] as BillCategory[]).map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setCategory(cat)}
              className={`rounded-full px-3 py-1 text-xs font-medium transition-all ${
                category === cat
                  ? "bg-ink text-paper"
                  : "text-muted hover:text-ink"
              }`}
            >
              {cat === "substantive" ? "Legislation" : "Procedural"}
            </button>
          ))}
          <button
            type="button"
            onClick={() => setCategory("all")}
            className={`rounded-full px-3 py-1 text-xs font-medium transition-all ${
              category === "all"
                ? "bg-ink text-paper"
                : "text-muted hover:text-ink"
            }`}
          >
            All
          </button>
        </div>

        <span className="text-faint">·</span>

        {/* Sort - Compact Dropdown */}
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as SortOption)}
          className="rounded-full border border-faint bg-transparent px-3 py-1.5 text-xs font-medium text-muted transition-colors focus:border-ink focus:outline-none hover:border-ink hover:text-ink cursor-pointer"
        >
          <option value="newest">Newest</option>
          <option value="oldest">Oldest</option>
          <option value="status">By Status</option>
          <option value="sponsor">By Sponsor</option>
        </select>

        {/* Search - Refined */}
        <div className="relative ml-auto">
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="absolute left-3 top-1/2 -translate-y-1/2 text-faint"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="M21 21l-4.35-4.35" />
          </svg>
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search..."
            className="w-48 rounded-full border border-faint bg-transparent py-1.5 pl-9 pr-3 text-xs placeholder:text-faint focus:border-ink focus:outline-none focus:w-64 transition-all"
          />
        </div>

        {/* Results Count - Subtle */}
        <span className="text-xs text-faint tabular-nums">
          {filteredAndSortedBills.length.toLocaleString()}
        </span>
      </div>

      <div className="grid gap-8 lg:grid-cols-[220px_1fr]">
        {/* Sidebar - Compact */}
        <aside className="space-y-4 lg:sticky lg:top-20 lg:self-start">
          <div className="space-y-0.5">
            <p className="px-2 text-[10px] font-medium uppercase tracking-widest text-faint">Status</p>
            {statusFilters.map((item) => {
              const count = statusCounts[item] ?? 0;
              const isActive = statusFilter === item;
              const isZero = count === 0 && item !== "All";
              return (
                <button
                  key={item}
                  type="button"
                  onClick={() => setStatusFilter(item)}
                  disabled={isZero}
                  className={`flex w-full items-center justify-between rounded px-2 py-1.5 text-left text-sm transition-all ${
                    isActive
                      ? "bg-ink text-paper"
                      : isZero
                        ? "text-faint/40 cursor-not-allowed"
                        : "text-muted hover:bg-ghost hover:text-ink"
                  }`}
                >
                  <span className="truncate">{item}</span>
                  <span className={`font-mono text-[10px] tabular-nums ${isActive ? "text-paper/60" : "text-faint"}`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Quick Stats */}
          <div className="border-t border-faint pt-4">
            <p className="px-2 text-[10px] font-medium uppercase tracking-widest text-faint">Breakdown</p>
            <div className="mt-2 grid grid-cols-2 gap-2 px-2">
              <div>
                <p className="font-mono text-lg tabular-nums">{categoryCounts.substantive.toLocaleString()}</p>
                <p className="text-[10px] text-faint">Legislation</p>
              </div>
              <div>
                <p className="font-mono text-lg tabular-nums">{categoryCounts.procedural.toLocaleString()}</p>
                <p className="text-[10px] text-faint">Procedural</p>
              </div>
            </div>
          </div>

          {(statusFilter !== "All" || query || category !== "substantive") && (
            <button
              type="button"
              onClick={() => {
                setStatusFilter("All");
                setQuery("");
                setCategory("substantive");
              }}
              className="w-full rounded border border-faint px-2 py-1.5 text-xs text-muted transition-colors hover:border-ink hover:text-ink"
            >
              Reset filters
            </button>
          )}
        </aside>

        {/* Main Content */}
        <div className="space-y-2">
          {visibleBills.length === 0 ? (
            <div className="flex h-[300px] flex-col items-center justify-center rounded-lg border border-dashed border-faint">
              <p className="text-sm text-muted">No bills match your filters</p>
              <p className="mt-1 text-xs text-faint">Try adjusting your search or filters</p>
            </div>
          ) : (
            <>
              {visibleBills.map((bill, idx) => {
                const sponsorName = sponsorLookup[bill.sponsorId];
                const isProceduralBill = isProcedural(bill);
                return (
                  <Link
                    key={bill.id}
                    href={`/bills/${encodeURIComponent(bill.id)}`}
                    className="group flex items-start gap-4 border-b border-faint py-4 transition-colors hover:bg-ghost first:pt-0 last:border-0"
                  >
                    {/* Rank/Index - Subtle */}
                    <span className="w-8 shrink-0 pt-0.5 text-right font-mono text-xs text-faint/50">
                      {idx + 1}
                    </span>

                    {/* Content */}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 text-xs">
                        <span className="font-mono text-faint">{bill.number}</span>
                        <span className="text-faint/30">·</span>
                        <span className="text-faint">{formatDate(bill.introducedDate)}</span>
                        {isProceduralBill && (
                          <>
                            <span className="text-faint/30">·</span>
                            <span className="text-faint/60">proc.</span>
                          </>
                        )}
                      </div>
                      <h3 className="mt-1 font-medium leading-snug transition-colors group-hover:text-muted line-clamp-2">
                        {bill.title}
                      </h3>
                      {sponsorName && (
                        <p className="mt-1 text-xs text-faint">
                          {sponsorName}
                        </p>
                      )}
                    </div>

                    {/* Status Badge */}
                    <div className="shrink-0">
                      <BillStatus status={bill.status} />
                    </div>
                  </Link>
                );
              })}

              {/* Infinite Scroll Trigger */}
              {hasMore && (
                <div ref={loadMoreRef} className="flex items-center justify-center py-8">
                  {isLoadingMore ? (
                    <div className="flex items-center gap-2 text-sm text-muted">
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-faint border-t-ink" />
                      Loading more...
                    </div>
                  ) : (
                    <span className="text-xs text-faint">
                      Showing {visibleCount.toLocaleString()} of {filteredAndSortedBills.length.toLocaleString()}
                    </span>
                  )}
                </div>
              )}

              {/* End of List */}
              {!hasMore && filteredAndSortedBills.length > ITEMS_PER_PAGE && (
                <div className="py-8 text-center">
                  <span className="text-xs text-faint">
                    All {filteredAndSortedBills.length.toLocaleString()} bills loaded
                  </span>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
