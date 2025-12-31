export default function HomeLoading() {
  return (
    <div className="space-y-24">
      <section className="grid items-start gap-12 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-8">
          <div className="space-y-6">
            <div className="h-3 w-40 animate-pulse rounded bg-faint/30" />
            <div className="h-14 w-full max-w-2xl animate-pulse rounded bg-faint/30" />
            <div className="h-14 w-3/4 max-w-2xl animate-pulse rounded bg-faint/30" />
            <div className="h-6 w-full max-w-xl animate-pulse rounded bg-faint/20" />
          </div>
          <div className="flex flex-wrap gap-4">
            <div className="h-12 w-32 animate-pulse rounded-lg bg-faint/30" />
            <div className="h-12 w-32 animate-pulse rounded-lg bg-faint/20" />
          </div>
        </div>
        <div className="space-y-4 rounded-xl border border-faint p-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex justify-between border-b border-faint pb-4 last:border-0 last:pb-0">
              <div className="h-5 w-20 animate-pulse rounded bg-faint/30" />
              <div className="h-5 w-12 animate-pulse rounded bg-faint/30" />
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-8">
        <div className="flex items-center justify-between">
          <div className="h-8 w-48 animate-pulse rounded bg-faint/30" />
          <div className="h-4 w-24 animate-pulse rounded bg-faint/20" />
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="rounded-xl border border-faint p-6">
              <div className="flex items-start gap-4">
                <div className="h-12 w-12 animate-pulse rounded-full bg-faint/30" />
                <div className="flex-1 space-y-2">
                  <div className="h-5 w-32 animate-pulse rounded bg-faint/30" />
                  <div className="h-4 w-24 animate-pulse rounded bg-faint/20" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-8">
        <div className="h-8 w-48 animate-pulse rounded bg-faint/30" />
        <div className="space-y-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="rounded-xl border border-faint p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 space-y-3">
                  <div className="h-4 w-24 animate-pulse rounded bg-faint/30" />
                  <div className="h-6 w-3/4 animate-pulse rounded bg-faint/30" />
                </div>
                <div className="h-6 w-20 animate-pulse rounded-full bg-faint/30" />
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
