import type { ServiceTerm } from "@/lib/types";
import { formatDate } from "@/lib/utils";

interface RoleTimelineProps {
  terms: ServiceTerm[];
}

export default function RoleTimeline({ terms }: RoleTimelineProps) {
  return (
    <div className="space-y-4">
      {terms.map((term) => (
        <div key={`${term.office}-${term.start}`} className="flex gap-4">
          <div className="mt-1 h-2 w-2 rounded-full bg-ink" />
          <div>
            <p className="label">{term.office}</p>
            <p className="text-sm text-ink">
              {formatDate(term.start)} - {term.end ? formatDate(term.end) : "Present"}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
