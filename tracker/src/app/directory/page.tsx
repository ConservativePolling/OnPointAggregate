import MembersDirectory from "@/components/MembersDirectory";
import SectionHeader from "@/components/SectionHeader";
import { getLiveMembers } from "@/lib/data/live";

export default async function DirectoryPage() {
  const members = await getLiveMembers();

  return (
    <div className="space-y-10">
      <SectionHeader
        title="Directory"
        subtitle="Every member of Congress, the cabinet, and the White House."
      />
      <MembersDirectory members={members} />
    </div>
  );
}
