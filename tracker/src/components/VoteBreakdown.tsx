"use client";

import { useState } from "react";
import Link from "next/link";
import type { DetailedRollCall, RollCallMemberVote } from "@/lib/types";
import { formatDate } from "@/lib/utils";

interface VoteBreakdownProps {
  rollCall: DetailedRollCall;
}

export default function VoteBreakdown({ rollCall }: VoteBreakdownProps) {
  const [showAllYea, setShowAllYea] = useState(false);
  const [showAllNay, setShowAllNay] = useState(false);

  const yeaVotes = rollCall.votes.filter((v) => v.position === "Yea");
  const nayVotes = rollCall.votes.filter((v) => v.position === "Nay");
  const notVotingVotes = rollCall.votes.filter(
    (v) => v.position === "Not Voting" || v.position === "Present"
  );

  const passed =
    rollCall.result.toLowerCase().includes("pass") ||
    rollCall.result.toLowerCase().includes("agreed") ||
    rollCall.totals.yea > rollCall.totals.nay;

  const total = rollCall.totals.yea + rollCall.totals.nay;
  const yeaPercent = total > 0 ? (rollCall.totals.yea / total) * 100 : 50;

  // Party breakdowns
  const getPartyBreakdown = (votes: RollCallMemberVote[]) => ({
    D: votes.filter((v) => v.party === "D"),
    R: votes.filter((v) => v.party === "R"),
    I: votes.filter((v) => v.party === "I" || v.party === "Nonpartisan"),
  });

  const yeaByParty = getPartyBreakdown(yeaVotes);
  const nayByParty = getPartyBreakdown(nayVotes);

  const sortVotes = (votes: RollCallMemberVote[]) =>
    [...votes].sort((a, b) => {
      const po: Record<string, number> = { D: 0, I: 1, R: 2 };
      return (po[a.party] ?? 1) - (po[b.party] ?? 1) || a.memberName.localeCompare(b.memberName);
    });

  const displayYea = showAllYea ? sortVotes(yeaVotes) : sortVotes(yeaVotes).slice(0, 8);
  const displayNay = showAllNay ? sortVotes(nayVotes) : sortVotes(nayVotes).slice(0, 8);

  return (
    <div className="border border-faint bg-paper">
      {/* Header bar */}
      <div className={`px-4 py-2 border-b border-faint flex items-center justify-between ${
        passed ? "bg-emerald-50" : "bg-red-50"
      }`}>
        <div className="flex items-center gap-2">
          <span className={`inline-block w-2 h-2 rounded-full ${passed ? "bg-emerald-500" : "bg-red-500"}`} />
          <span className="text-xs font-medium uppercase tracking-wider">
            {rollCall.chamber} Roll Call #{rollCall.rollCall}
          </span>
        </div>
        <span className={`text-xs font-medium ${passed ? "text-emerald-700" : "text-red-700"}`}>
          {passed ? "Passed" : "Failed"}
        </span>
      </div>

      {/* Main content */}
      <div className="p-4">
        {/* Question */}
        <p className="text-sm leading-relaxed">{rollCall.question}</p>
        <p className="mt-1 text-xs text-faint">{formatDate(rollCall.date)}</p>

        {/* Vote display - split design */}
        <div className="mt-6 grid grid-cols-2 gap-px bg-faint">
          {/* Yea side */}
          <div className="bg-paper p-4">
            <div className="text-center">
              <div className="text-4xl font-display tracking-tight">{rollCall.totals.yea}</div>
              <div className="mt-1 text-xs uppercase tracking-widest text-muted">Yea</div>
            </div>

            {/* Party breakdown */}
            <div className="mt-4 flex justify-center gap-3">
              {yeaByParty.D.length > 0 && (
                <div className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
                  <span className="text-xs tabular-nums">{yeaByParty.D.length}</span>
                </div>
              )}
              {yeaByParty.R.length > 0 && (
                <div className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-600" />
                  <span className="text-xs tabular-nums">{yeaByParty.R.length}</span>
                </div>
              )}
              {yeaByParty.I.length > 0 && (
                <div className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-600" />
                  <span className="text-xs tabular-nums">{yeaByParty.I.length}</span>
                </div>
              )}
            </div>

            {/* Member names */}
            <div className="mt-4 pt-4 border-t border-faint">
              <div className="space-y-0.5">
                {displayYea.map((v) => (
                  <Link
                    key={v.memberId}
                    href={`/people/${v.memberId}`}
                    className="flex items-center gap-1.5 py-0.5 text-xs hover:bg-ghost -mx-1 px-1 rounded transition-colors"
                  >
                    <span className={`w-1 h-1 rounded-full flex-shrink-0 ${
                      v.party === "D" ? "bg-blue-600" : v.party === "R" ? "bg-red-600" : "bg-purple-600"
                    }`} />
                    <span className="truncate">{v.memberName}</span>
                    <span className="text-faint ml-auto flex-shrink-0">{v.state}</span>
                  </Link>
                ))}
              </div>
              {yeaVotes.length > 8 && (
                <button
                  type="button"
                  onClick={() => setShowAllYea(!showAllYea)}
                  className="mt-2 text-xs text-muted hover:text-ink transition-colors"
                >
                  {showAllYea ? "Show less" : `+${yeaVotes.length - 8} more`}
                </button>
              )}
            </div>
          </div>

          {/* Nay side */}
          <div className="bg-paper p-4">
            <div className="text-center">
              <div className="text-4xl font-display tracking-tight text-muted">{rollCall.totals.nay}</div>
              <div className="mt-1 text-xs uppercase tracking-widest text-muted">Nay</div>
            </div>

            {/* Party breakdown */}
            <div className="mt-4 flex justify-center gap-3">
              {nayByParty.D.length > 0 && (
                <div className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
                  <span className="text-xs tabular-nums">{nayByParty.D.length}</span>
                </div>
              )}
              {nayByParty.R.length > 0 && (
                <div className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-600" />
                  <span className="text-xs tabular-nums">{nayByParty.R.length}</span>
                </div>
              )}
              {nayByParty.I.length > 0 && (
                <div className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-600" />
                  <span className="text-xs tabular-nums">{nayByParty.I.length}</span>
                </div>
              )}
            </div>

            {/* Member names */}
            <div className="mt-4 pt-4 border-t border-faint">
              <div className="space-y-0.5">
                {displayNay.map((v) => (
                  <Link
                    key={v.memberId}
                    href={`/people/${v.memberId}`}
                    className="flex items-center gap-1.5 py-0.5 text-xs hover:bg-ghost -mx-1 px-1 rounded transition-colors"
                  >
                    <span className={`w-1 h-1 rounded-full flex-shrink-0 ${
                      v.party === "D" ? "bg-blue-600" : v.party === "R" ? "bg-red-600" : "bg-purple-600"
                    }`} />
                    <span className="truncate">{v.memberName}</span>
                    <span className="text-faint ml-auto flex-shrink-0">{v.state}</span>
                  </Link>
                ))}
              </div>
              {nayVotes.length > 8 && (
                <button
                  type="button"
                  onClick={() => setShowAllNay(!showAllNay)}
                  className="mt-2 text-xs text-muted hover:text-ink transition-colors"
                >
                  {showAllNay ? "Show less" : `+${nayVotes.length - 8} more`}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Vote bar */}
        <div className="mt-4 relative">
          <div className="flex h-2 overflow-hidden">
            <div
              className="bg-ink transition-all duration-500"
              style={{ width: `${yeaPercent}%` }}
            />
            <div
              className="bg-ink/10 transition-all duration-500"
              style={{ width: `${100 - yeaPercent}%` }}
            />
          </div>
          <div className="mt-1 flex justify-between text-[10px] text-faint tabular-nums">
            <span>{Math.round(yeaPercent)}%</span>
            <span>{Math.round(100 - yeaPercent)}%</span>
          </div>
        </div>

        {/* Not voting footer */}
        {notVotingVotes.length > 0 && (
          <div className="mt-4 pt-3 border-t border-faint">
            <details className="group">
              <summary className="text-xs text-faint cursor-pointer hover:text-muted transition-colors list-none flex items-center gap-1">
                <svg
                  className="w-3 h-3 transition-transform group-open:rotate-90"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
                {notVotingVotes.length} not voting
              </summary>
              <div className="mt-2 text-xs text-muted leading-relaxed">
                {notVotingVotes
                  .sort((a, b) => a.memberName.localeCompare(b.memberName))
                  .map((v, i) => (
                    <span key={v.memberId}>
                      <Link
                        href={`/people/${v.memberId}`}
                        className="hover:text-ink transition-colors"
                      >
                        {v.memberName}
                      </Link>
                      <span className="text-faint"> ({v.state})</span>
                      {i < notVotingVotes.length - 1 && ", "}
                    </span>
                  ))}
              </div>
            </details>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="px-4 py-2 border-t border-faint bg-ghost/50 flex items-center justify-between">
        <span className="text-[10px] text-faint">
          Source: {rollCall.chamber === "Senate" ? "senate.gov" : "clerk.house.gov"}
        </span>
        <div className="flex items-center gap-3 text-[10px] text-faint">
          <span className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-600" /> D
          </span>
          <span className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-red-600" /> R
          </span>
          <span className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-purple-600" /> I
          </span>
        </div>
      </div>
    </div>
  );
}
