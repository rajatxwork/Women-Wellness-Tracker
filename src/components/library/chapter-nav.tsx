"use client";

import { cn } from "@/lib/utils";

export type LibraryChapterSlug = "nutrition" | "cardio" | "strength" | "recipes";

export type LibraryChapter = {
  slug: LibraryChapterSlug;
  label: string;
  subsections: { id: string; label: string }[];
};

export function ChapterNav({
  chapters,
  activeChapter,
  onChapterChange,
  onJump,
}: {
  chapters: LibraryChapter[];
  activeChapter: LibraryChapterSlug;
  onChapterChange: (slug: LibraryChapterSlug) => void;
  onJump: (id: string) => void;
}) {
  return (
    <>
      {/* Mobile: horizontal pill filters for chapters */}
      <div className="flex gap-2 overflow-x-auto pb-1 md:hidden">
        {chapters.map((c) => {
          const active = c.slug === activeChapter;
          return (
            <button
              key={c.slug}
              type="button"
              onClick={() => onChapterChange(c.slug)}
              aria-pressed={active}
              className={cn(
                "flex h-11 flex-shrink-0 items-center justify-center whitespace-nowrap rounded-full border px-4 text-sm font-semibold transition-colors",
                active
                  ? "border-terracotta bg-terracotta text-white"
                  : "border-border bg-surface-soft text-ink-soft hover:border-terracotta/40",
              )}
            >
              {c.label}
            </button>
          );
        })}
      </div>

      {/* Desktop: sticky left table of contents jump-bar */}
      <nav className="sticky top-8 hidden w-56 flex-shrink-0 self-start md:block">
        <ul className="space-y-1">
          {chapters.map((c) => {
            const active = c.slug === activeChapter;
            return (
              <li key={c.slug}>
                <button
                  type="button"
                  onClick={() => onChapterChange(c.slug)}
                  className={cn(
                    "block w-full rounded-2xl px-3.5 py-2.5 text-left text-sm font-semibold transition-colors",
                    active ? "bg-blush/60 text-ink" : "text-ink-soft hover:bg-cream-soft",
                  )}
                >
                  {c.label}
                </button>
                {active && c.subsections.length > 0 && (
                  <ul className="ml-3 mt-1 space-y-0.5 border-l border-border pl-3">
                    {c.subsections.map((s) => (
                      <li key={s.id}>
                        <a
                          href={`#${s.id}`}
                          onClick={(e) => {
                            e.preventDefault();
                            onJump(s.id);
                          }}
                          className="block rounded-lg px-2 py-1.5 text-xs font-medium text-ink-faint transition-colors hover:text-terracotta-deep"
                        >
                          {s.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            );
          })}
        </ul>
      </nav>
    </>
  );
}
