

## VoteHub PoliticalTracker

Black-and-white, editorial-grade tracker for Congress, the executive branch, and
live legislation. This scaffold includes directory, profile, bill detail, and
X embed pages with sample data to validate design and UX.

## Getting Started

First, install dependencies and run the development server:

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

Open [http://localhost:3000](http://localhost:3000) with your browser.

## Routes

- `/` home and live snapshot
- `/directory` full member directory (House, Senate, Cabinet, White House)
- `/people/[id]` member profiles with years served, committees, bills, and X embed
- `/bills` bill explorer
- `/bills/[id]` bill detail view
- `/tweets` scrollable X timeline wall

## Data pipeline plan

This scaffold uses placeholder data from `src/lib/data`. The production ingest
pipeline should:

1. Pull members and committees from Congress.gov + GovTrack.
2. Pull bills, actions, and votes from Congress.gov or ProPublica Congress.
3. Normalize to Postgres (Prisma), cache in Redis, and serve via Next.js routes.
4. Refresh via Vercel Cron (members daily, bills 30 min, votes 10 min).

See `docs/pipeline.md` for the detailed ingestion design.

## Live data wiring

This project reads Congress.gov data when `CONGRESS_API_KEY` is present in
`.env.local`. If the key is missing, it falls back to the sample dataset.

To populate member social handles, run:

```bash
npm run sync:socials
```

Executive branch roles live in `src/lib/data/executive.ts` and should be updated
manually.

## X Embed

X timelines load via `platform.twitter.com/widgets.js` and render on demand.
If the widget is blocked, the profile links remain available.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
