"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { label: "President", href: "/president" },
  { label: "SCOTUS", href: "/scotus" },
  { label: "Directory", href: "/directory" },
  { label: "Bills", href: "/bills" },
  { label: "Votes", href: "/votes" },
  { label: "X Signal", href: "/tweets" },
];

export default function SiteHeader() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-faint bg-paper/90 backdrop-blur-md">
      <div className="mx-auto flex w-full max-w-5xl items-center justify-between px-6 py-4">
        <Link href="/" className="group flex items-center gap-3 transition-opacity hover:opacity-70">
          <div className="flex h-9 w-9 items-center justify-center rounded-full border border-ink text-sm font-semibold transition-colors group-hover:bg-ink group-hover:text-paper">
            OP
          </div>
          <div className="leading-tight">
            <p className="font-display text-base tracking-tight">OnPoint</p>
            <p className="font-mono text-[0.65rem] text-faint">Tracker</p>
          </div>
        </Link>
        <nav className="flex items-center gap-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-full px-3.5 py-1.5 text-xs font-mono transition-colors ${
                  isActive
                    ? "bg-ink text-paper"
                    : "text-faint hover:bg-ghost hover:text-ink"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
