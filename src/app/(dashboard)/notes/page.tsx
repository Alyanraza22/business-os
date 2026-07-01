import type { Metadata } from "next";

import { PageHeader } from "@/components/layout/page-header";
import { NotesGrid } from "@/features/notes/components/notes-grid";
import { NotesToolbar } from "@/features/notes/components/notes-toolbar";
import { getNotes } from "@/features/notes/queries";

export const metadata: Metadata = {
  title: "Notes",
  robots: { index: false, follow: false },
};

interface NotesPageProps {
  searchParams: Promise<{ q?: string; view?: string }>;
}

export default async function NotesPage({ searchParams }: NotesPageProps) {
  const { q, view } = await searchParams;
  const archived = view === "archived";
  const notes = await getNotes({ q, archived });
  const filtered = Boolean(q || archived);

  return (
    <div>
      <PageHeader
        title="Notes"
        description="Quick notes, pinned and searchable."
      />
      <NotesToolbar />
      <NotesGrid notes={notes} filtered={filtered} />
    </div>
  );
}
