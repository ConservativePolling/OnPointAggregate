"use client";

import { useState } from "react";
import Link from "next/link";
import useSWR from "swr";
import VoteBreakdown from "@/components/VoteBreakdown";
import type { DetailedRollCall } from "@/lib/types";

const fetcher = async (url: string) => {
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch");
  return res.json();
};

const currentYear = new Date().getFullYear();
const years = Array.from({ length: 10 }, (_, i) => String(currentYear - i));

export default function VotesPage() {
  const [chamber, setChamber] = useState<"house" | "senate">("house");
  const [year, setYear] = useState(String(currentYear));
  const [rollNumber, setRollNumber] = useState("");
  const [searchedRoll, setSearchedRoll] = useState<string | null>(null);

  // For Senate, we need congress-session format
  const congressFromYear = Math.floor((parseInt(year) - 1789) / 2) + 1;
  const session = parseInt(year) % 2 === 1 ? "1" : "2";
  const senateParam = `${congressFromYear}-${session}`;

  const { data, error, isLoading } = useSWR(
    searchedRoll
      ? `/api/rollcall/${chamber}/${chamber === "senate" ? senateParam : year}/${searchedRoll}`
      : null,
    fetcher,
    { revalidateOnFocus: false }
  );

  const rollCall = data?.rollCall as DetailedRollCall | undefined;

  const handleSearch = () => {
    if (rollNumber.trim()) {
      setSearchedRoll(rollNumber.trim().padStart(chamber === "senate" ? 5 : 1, "0"));
    }
  };

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-center gap-3 text-xs font-mono text-faint">
          <Link href="/" className="transition-colors hover:text-ink">
            Home
          </Link>
          <span>/</span>
          <span className="text-ink">Roll Call Votes</span>
        </div>
        <h1 className="font-display text-4xl tracking-tight">Roll Call Votes</h1>
        <p className="max-w-2xl text-muted">
          View detailed voting records for any House or Senate roll call vote.
          See how each member voted with party breakdowns.
        </p>
      </div>

      {/* Search Form */}
      <div className="rounded-lg border border-faint p-6">
        <p className="label">Look up a roll call</p>
        <div className="mt-4 flex flex-wrap gap-3">
          {/* Chamber Toggle */}
          <div className="flex rounded-full border border-faint p-0.5">
            <button
              type="button"
              onClick={() => {
                setChamber("house");
                setSearchedRoll(null);
              }}
              className={`rounded-full px-4 py-1.5 font-mono text-xs transition-all ${
                chamber === "house"
                  ? "bg-ink text-paper"
                  : "text-muted hover:text-ink"
              }`}
            >
              House
            </button>
            <button
              type="button"
              onClick={() => {
                setChamber("senate");
                setSearchedRoll(null);
              }}
              className={`rounded-full px-4 py-1.5 font-mono text-xs transition-all ${
                chamber === "senate"
                  ? "bg-ink text-paper"
                  : "text-muted hover:text-ink"
              }`}
            >
              Senate
            </button>
          </div>

          {/* Year Select */}
          <select
            value={year}
            onChange={(e) => {
              setYear(e.target.value);
              setSearchedRoll(null);
            }}
            className="rounded-full border border-faint bg-transparent px-4 py-2 font-mono text-xs focus:border-ink focus:outline-none"
          >
            {years.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>

          {/* Roll Number Input */}
          <div className="flex flex-1 gap-2">
            <input
              type="text"
              value={rollNumber}
              onChange={(e) => setRollNumber(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              placeholder={chamber === "house" ? "e.g., 123" : "e.g., 00123"}
              className="flex-1 min-w-[140px] rounded-full border border-faint bg-transparent px-4 py-2 text-sm placeholder:text-faint focus:border-ink focus:outline-none"
            />
            <button
              type="button"
              onClick={handleSearch}
              disabled={!rollNumber.trim()}
              className="rounded-full bg-ink px-5 py-2 text-sm text-paper transition-colors hover:bg-ink/80 disabled:opacity-50"
            >
              Look Up
            </button>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-4 font-mono text-xs text-faint">
          <span>Find roll calls:</span>
          <a
            href={`https://clerk.house.gov/evs/${year}`}
            target="_blank"
            rel="noreferrer"
            className="underline hover:text-ink"
          >
            clerk.house.gov →
          </a>
          <a
            href={`https://www.senate.gov/legislative/LIS/roll_call_lists/vote_menu_${congressFromYear}_${session}.htm`}
            target="_blank"
            rel="noreferrer"
            className="underline hover:text-ink"
          >
            senate.gov →
          </a>
        </div>
      </div>

      {/* Results */}
      {searchedRoll && (
        <div className="space-y-6">
          {isLoading ? (
            <div className="flex items-center justify-center py-16">
              <div className="flex items-center gap-3 font-mono text-sm text-muted">
                <div className="h-3 w-3 animate-spin rounded-full border border-faint border-t-ink" />
                Loading...
              </div>
            </div>
          ) : error ? (
            <div className="rounded-lg border border-faint p-8 text-center">
              <p className="text-muted">Failed to load roll call</p>
              <p className="mt-2 font-mono text-xs text-faint">
                The roll call may not exist or there was a network error.
              </p>
            </div>
          ) : rollCall ? (
            <div className="rounded-lg border border-faint p-6">
              <VoteBreakdown rollCall={rollCall} />
            </div>
          ) : (
            <div className="rounded-lg border border-faint p-8 text-center">
              <p className="text-muted">Roll call not found</p>
              <p className="mt-2 font-mono text-xs text-faint">
                Check the number and try again.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Help Text */}
      {!searchedRoll && (
        <div className="rounded-lg border border-dashed border-faint p-12 text-center">
          <p className="text-muted">Enter a roll call number above</p>
          <p className="mt-2 font-mono text-xs text-faint">
            View how each member voted with party breakdowns
          </p>
        </div>
      )}
    </div>
  );
}
