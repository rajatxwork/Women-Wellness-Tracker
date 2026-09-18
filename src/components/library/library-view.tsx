"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { ChapterNav, type LibraryChapter, type LibraryChapterSlug } from "@/components/library/chapter-nav";
import { NutritionChapter } from "@/components/library/nutrition-chapter";
import { CardioChapter } from "@/components/library/cardio-chapter";
import { StrengthChapter } from "@/components/library/strength-chapter";
import { RecipesChapter } from "@/components/library/recipes-chapter";

const CHAPTERS: LibraryChapter[] = [
  {
    slug: "nutrition",
    label: "Nutrition",
    subsections: [
      { id: "nutrition-goals", label: "Your Goals, Mapped to Food" },
      { id: "nutrition-tips", label: "Quick Tips" },
    ],
  },
  {
    slug: "cardio",
    label: "Cardio",
    subsections: [
      { id: "cardio-types", label: "Cardio Types" },
      { id: "cardio-targets", label: "Weekly Targets" },
      { id: "cardio-equipment", label: "Equipment Options" },
      { id: "cardio-friction", label: "Low Friction Tips" },
    ],
  },
  {
    slug: "strength",
    label: "Strength Training",
    subsections: [
      { id: "strength-schedule", label: "Weekly Schedule" },
      { id: "strength-patterns", label: "Movement Patterns" },
      { id: "strength-progressions", label: "Bodyweight Progressions" },
      { id: "strength-form", label: "Form & Warm Up" },
    ],
  },
  {
    slug: "recipes",
    label: "Recipes",
    subsections: [{ id: "recipes-all", label: "All 25 Recipes" }],
  },
];

const VALID_CHAPTERS = CHAPTERS.map((c) => c.slug);

export function LibraryView() {
  const searchParams = useSearchParams();
  const requestedChapter = searchParams.get("chapter");
  const initialChapter = VALID_CHAPTERS.includes(requestedChapter as LibraryChapterSlug)
    ? (requestedChapter as LibraryChapterSlug)
    : "nutrition";

  const [activeChapter, setActiveChapter] = useState<LibraryChapterSlug>(initialChapter);

  function handleJump(id: string) {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  // Deep-link support (e.g. a link from the Workout page): jump to the
  // requested section once its chapter has rendered.
  useEffect(() => {
    const section = searchParams.get("section");
    if (!section) return;
    const timer = setTimeout(() => handleJump(section), 150);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- only re-run when the chapter we jump within changes
  }, [activeChapter]);

  function handleChapterChange(slug: LibraryChapterSlug) {
    setActiveChapter(slug);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <div className="flex flex-col gap-6 md:flex-row md:items-start md:gap-8">
      <ChapterNav
        chapters={CHAPTERS}
        activeChapter={activeChapter}
        onChapterChange={handleChapterChange}
        onJump={handleJump}
      />

      <div className="min-w-0 flex-1">
        {activeChapter === "nutrition" && <NutritionChapter />}
        {activeChapter === "cardio" && <CardioChapter />}
        {activeChapter === "strength" && <StrengthChapter />}
        {activeChapter === "recipes" && <RecipesChapter />}
      </div>
    </div>
  );
}
