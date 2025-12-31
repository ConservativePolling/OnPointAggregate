"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { Member } from "@/lib/types";
import StatusBadge from "@/components/StatusBadge";
import { formatDate, formatYearsServed } from "@/lib/utils";

const filters = ["All", "House", "Senate", "Cabinet", "White House"] as const;

type FilterType = (typeof filters)[number];

interface MembersDirectoryProps {
  members: Member[];
}

export default function MembersDirectory({ members }: MembersDirectoryProps) {
  const [filter, setFilter] = useState<FilterType>("All");
  const [query, setQuery] = useState("");

  const groupCounts = useMemo(() => {
    const counts: Record<FilterType, number> = {
      All: members.length,
      House: 0,
      Senate: 0,
      Cabinet: 0,
      "White House": 0,
    };

    members.forEach((member) => {
      counts[member.group] += 1;
    });

    return counts;
  }, [members]);

  const filteredMembers = useMemo(() => {
    return members.filter((member) => {
      const matchesGroup = filter === "All" || member.group === filter;
      const matchesQuery =
        query.trim().length === 0 ||
        `${member.name} ${member.state ?? ""} ${member.roleTitle}`
          .toLowerCase()
          .includes(query.toLowerCase());
      return matchesGroup && matchesQuery;
    });
  }, [filter, members, query]);

  return (
    <div className="grid gap-10 lg:grid-cols-[260px_1fr]">
      <aside className="space-y-6">
        <div className="rounded-xl border border-faint bg-paper p-5">
          <p className="label">Filter</p>
          <div className="mt-4 space-y-2">
            {filters.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setFilter(item)}
                className={`flex w-full items-center justify-between rounded-lg border px-3 py-2 text-sm transition ${
                  filter === item
                    ? "border-ink bg-ink text-paper"
                    : "border-faint bg-paper text-ink hover:border-ink"
                }`}
              >
                <span className="font-mono text-xs">{item}</span>
                <span className="font-mono text-xs">
                  {groupCounts[item] ?? 0}
                </span>
              </button>
            ))}
          </div>
        </div>
        <div className="rounded-xl border border-faint bg-paper p-5">
          <p className="label">Search</p>
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Name, role, or state"
            className="mt-4 w-full rounded-xl border border-faint bg-paper px-4 py-2 text-sm focus:border-ink focus:outline-none"
          />
        </div>
        <div className="rounded-xl border border-faint bg-ghost p-5 text-sm text-muted">
          <p className="label label-strong">Coverage</p>
          <p className="mt-3">
            Each record includes terms served, committee lanes, and embedded X
            signals.
          </p>
        </div>
      </aside>
      <div className="space-y-6">
        <div className="text-xs font-mono text-faint">
          Showing {filteredMembers.length} of {members.length} records
        </div>
        <div className="hidden grid-cols-[1.6fr_0.7fr_0.9fr_0.6fr_0.7fr] gap-4 border-b border-faint border-l-2 border-l-transparent pb-3 pl-4 text-[0.7rem] font-mono text-faint lg:grid">
          <div>Name / Role</div>
          <div>Group</div>
          <div>Years / Joined</div>
          <div>Status</div>
          <div>X</div>
        </div>
        <div className="space-y-4">
          {filteredMembers.map((member) => {
            const location = member.state
              ? member.district
                ? `${member.state}-${member.district}`
                : member.state
              : "Executive";
            const yearsServed = formatYearsServed(member.terms);
            const joinedDate = member.terms[0]?.start ?? member.serviceStart;

            return (
              <div
                key={member.id}
                className="grid gap-4 border-b border-faint border-l-2 border-l-ink pb-4 pl-4 lg:grid-cols-[1.6fr_0.7fr_0.9fr_0.6fr_0.7fr]"
              >
                <div>
                  <Link
                    href={`/people/${member.id}`}
                    className="font-display text-xl tracking-tight"
                  >
                    {member.name}
                  </Link>
                  <p className="text-sm text-muted">
                    {member.roleTitle} · {location}
                  </p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {member.focusAreas.slice(0, 2).map((area) => (
                      <span
                        key={area}
                        className="rounded-full border border-faint px-2 py-1 font-mono text-[0.55rem]"
                      >
                        {area}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="text-sm text-muted">{member.group}</div>
                <div className="text-sm text-muted">
                  <div>{yearsServed} yrs</div>
                  {joinedDate ? (
                    <div className="text-xs text-faint">
                      Joined {formatDate(joinedDate)}
                    </div>
                  ) : null}
                </div>
                <div>
                  <StatusBadge status={member.status} />
                </div>
                <div className="text-sm">
                  {member.xHandle ? (
                    <a
                      href={`https://x.com/${member.xHandle}`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-faint transition hover:text-ink"
                    >
                      @{member.xHandle}
                    </a>
                  ) : (
                    <span className="text-faint">—</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
