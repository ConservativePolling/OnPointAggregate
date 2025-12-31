import type { MemberStatus } from "@/lib/types";

const statusStyles: Record<MemberStatus, string> = {
  active: "border-ink bg-ink text-paper",
  inactive: "border-faint bg-ghost text-muted",
  acting: "border-ink text-ink",
};

interface StatusBadgeProps {
  status: MemberStatus;
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <span
      className={`inline-flex shrink-0 items-center rounded-full border px-2.5 py-1 font-mono text-[0.6rem] uppercase tracking-wide ${statusStyles[status]}`}
    >
      {status}
    </span>
  );
}
