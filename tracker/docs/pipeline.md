# Data Pipeline Plan

## Sources

- Congress.gov API: members, bills, actions, latest status.
- GovTrack: additional metadata, topics, historical terms.
- ProPublica Congress API: votes, roll calls, member vote breakdowns.
- UnitedStates/congress-legislators: social handles + official websites.

## Ingest Flow

1. **Members**
   - Nightly sync to pull members, leadership, and term history.
   - Normalize party, district, and current status.
   - Merge social handles by bioguide ID.
2. **Bills**
   - 30-minute sync by last action date to reduce load.
   - Normalize bill numbers, titles, actions, and status.
3. **Votes**
   - 10-minute sync for roll calls and vote breakdowns.

## Storage

- Postgres tables: `people`, `terms`, `roles`, `bills`, `bill_actions`, `bill_votes`.
- Use deterministic IDs: `bioguideId` for members, `{billType}{billNumber}` for bills.

## Serving

- Next.js server components for lists and profiles.
- Route handlers for search filters.
- Edge cache for directory and bill list pages.

## Refresh Strategy

- Vercel Cron triggers serverless functions.
- Incremental updates based on `last_action_date` or `updated_at` fields.
- Store raw API payloads in a `sources` table for audit/debug.
