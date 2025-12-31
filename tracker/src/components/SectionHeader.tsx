interface SectionHeaderProps {
  title: string;
  subtitle?: string;
}

export default function SectionHeader({ title, subtitle }: SectionHeaderProps) {
  return (
    <div>
      <p className="label label-strong">{title}</p>
      {subtitle ? (
        <h2 className="mt-2 font-display text-3xl tracking-tight md:text-4xl">
          {subtitle}
        </h2>
      ) : null}
    </div>
  );
}
