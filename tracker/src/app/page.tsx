import Link from "next/link";
import SectionHeader from "@/components/SectionHeader";
import StatusBadge from "@/components/StatusBadge";
import {
  filterMembersByGroup,
  getLiveBills,
  getLiveMembers,
  pickFeaturedMembers,
} from "@/lib/data/live";
import { formatDate, formatYearsServed } from "@/lib/utils";

const indexRows = [
  {
    label: "House",
    value: "435",
    note: "Voting seats",
  },
  {
    label: "Senate",
    value: "100",
    note: "Class I-III",
  },
  {
    label: "Cabinet",
    value: "15",
    note: "Executive departments",
  },
  {
    label: "White House",
    value: "2",
    note: "President + VP",
  },
];

export default async function Home() {
  const [members, bills] = await Promise.all([
    getLiveMembers(),
    getLiveBills(),
  ]);
  const houseCount = filterMembersByGroup(members, "House").length;
  const senateCount = filterMembersByGroup(members, "Senate").length;
  const cabinetCount = filterMembersByGroup(members, "Cabinet").length;
  const whiteHouseCount = filterMembersByGroup(members, "White House").length;

  const summaryStats = [
    {
      label: "Tracked seats",
      value: `${members.length}`,
      note: `House ${houseCount} · Senate ${senateCount}`,
    },
    {
      label: "Executive desks",
      value: `${cabinetCount + whiteHouseCount}`,
      note: `Cabinet ${cabinetCount} · White House ${whiteHouseCount}`,
    },
    {
      label: "Active bills",
      value: `${bills.length}`,
      note: "Current session",
    },
  ];

  const featuredBill = bills[0];
  const docketBills = bills.slice(1, 4);
  const roster = pickFeaturedMembers(members, 3);
  const signals = members.filter((member) => member.xHandle).slice(0, 4);

  return (
    <div className="space-y-24">
      <section className="grid items-start gap-12 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-8">
          <div className="space-y-6">
            <p className="label">Congressional intelligence desk</p>
            <h1 className="max-w-2xl font-display text-5xl leading-[1.05] tracking-tight md:text-6xl">
              The live ledger for Congress, the cabinet, and the movement of law.
            </h1>
            <p className="max-w-xl text-lg text-muted">
              OnPointTracker consolidates members, executive desks, and
              bill movement into a single oversight view built for daily use.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/directory"
              className="rounded-full border border-ink bg-ink px-5 py-2.5 text-xs font-mono text-paper transition-all duration-200 hover:bg-transparent hover:text-ink"
            >
              Browse members
            </Link>
            <Link
              href="/bills"
              className="rounded-full border border-faint px-5 py-2.5 text-xs font-mono transition-all duration-200 hover:border-ink hover:bg-ghost"
            >
              View legislation
            </Link>
          </div>
        </div>

        <aside className="rounded-lg border border-faint p-6">
          <div className="flex items-center justify-between">
            <p className="label">Session index</p>
            <p className="font-mono text-xs text-faint">119th Congress</p>
          </div>
          <div className="mt-6 divide-y divide-faint">
            {indexRows.map((row) => (
              <div
                key={row.label}
                className="flex items-start justify-between py-4"
              >
                <div>
                  <p className="text-sm text-muted">{row.label}</p>
                  <p className="label mt-2">{row.note}</p>
                </div>
                <p className="font-display text-3xl text-ink">{row.value}</p>
              </div>
            ))}
          </div>
        </aside>
      </section>

      <section className="grid gap-6 border-t border-faint pt-8 md:grid-cols-3">
        {summaryStats.map((stat) => (
          <div key={stat.label}>
            <p className="label">{stat.label}</p>
            <p className="mt-2 font-display text-3xl text-ink">
              {stat.value}
            </p>
            <p className="mt-2 text-xs text-faint">{stat.note}</p>
          </div>
        ))}
      </section>

      <section className="grid gap-12 border-t border-faint pt-12 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-6">
          <SectionHeader title="Lead bill" subtitle="Primary legislation in focus." />
          {featuredBill ? (
            <div className="rounded-lg border border-faint p-6">
              <p className="label">{featuredBill.number}</p>
              <p className="mt-3 font-display text-3xl tracking-tight">
                {featuredBill.title}
              </p>
              <p className="mt-3 text-sm text-muted">{featuredBill.summary}</p>
              <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-faint">
                <span className="font-mono">
                  {formatDate(featuredBill.introducedDate)}
                </span>
                <span>Status: {featuredBill.status}</span>
              </div>
              <Link
                href={`/bills/${featuredBill.id}`}
                className="mt-4 inline-flex text-sm underline"
              >
                Open bill
              </Link>
            </div>
          ) : null}
        </div>

        <div className="space-y-6">
          <SectionHeader title="Docket" subtitle="Recent bill actions." />
          <div className="divide-y divide-faint border-y border-faint">
            {docketBills.map((bill) => (
              <Link
                key={bill.id}
                href={`/bills/${bill.id}`}
                className="group block py-4 transition-colors"
              >
                <p className="label">{bill.number}</p>
                <p className="mt-2 font-display text-xl tracking-tight transition-colors group-hover:text-muted">
                  {bill.title}
                </p>
                <p className="mt-2 text-sm text-muted">{bill.lastAction}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="space-y-8 border-t border-faint pt-12">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeader title="Roster" subtitle="Key desks across chambers." />
          <Link href="/directory" className="text-sm underline">
            Open full directory
          </Link>
        </div>
        <div className="divide-y divide-faint border-y border-faint">
          {roster.map((member) => {
            const location = member.state
              ? member.district
                ? `${member.state}-${member.district}`
                : member.state
              : "Executive";
            const yearsServed = formatYearsServed(member.terms);

            return (
              <Link
                key={member.id}
                href={`/people/${member.id}`}
                className="group grid gap-4 py-4 transition-colors md:grid-cols-[1.4fr_0.7fr_0.6fr_0.6fr]"
              >
                <div>
                  <span className="font-display text-2xl tracking-tight transition-colors group-hover:text-muted">
                    {member.name}
                  </span>
                  <p className="text-sm text-muted">
                    {member.roleTitle} · {location}
                  </p>
                </div>
                <div className="text-sm text-muted">{member.group}</div>
                <div className="text-sm text-muted">{yearsServed} yrs</div>
                <div>
                  <StatusBadge status={member.status} />
                </div>
              </Link>
            );
          })}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {signals.map((member) => (
            <a
              key={member.id}
              href={`https://x.com/${member.xHandle}`}
              target="_blank"
              rel="noreferrer"
              className="rounded-full border border-faint px-3 py-1.5 text-xs font-mono text-faint transition-all duration-200 hover:border-ink hover:bg-ghost hover:text-ink"
            >
              @{member.xHandle}
            </a>
          ))}
          <Link
            href="/tweets"
            className="ml-2 text-sm text-faint transition-colors hover:text-ink"
          >
            Open X Signal Board →
          </Link>
        </div>
      </section>
    </div>
  );
}
