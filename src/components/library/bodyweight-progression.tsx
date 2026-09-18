"use client";

import { useState } from "react";
import { BODYWEIGHT_PROGRESSION, type BodyweightLevel } from "@/lib/data/movement";
import { PillTabs } from "@/components/ui/pill-tabs";
import { VideoLink } from "@/components/video-link";

const LEVEL_OPTIONS: { value: string; label: string }[] = [
  { value: "1", label: "Level 1" },
  { value: "2", label: "Level 2" },
  { value: "3", label: "Level 3" },
];

export function BodyweightProgression() {
  const [level, setLevel] = useState<BodyweightLevel>(1);
  const data = BODYWEIGHT_PROGRESSION[level];

  return (
    <div className="rounded-3xl border border-border bg-surface-soft p-5">
      <PillTabs
        options={LEVEL_OPTIONS}
        value={String(level)}
        onChange={(v) => setLevel(Number(v) as BodyweightLevel)}
      />
      <p className="mt-3 font-serif-display text-base text-ink">{data.label}</p>
      <ul className="mt-3 space-y-1">
        {data.exercises.map((item) => (
          <li
            key={item.exercise}
            className="flex items-center justify-between gap-2 rounded-2xl px-1 py-1.5"
          >
            <span className="text-sm leading-snug text-ink">{item.exercise}</span>
            <VideoLink exerciseName={item.exercise} />
          </li>
        ))}
      </ul>
    </div>
  );
}
