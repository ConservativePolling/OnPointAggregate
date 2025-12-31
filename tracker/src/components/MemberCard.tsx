import Link from "next/link";
import type { Member } from "@/lib/types";
import { formatYearsServed } from "@/lib/utils";
import StatusBadge from "@/components/StatusBadge";

interface MemberCardProps {
  member: Member;
}

export default function MemberCard({ member }: MemberCardProps) {
  const yearsServed = formatYearsServed(member.terms);
  const location = member.state
    ? member.district
      ? `${member.state}-${member.district}`
      : member.state
    : "Executive";

  return (
    <div className="group flex h-full flex-col justify-between rounded-lg border border-faint bg-paper p-5 transition-all duration-200 hover:border-ink/30 hover:shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <p className="label">{member.group}</p>
          <Link
            href={`/people/${member.id}`}
            className="mt-1.5 block font-display text-xl tracking-tight transition-colors group-hover:text-muted"
          >
            {member.name}
          </Link>
          <p className="mt-1 text-sm text-muted">{member.roleTitle}</p>
        </div>
        <StatusBadge status={member.status} />
      </div>
      <div className="mt-5 grid gap-3 border-t border-faint pt-4 text-sm md:grid-cols-3">
        <div>
          <p className="label">Seat</p>
          <p className="mt-1.5 text-ink">{location}</p>
        </div>
        <div>
          <p className="label">Party</p>
          <p className="mt-1.5 text-ink">{member.party}</p>
        </div>
        <div>
          <p className="label">Years</p>
          <p className="mt-1.5 text-ink">{yearsServed}</p>
        </div>
      </div>
      {member.focusAreas.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-1.5">
          {member.focusAreas.slice(0, 3).map((area) => (
            <span
              key={area}
              className="rounded-full bg-ghost px-2.5 py-1 font-mono text-[0.6rem] text-muted"
            >
              {area}
            </span>
          ))}
        </div>
      )}
      <div className="mt-5 flex items-center justify-between border-t border-faint pt-4 text-sm">
        <Link
          href={`/people/${member.id}`}
          className="font-mono text-xs text-faint transition-colors hover:text-ink"
        >
          View dossier →
        </Link>
        {member.xHandle ? (
          <a
            href={`https://x.com/${member.xHandle}`}
            target="_blank"
            rel="noreferrer"
            className="font-mono text-xs text-faint transition-colors hover:text-ink"
          >
            @{member.xHandle}
          </a>
        ) : null}
      </div>
    </div>
  );
}
