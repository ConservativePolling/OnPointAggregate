"use client";

import { useState } from "react";
import useSWR from "swr";
import type { BillVote, DetailedRollCall } from "@/lib/types";
import VoteBreakdown from "@/components/VoteBreakdown";
import { formatDate } from "@/lib/utils";

interface BillVotesSectionProps {
  votes: BillVote[];
  congress?: string;
}

const fetcher = async (url: string) => {
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch");
  return res.json();
};

function VoteCard({
  vote,
  congress,
}: {
  vote: BillVote;
  congress?: string;
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [rollCallId, setRollCallId] = useState<string | null>(null);

  const isPassed =
    vote.result.toLowerCase().includes("passed") ||
    vote.result.toLowerCase().includes("agreed");
  const total = vote.yeas + vote.nays;
  const yeaPercent = total > 0 ? (vote.yeas / total) * 100 : 50;

  const voteYear = vote.date ? new Date(vote.date).getFullYear().toString() : "2025";
  const session = congress || "119";

  const { data, isLoading } = useSWR(
    isExpanded && rollCallId
      ? `/api/rollcall/${vote.chamber.toLowerCase()}/${voteYear}/${rollCallId}`
      : null,
    fetcher,
    { revalidateOnFocus: false }
  );

  const rollCall = data?.rollCall as DetailedRollCall | undefined;

  return (
    <div className="py-4 border-b border-faint last:border-0">
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full text-left"
      >
        {/* Result line */}
        <p className="text-sm">
          {isPassed ? "Passed" : "Failed"}{" "}
          <span className="font-medium">{vote.yeas}–{vote.nays}</span>
          <span className="text-faint"> · {vote.chamber} · {formatDate(vote.date)}</span>
        </p>

        {/* Simple bar */}
        <div className="mt-3 flex items-center gap-3">
          <div className="flex-1 h-1.5 flex">
            <div className="bg-ink" style={{ width: `${yeaPercent}%` }} />
            <div className="bg-ink/20" style={{ width: `${100 - yeaPercent}%` }} />
          </div>
          <span className="text-xs text-muted">{Math.round(yeaPercent)}%</span>
        </div>
      </button>

      {isExpanded && (
        <div className="mt-4 pt-4 border-t border-faint">
          {!rollCallId ? (
            <div className="space-y-3">
              <p className="text-sm text-muted">
                Enter roll call number to see how each member voted:
              </p>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder={vote.chamber === "House" ? "e.g., 123" : "e.g., 00123"}
                  className="flex-1 border-b border-faint bg-transparent py-2 text-sm placeholder:text-faint focus:border-ink focus:outline-none"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      const input = e.currentTarget.value.trim();
                      if (input) setRollCallId(input);
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={(e) => {
                    const input = (
                      e.currentTarget.previousSibling as HTMLInputElement
                    )?.value?.trim();
                    if (input) setRollCallId(input);
                  }}
                  className="text-sm text-muted hover:text-ink transition-colors"
                >
                  Load →
                </button>
              </div>
              <p className="text-xs text-faint">
                Find roll call numbers at{" "}
                <a
                  href={
                    vote.chamber === "House"
                      ? `https://clerk.house.gov/evs/${voteYear}`
                      : `https://www.senate.gov/legislative/LIS/roll_call_lists/vote_menu_${session}_1.htm`
                  }
                  target="_blank"
                  rel="noreferrer"
                  className="underline hover:text-muted"
                >
                  {vote.chamber === "House" ? "clerk.house.gov" : "senate.gov"}
                </a>
              </p>
            </div>
          ) : isLoading ? (
            <p className="py-8 text-center text-sm text-muted">Loading...</p>
          ) : rollCall ? (
            <VoteBreakdown rollCall={rollCall} />
          ) : (
            <div className="py-6 text-center">
              <p className="text-sm text-muted">Roll call not found</p>
              <button
                type="button"
                onClick={() => setRollCallId(null)}
                className="mt-2 text-xs text-faint hover:text-muted"
              >
                Try again →
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function BillVotesSection({
  votes,
  congress,
}: BillVotesSectionProps) {
  if (votes.length === 0) {
    return (
      <div className="rounded-lg border border-faint p-5">
        <p className="label">Roll call votes</p>
        <p className="mt-3 text-sm text-muted">No recorded votes yet.</p>
        <p className="mt-2 font-mono text-xs text-faint">
          Votes appear after floor action.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="label">Roll call votes</p>
        <span className="font-mono text-xs text-faint">
          {votes.length}
        </span>
      </div>
      <div className="rounded-lg border border-faint">
        {votes.map((vote, index) => (
          <VoteCard
            key={`${vote.date}-${vote.chamber}-${index}`}
            vote={vote}
            congress={congress}
          />
        ))}
      </div>
      <p className="font-mono text-xs text-faint">
        Click to expand and view member votes.
      </p>
    </div>
  );
}
