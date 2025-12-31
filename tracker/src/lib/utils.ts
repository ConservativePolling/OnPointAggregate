import type { ServiceTerm } from "@/lib/types";

export function formatYearsServed(terms: ServiceTerm[]): string {
  const years = totalYearsServed(terms);
  return years < 1 ? "<1" : years.toFixed(1);
}

export function totalYearsServed(terms: ServiceTerm[]): number {
  const totalMs = terms.reduce((acc, term) => {
    const start = new Date(term.start).getTime();
    const end = term.end ? new Date(term.end).getTime() : Date.now();
    if (Number.isNaN(start) || Number.isNaN(end)) return acc;
    return acc + Math.max(end - start, 0);
  }, 0);

  const years = totalMs / (1000 * 60 * 60 * 24 * 365.25);
  return Math.round(years * 10) / 10;
}

export function formatDate(date: string): string {
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return date;
  return parsed.toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });
}

export function formatShortDate(date: string | undefined): string {
  if (!date) return "";
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return date;
  return parsed.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

export function formatLongDate(date: string | undefined): string {
  if (!date) return "";
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return date;
  return parsed.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}
