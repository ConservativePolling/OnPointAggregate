export default function SiteFooter() {
  return (
    <footer className="border-t border-faint bg-paper/90">
      <div className="mx-auto grid w-full max-w-5xl gap-6 px-6 py-10 text-sm text-faint md:grid-cols-3">
        <div>
          <p className="font-display text-base text-ink">Data Integrity</p>
          <p className="mt-2">
            UI scaffolding ships with sample data. Production builds should
            connect to Congress.gov, GovTrack, or ProPublica Congress APIs.
          </p>
        </div>
        <div>
          <p className="font-display text-base text-ink">Refresh Cadence</p>
          <p className="mt-2">
            Planned ingest cadence: members daily, bills every 30 minutes, votes
            every 10 minutes.
          </p>
        </div>
        <div>
          <p className="font-display text-base text-ink">Embed Policy</p>
          <p className="mt-2">
            X timelines load on demand and honor X embed settings. Links fallback
            if widgets are blocked.
          </p>
        </div>
      </div>
    </footer>
  );
}
