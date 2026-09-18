"use client";

import { useState } from "react";
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

export function LibraryView() {
  const [activeChapter, setActiveChapter] = useState<LibraryChapterSlug>("nutrition");

  function handleChapterChange(slug: LibraryChapterSlug) {
    setActiveChapter(slug);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handleJump(id: string) {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
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
