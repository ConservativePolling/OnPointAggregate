import Link from "next/link";
import type { Bill } from "@/lib/types";
import BillStatus from "@/components/BillStatus";
import { formatDate } from "@/lib/utils";

interface BillCardProps {
  bill: Bill;
}

export default function BillCard({ bill }: BillCardProps) {
  return (
    <div className="group rounded-lg border border-faint bg-paper p-5 transition-all duration-200 hover:border-ink/30 hover:shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <p className="label">{bill.number}</p>
          <Link
            href={`/bills/${bill.id}`}
            className="mt-1.5 block font-display text-lg tracking-tight transition-colors group-hover:text-muted"
          >
            {bill.title}
          </Link>
          {bill.summary && (
            <p className="mt-2 line-clamp-2 text-sm text-muted">{bill.summary}</p>
          )}
        </div>
        <BillStatus status={bill.status} />
      </div>
      <div className="mt-4 flex flex-wrap items-center gap-3 border-t border-faint pt-4 text-xs text-faint">
        <span className="font-mono">{formatDate(bill.introducedDate)}</span>
        <span className="hidden sm:inline">·</span>
        <span className="line-clamp-1">{bill.lastAction}</span>
      </div>
    </div>
  );
}
