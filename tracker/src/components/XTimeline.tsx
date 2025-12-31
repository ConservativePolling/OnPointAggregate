"use client";

interface XTimelineProps {
  handle: string;
  height?: number;
  tweetLimit?: number;
}

// X/Twitter has severely restricted timeline embeds - they only work for logged-in users
// and hit rate limits (429) quickly. Instead, we show a clean link to the profile.
export default function XTimeline({
  handle,
  height = 200,
}: XTimelineProps) {
  const profileUrl = `https://x.com/${handle}`;

  return (
    <div
      className="flex flex-col items-center justify-center gap-4 rounded border border-faint bg-ghost p-6"
      style={{ minHeight: height }}
    >
      <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor" className="text-ink">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
      <div className="text-center">
        <p className="text-sm font-medium">@{handle}</p>
        <p className="mt-1 text-xs text-faint">View posts and updates on X</p>
      </div>
      <a
        href={profileUrl}
        target="_blank"
        rel="noreferrer"
        className="inline-flex items-center gap-2 rounded-lg border border-ink bg-ink px-4 py-2 text-sm font-medium text-paper transition-colors hover:bg-transparent hover:text-ink"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
        Open on X
      </a>
    </div>
  );
}
