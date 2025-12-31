"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { Member, MemberGroup } from "@/lib/types";

interface TweetBoardProps {
  members: Member[];
}

type FilterKey = "all" | MemberGroup;

export default function TweetBoard({ members }: TweetBoardProps) {
  const [filter, setFilter] = useState<FilterKey>("all");
  const [search, setSearch] = useState("");

  const withHandles = useMemo(() => members.filter((m) => m.xHandle), [members]);

  const filtered = useMemo(() => {
    let list = withHandles;
    if (filter !== "all") {
      list = list.filter((m) => m.group === filter);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (m) =>
          m.name.toLowerCase().includes(q) ||
          m.xHandle?.toLowerCase().includes(q) ||
          m.state?.toLowerCase().includes(q)
      );
    }
    return list;
  }, [withHandles, filter, search]);

  const groups: FilterKey[] = ["all", "House", "Senate", "Cabinet", "White House"];

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 border-b border-faint pb-4">
        <div className="flex flex-wrap gap-1">
          {groups.map((g) => {
            const label = g === "all" ? "All" : g;
            const c = g === "all" ? withHandles.length : withHandles.filter((m) => m.group === g).length;
            if (c === 0 && g !== "all") return null;
            return (
              <button
                key={g}
                onClick={() => setFilter(g)}
                className={`rounded-full px-3 py-1.5 text-xs transition-colors ${
                  filter === g
                    ? "bg-ink text-paper"
                    : "border border-faint text-muted hover:border-ink hover:text-ink"
                }`}
              >
                {label} {c}
              </button>
            );
          })}
        </div>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search..."
          className="w-40 rounded border border-faint bg-transparent px-3 py-1.5 text-sm placeholder:text-faint focus:border-ink focus:outline-none"
        />
        {(filter !== "all" || search) && (
          <button
            onClick={() => { setFilter("all"); setSearch(""); }}
            className="text-xs text-faint hover:text-ink"
          >
            Reset
          </button>
        )}
      </div>

      {/* Results */}
      {filtered.length === 0 ? (
        <p className="py-8 text-center text-sm text-muted">No officials found</p>
      ) : (
        <div className="divide-y divide-faint">
          {filtered.map((m) => (
            <div key={m.id} className="flex items-center justify-between gap-4 py-3">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <Link href={`/people/${m.id}`} className="font-medium hover:underline">
                    {m.name}
                  </Link>
                  <span className="rounded bg-ghost px-1.5 py-0.5 text-[0.6rem] text-muted">
                    {m.group}
                  </span>
                  <span className="text-xs text-faint">{m.party}</span>
                </div>
                <p className="text-sm text-muted">
                  {m.roleTitle}
                  {m.state && ` · ${m.state}${m.district ? `-${m.district}` : ""}`}
                </p>
              </div>
              <a
                href={`https://x.com/${m.xHandle}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 rounded-full border border-faint px-3 py-1.5 text-xs transition-colors hover:border-ink hover:bg-ink hover:text-paper"
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
                @{m.xHandle}
              </a>
            </div>
          ))}
        </div>
      )}

      <p className="text-center text-xs text-faint">
        Click any handle to view their timeline on X. Individual timelines load on politician detail pages.
      </p>
    </div>
  );
}
