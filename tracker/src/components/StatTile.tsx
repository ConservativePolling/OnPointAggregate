interface StatTileProps {
  label: string;
  value: string;
  hint?: string;
}

export default function StatTile({ label, value, hint }: StatTileProps) {
  return (
    <div className="rounded-xl border border-faint bg-paper p-6">
      <p className="label">{label}</p>
      <p className="mt-4 font-display text-3xl tracking-tight md:text-4xl">
        {value}
      </p>
      {hint ? <p className="mt-2 text-sm text-muted">{hint}</p> : null}
    </div>
  );
}
