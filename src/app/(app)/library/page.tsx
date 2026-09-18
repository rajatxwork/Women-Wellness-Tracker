import { BookOpen } from "lucide-react";
import { PageHeading } from "@/components/page-heading";
import { LibraryView } from "@/components/library/library-view";

export default function LibraryPage() {
  return (
    <div className="space-y-6">
      <PageHeading
        icon={BookOpen}
        title="Library"
        subtitle="The companion e-book, organized to read, filter, and put to use."
        accentClass="bg-plum/20 text-plum"
      />
      <LibraryView />
    </div>
  );
}
