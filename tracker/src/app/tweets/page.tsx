import TweetBoard from "@/components/TweetBoard";
import { getLiveMembers } from "@/lib/data/live";

export const revalidate = 3600;

export default async function TweetsPage() {
  const members = await getLiveMembers();

  return (
    <div className="space-y-8">
      <header>
        <p className="label">X Signal</p>
        <h1 className="mt-2 font-display text-3xl tracking-tight">
          Official accounts
        </h1>
        <p className="mt-2 text-muted">
          Live timelines from members of Congress and the executive branch.
        </p>
      </header>
      <TweetBoard members={members} />
    </div>
  );
}
