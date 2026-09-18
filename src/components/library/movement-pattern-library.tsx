"use client";

import { useState } from "react";
import { MOVEMENT_PATTERNS, type MovementVariant } from "@/lib/data/movement";
import { PillTabs } from "@/components/ui/pill-tabs";
import { VideoLink } from "@/components/video-link";

const ENV_OPTIONS: { value: MovementVariant; label: string }[] = [
  { value: "gym", label: "Gym" },
  { value: "home-weights", label: "Home + weights" },
  { value: "bodyweight", label: "Bodyweight" },
];

function MovementPatternCard({ pattern }: { pattern: (typeof MOVEMENT_PATTERNS)[number] }) {
  const [env, setEnv] = useState<MovementVariant>("gym");

  return (
    <div className="mb-4 break-inside-avoid rounded-3xl border border-border bg-surface-soft p-5">
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-serif-display text-lg text-ink">{pattern.name}</h3>
        {pattern.priority && (
          <span className="flex-shrink-0 rounded-full bg-terracotta/15 px-2.5 py-1 text-[11px] font-semibold text-terracotta-deep">
            Prioritize
          </span>
        )}
      </div>

      <PillTabs options={ENV_OPTIONS} value={env} onChange={setEnv} className="mt-3" />

      <ul className="mt-3 space-y-1">
        {pattern.exercises[env].map((exercise) => (
          <li
            key={exercise}
            className="flex items-center justify-between gap-2 rounded-2xl px-1 py-1.5"
          >
            <span className="text-sm leading-snug text-ink">{exercise}</span>
            <VideoLink exerciseName={exercise} />
          </li>
        ))}
      </ul>
    </div>
  );
}

export function MovementPatternLibrary() {
  return (
    <div className="columns-1 gap-4 md:columns-2 xl:columns-3">
      {MOVEMENT_PATTERNS.map((pattern) => (
        <MovementPatternCard key={pattern.slug} pattern={pattern} />
      ))}
    </div>
  );
}
