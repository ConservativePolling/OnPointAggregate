"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { president, vicePresident, cabinetMembers } from "@/lib/data/executive";
import type { ExecutiveOrder, ExecutiveActionType } from "@/lib/types";
import { formatDate } from "@/lib/utils";
import useSWR from "swr";
import PresidentLocationMap from "@/components/PresidentLocationMap";
import WhiteHouseSchedule from "@/components/WhiteHouseSchedule";
import XTimeline from "@/components/XTimeline";

type FilterKey = "all" | ExecutiveActionType;

const actionTypeStyles: Record<ExecutiveActionType, string> = {
  "Executive Order": "bg-ink text-paper",
  "Presidential Memorandum": "border border-ink text-ink",
  Proclamation: "border border-faint text-muted",
  "Presidential Notice": "border border-faint text-faint",
};

const fetcher = async (url: string) => {
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch");
  return res.json();
};

function daysInOffice(startDate: string): number {
  const start = new Date(startDate);
  const now = new Date();
  return Math.floor((now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
}

export default function PresidentPage() {
  const [filter, setFilter] = useState<FilterKey>("all");
  const [search, setSearch] = useState("");

  const { data, isLoading } = useSWR<{
    orders: ExecutiveOrder[];
    status: string;
  }>("/api/executive-orders", fetcher, {
    revalidateOnFocus: false,
    dedupingInterval: 60000,
  });

  const orders = data?.orders ?? [];
  const status = data?.status ?? "unavailable";

  const filtered = useMemo(() => {
    let list = orders;
    if (filter !== "all") {
      list = list.filter((o) => o.type === filter);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (o) =>
          o.title.toLowerCase().includes(q) ||
          o.number?.includes(q) ||
          o.topics.some((t) => t.toLowerCase().includes(q))
      );
    }
    return list;
  }, [orders, filter, search]);

  const counts = useMemo(() => {
    const c: Record<string, number> = { all: orders.length };
    orders.forEach((o) => {
      c[o.type] = (c[o.type] ?? 0) + 1;
    });
    return c;
  }, [orders]);

  const filterOptions: FilterKey[] = [
    "all",
    "Executive Order",
    "Presidential Memorandum",
    "Proclamation",
  ];

  const days = daysInOffice(president.serviceStart);
  const handleUrl = president.xHandle
    ? `https://x.com/${president.xHandle}`
    : "";

  return (
    <div className="space-y-12">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-faint pb-4 text-xs font-mono text-faint">
        <span>Executive Branch</span>
        <span>47th Administration</span>
        <span>Inaugurated {formatDate(president.serviceStart)}</span>
      </div>

      <header className="grid gap-10 border-b border-faint pb-10 lg:grid-cols-[1.6fr_0.4fr]">
        <div className="space-y-6">
          <div className="space-y-1">
            <p className="font-mono text-[0.65rem] tracking-widest text-faint uppercase">
              The White House
            </p>
            <h1 className="font-display text-4xl tracking-tight md:text-5xl lg:text-6xl">
              {president.name}
            </h1>
            <p className="text-lg text-muted">{president.roleTitle}</p>
          </div>

          <div className="grid grid-cols-3 gap-6 border-t border-faint pt-6">
            <div>
              <p className="font-mono text-3xl tracking-tight">{days}</p>
              <p className="text-xs text-faint">Days in office</p>
            </div>
            <div>
              <p className="font-mono text-3xl tracking-tight">
                {counts["Executive Order"] ?? 0}
              </p>
              <p className="text-xs text-faint">Executive orders</p>
            </div>
            <div>
              <p className="font-mono text-3xl tracking-tight">{orders.length}</p>
              <p className="text-xs text-faint">Total actions</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {president.focusAreas.map((area) => (
              <span
                key={area}
                className="rounded-full border border-faint px-3 py-1 text-xs text-muted"
              >
                {area}
              </span>
            ))}
          </div>
        </div>

        <div className="space-y-6 border-l border-faint pl-6">
          <div className="space-y-3">
            <p className="label">Party</p>
            <p className="text-sm">Republican</p>
          </div>
          <div className="space-y-3">
            <p className="label">Term</p>
            <p className="text-sm">2nd term (non-consecutive)</p>
          </div>
          {president.xHandle && (
            <a
              href={handleUrl}
              target="_blank"
              rel="noreferrer"
              className="group flex items-center gap-2 text-sm text-faint transition-colors hover:text-ink"
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
              @{president.xHandle}
            </a>
          )}
        </div>
      </header>

      <section className="grid gap-10 lg:grid-cols-[1fr_300px]">
        <div className="space-y-6">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2 className="font-display text-2xl tracking-tight">
                Executive Actions
              </h2>
              <p className="mt-1 text-sm text-muted">
                Orders, memoranda, and proclamations from the Federal Register.
              </p>
            </div>
            <span className="font-mono text-xs text-faint">
              {status === "live" ? "Live data" : "Data pending"}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-3 border-b border-faint pb-4">
            <div className="flex flex-wrap gap-1">
              {filterOptions.map((f) => {
                const label = f === "all" ? "All" : f;
                const c = counts[f] ?? 0;
                if (c === 0 && f !== "all") return null;
                return (
                  <button
                    key={f}
                    onClick={() => setFilter(f)}
                    className={`rounded-full px-3 py-1.5 text-xs transition-colors ${
                      filter === f
                        ? "bg-ink text-paper"
                        : "border border-faint text-muted hover:border-ink hover:text-ink"
                    }`}
                  >
                    {f === "all" ? "All" : f.replace("Presidential ", "")} {c}
                  </button>
                );
              })}
            </div>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search orders..."
              className="w-48 rounded border border-faint bg-transparent px-3 py-1.5 text-sm placeholder:text-faint focus:border-ink focus:outline-none"
            />
            {(filter !== "all" || search) && (
              <button
                onClick={() => {
                  setFilter("all");
                  setSearch("");
                }}
                className="text-xs text-faint hover:text-ink"
              >
                Reset
              </button>
            )}
          </div>

          {isLoading ? (
            <div className="py-12 text-center">
              <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-faint border-t-ink" />
              <p className="mt-3 text-sm text-muted">Loading executive actions...</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="rounded-lg border border-faint bg-ghost p-8 text-center">
              <p className="text-sm text-muted">
                {orders.length === 0
                  ? "No executive actions available yet."
                  : "No actions match your search."}
              </p>
            </div>
          ) : (
            <div className="divide-y divide-faint">
              {filtered.map((order) => (
                <div
                  key={order.id}
                  className="group py-5 first:pt-0 last:pb-0"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0 flex-1 space-y-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <span
                          className={`rounded-full px-2 py-0.5 text-[0.6rem] font-mono ${
                            actionTypeStyles[order.type]
                          }`}
                        >
                          {order.type === "Executive Order" && order.number
                            ? `EO ${order.number}`
                            : order.type.replace("Presidential ", "")}
                        </span>
                        <span className="text-xs text-faint">
                          {formatDate(order.signedDate)}
                        </span>
                      </div>
                      <h3 className="font-medium leading-snug tracking-tight">
                        {order.title}
                      </h3>
                      {order.summary && (
                        <p className="text-sm text-muted line-clamp-2">
                          {order.summary}
                        </p>
                      )}
                      {order.topics.length > 0 && (
                        <div className="flex flex-wrap gap-1 pt-1">
                          {order.topics.slice(0, 3).map((topic) => (
                            <span
                              key={topic}
                              className="rounded bg-ghost px-1.5 py-0.5 text-[0.6rem] text-faint"
                            >
                              {topic}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    {order.federalRegisterUrl && (
                      <a
                        href={order.federalRegisterUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="shrink-0 rounded border border-faint px-3 py-1.5 text-xs text-muted opacity-0 transition-all hover:border-ink hover:text-ink group-hover:opacity-100"
                      >
                        View
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-lg border border-faint p-5">
            <PresidentLocationMap currentLocation="maralago" />
          </div>

          <div className="rounded-lg border border-faint p-5">
            <WhiteHouseSchedule />
          </div>

          {president.xHandle && (
            <div className="space-y-4 rounded-lg border border-faint p-5">
              <div className="flex items-center justify-between">
                <p className="label">X Signal</p>
                <a
                  href={handleUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs text-faint underline hover:text-ink"
                >
                  @{president.xHandle}
                </a>
              </div>
              <XTimeline handle={president.xHandle} height={400} tweetLimit={5} />
            </div>
          )}

          <div className="space-y-4 rounded-lg border border-faint p-5">
            <p className="label">Vice President</p>
            <Link
              href={`/people/${vicePresident.id}`}
              className="block transition-colors hover:text-muted"
            >
              <p className="font-medium">{vicePresident.name}</p>
              <p className="text-xs text-faint">{vicePresident.roleTitle}</p>
            </Link>
          </div>

          <div className="space-y-4 rounded-lg border border-faint p-5">
            <div className="flex items-center justify-between">
              <p className="label">Cabinet</p>
              <span className="text-xs text-faint">{cabinetMembers.length}</span>
            </div>
            <div className="max-h-[280px] space-y-3 overflow-y-auto">
              {cabinetMembers.map((member) => (
                <Link
                  key={member.id}
                  href={`/people/${member.id}`}
                  className="block border-b border-faint pb-3 transition-colors hover:text-muted last:border-0 last:pb-0"
                >
                  <p className="text-sm font-medium">{member.name}</p>
                  <p className="text-xs text-faint">{member.roleTitle}</p>
                </Link>
              ))}
            </div>
          </div>

          <div className="rounded-lg border border-faint bg-ghost p-5">
            <p className="text-xs text-muted">
              Executive actions sourced from the Federal Register. Data updates
              every 30 minutes.
            </p>
          </div>
        </aside>
      </section>
    </div>
  );
}
