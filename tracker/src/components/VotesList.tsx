"use client";

import { useState } from "react";
import Link from "next/link";
import type { MemberVote } from "@/lib/types";
import { formatDate } from "@/lib/utils";

interface VotesListProps {
  votes: MemberVote[];
  status: "live" | "unavailable";
}

const votePositionStyles: Record<string, string> = {
  Yes: "border-ink bg-ink text-paper",
  Yea: "border-ink bg-ink text-paper",
  No: "border-ink text-ink",
  Nay: "border-ink text-ink",
  Present: "border-faint text-ink",
  "Not Voting": "border-faint text-faint",
};

const INITIAL_DISPLAY = 15;

export default function VotesList({ votes, status }: VotesListProps) {
  const [showAll, setShowAll] = useState(false);
  const displayedVotes = showAll ? votes : votes.slice(0, INITIAL_DISPLAY);
  const hasMore = votes.length > INITIAL_DISPLAY;
  const voteStatusLabel =
    status === "live" ? "Recent roll calls" : "Vote data pending";

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="label-strong label">Recent votes</p>
          <p className="text-sm text-muted">Roll-call positions on legislation.</p>
        </div>
        <span className="text-xs font-mono text-faint">{voteStatusLabel}</span>
      </div>

      {votes.length === 0 ? (
        <div className="rounded-lg border border-faint bg-ghost p-6 text-center">
          <p className="text-sm text-muted">
            {status === "live"
              ? "No bill votes recorded yet."
              : "Vote data unavailable."}
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-lg border border-faint">
          <div className="hidden border-b border-faint bg-ghost px-4 py-3 text-[0.65rem] font-mono text-faint sm:grid sm:grid-cols-[100px_1fr_80px_80px] sm:gap-3">
            <span>Date</span>
            <span>Bill</span>
            <span>Position</span>
            <span>Result</span>
          </div>
          <div
            className={`divide-y divide-faint overflow-y-auto ${
              showAll ? "max-h-[600px]" : ""
            }`}
          >
            {displayedVotes.map((vote, index) => {
              const billLabel = vote.billNumber || vote.billTitle || "Recorded vote";
              const position = vote.position || "Unknown";
              const votePositionClass =
                votePositionStyles[position] ?? "border-faint text-ink";
              return (
                <div
                  key={`${vote.date}-${vote.billId ?? vote.billNumber}-${index}`}
                  className="grid gap-2 px-4 py-3 sm:grid-cols-[100px_1fr_80px_80px] sm:gap-3"
                >
                  <span className="text-xs text-faint">{formatDate(vote.date)}</span>
                  <div className="min-w-0">
                    {vote.billId ? (
                      <Link
                        href={`/bills/${encodeURIComponent(vote.billId)}`}
                        className="text-sm text-ink underline hover:text-muted"
                      >
                        {billLabel}
                      </Link>
                    ) : vote.url ? (
                      <a
                        href={vote.url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-sm text-ink underline hover:text-muted"
                      >
                        {billLabel}
                      </a>
                    ) : (
                      <p className="text-sm text-ink">{billLabel}</p>
                    )}
                    {vote.description && (
                      <p className="mt-0.5 text-xs text-faint line-clamp-1">
                        {vote.description}
                      </p>
                    )}
                  </div>
                  <span
                    className={`inline-flex h-fit w-fit items-center justify-center border px-2 py-0.5 text-[0.6rem] font-mono ${votePositionClass}`}
                  >
                    {position}
                  </span>
                  <span className="text-xs text-faint">{vote.result}</span>
                </div>
              );
            })}
          </div>
          {hasMore && (
            <div className="border-t border-faint bg-ghost px-4 py-2">
              <button
                onClick={() => setShowAll(!showAll)}
                className="w-full text-center text-xs text-muted hover:text-ink transition-colors"
              >
                {showAll
                  ? "Show less"
                  : `Show all ${votes.length} votes (+${votes.length - INITIAL_DISPLAY} more)`}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
