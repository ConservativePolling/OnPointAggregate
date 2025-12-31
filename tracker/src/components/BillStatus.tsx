import type { BillStatus as BillStatusType } from "@/lib/types";

const statusStyles: Record<BillStatusType, string> = {
  Introduced: "border-faint bg-ghost text-muted",
  "In Committee": "border-ink/50 text-ink",
  Reported: "border-ink bg-ink text-paper",
  "Passed House": "border-ink bg-ink text-paper",
  "Passed Senate": "border-ink bg-ink text-paper",
  "To President": "border-ink text-ink",
  Signed: "border-ink bg-ink text-paper",
  Vetoed: "border-ink text-ink",
};

interface BillStatusProps {
  status: BillStatusType;
}

export default function BillStatus({ status }: BillStatusProps) {
  return (
    <span
      className={`inline-flex shrink-0 items-center whitespace-nowrap rounded-full border px-2.5 py-1 font-mono text-[0.6rem] ${statusStyles[status]}`}
    >
      {status}
    </span>
  );
}
