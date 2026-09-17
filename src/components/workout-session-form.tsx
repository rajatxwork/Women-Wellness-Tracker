"use client";

import { useState, useTransition } from "react";
import { Plus, Trash2 } from "lucide-react";
import {
  MOVEMENT_PATTERNS,
  type MovementPatternSlug,
  type MovementVariant,
} from "@/lib/data/movement";
import { logWorkoutSession, type SetInput } from "@/app/actions/workout";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import { getWorkoutCelebration } from "@/lib/encouragement";
import { cn, todayISO } from "@/lib/utils";

const HARDER_MARKERS = [
  { key: "slow-tempo", label: "Slower tempo" },
  { key: "single-leg", label: "Single leg / single arm" },
  { key: "paused-rep", label: "Paused rep" },
  { key: "shorter-rest", label: "Shorter rest" },
];

type SetRow = { reps: string; weightKg: string };

type PatternEntry = {
  variant: MovementVariant;
  exerciseName: string;
  bodyweightLevel: 1 | 2 | 3 | null;
  harderVariantMarkers: string[];
  sets: SetRow[];
};

export function WorkoutSessionForm() {
  const [sessionDate, setSessionDate] = useState(todayISO());
  const [entries, setEntries] = useState<Partial<Record<MovementPatternSlug, PatternEntry>>>({});
  const [isPending, startTransition] = useTransition();
  const [justLogged, setJustLogged] = useState(false);

  function togglePattern(slug: MovementPatternSlug) {
    setEntries((prev) => {
      const next = { ...prev };
      if (next[slug]) {
        delete next[slug];
      } else {
        const pattern = MOVEMENT_PATTERNS.find((p) => p.slug === slug)!;
        next[slug] = {
          variant: "bodyweight",
          exerciseName: pattern.exercises.bodyweight[0] ?? "",
          bodyweightLevel: null,
          harderVariantMarkers: [],
          sets: [{ reps: "10", weightKg: "" }],
        };
      }
      return next;
    });
  }

  function updateEntry(slug: MovementPatternSlug, patch: Partial<PatternEntry>) {
    setEntries((prev) => ({ ...prev, [slug]: { ...prev[slug]!, ...patch } }));
  }

  function addSet(slug: MovementPatternSlug) {
    const entry = entries[slug]!;
    updateEntry(slug, { sets: [...entry.sets, { reps: "10", weightKg: "" }] });
  }

  function removeSet(slug: MovementPatternSlug, index: number) {
    const entry = entries[slug]!;
    updateEntry(slug, { sets: entry.sets.filter((_, i) => i !== index) });
  }

  function updateSet(slug: MovementPatternSlug, index: number, patch: Partial<SetRow>) {
    const entry = entries[slug]!;
    const sets = entry.sets.map((s, i) => (i === index ? { ...s, ...patch } : s));
    updateEntry(slug, { sets });
  }

  function toggleMarker(slug: MovementPatternSlug, markerKey: string) {
    const entry = entries[slug]!;
    const has = entry.harderVariantMarkers.includes(markerKey);
    updateEntry(slug, {
      harderVariantMarkers: has
        ? entry.harderVariantMarkers.filter((m) => m !== markerKey)
        : [...entry.harderVariantMarkers, markerKey],
    });
  }

  function handleSubmit() {
    const patternsTrained = Object.keys(entries);
    if (patternsTrained.length === 0) return;

    const sets: SetInput[] = [];
    for (const [slug, entry] of Object.entries(entries) as [MovementPatternSlug, PatternEntry][]) {
      entry.sets.forEach((s, i) => {
        sets.push({
          patternSlug: slug,
          exerciseName: entry.exerciseName,
          variant: entry.variant,
          setNumber: i + 1,
          reps: s.reps ? Number(s.reps) : null,
          weightKg: s.weightKg ? Number(s.weightKg) : null,
          isBodyweight: entry.variant === "bodyweight",
          bodyweightLevel: entry.variant === "bodyweight" ? entry.bodyweightLevel : null,
          harderVariantMarkers: entry.harderVariantMarkers,
        });
      });
    }

    startTransition(async () => {
      await logWorkoutSession({ sessionDate, patternsTrained, notes: null, sets });
      setEntries({});
      setJustLogged(true);
      setTimeout(() => setJustLogged(false), 2500);
    });
  }

  return (
    <div className="space-y-5">
      <div>
        <Label htmlFor="session-date">Date</Label>
        <Input
          id="session-date"
          type="date"
          value={sessionDate}
          onChange={(e) => setSessionDate(e.target.value)}
          className="w-48"
        />
      </div>

      <div>
        <p className="mb-2 text-sm font-medium text-ink-soft">
          Which movement patterns did you train?
        </p>
        <div className="flex flex-wrap gap-2">
          {MOVEMENT_PATTERNS.map((pattern) => {
            const active = Boolean(entries[pattern.slug]);
            return (
              <button
                key={pattern.slug}
                onClick={() => togglePattern(pattern.slug)}
                className={cn(
                  "rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors",
                  active
                    ? "border-terracotta bg-terracotta text-white"
                    : "border-border bg-surface-soft text-ink-soft hover:border-terracotta/40",
                )}
              >
                {pattern.name}
              </button>
            );
          })}
        </div>
      </div>

      {(Object.entries(entries) as [MovementPatternSlug, PatternEntry][]).map(([slug, entry]) => {
        const pattern = MOVEMENT_PATTERNS.find((p) => p.slug === slug)!;
        const exerciseOptions = pattern.exercises[entry.variant];

        return (
          <div key={slug} className="rounded-2xl border border-border bg-surface-soft p-4">
            <p className="mb-3 font-serif-display text-base text-ink">{pattern.name}</p>

            <div className="mb-3 flex flex-wrap gap-2">
              {(["gym", "home-weights", "bodyweight"] as MovementVariant[]).map((variant) => (
                <button
                  key={variant}
                  onClick={() =>
                    updateEntry(slug, {
                      variant,
                      exerciseName: pattern.exercises[variant][0] ?? "",
                    })
                  }
                  className={cn(
                    "rounded-full px-3 py-1 text-xs font-medium transition-colors",
                    entry.variant === variant
                      ? "bg-ink text-cream"
                      : "bg-cream-soft text-ink-soft",
                  )}
                >
                  {variant === "gym" ? "Gym" : variant === "home-weights" ? "Home + weights" : "Bodyweight"}
                </button>
              ))}
            </div>

            <select
              value={entry.exerciseName}
              onChange={(e) => updateEntry(slug, { exerciseName: e.target.value })}
              className="mb-3 w-full rounded-2xl border border-border bg-surface px-4 py-2.5 text-sm text-ink"
            >
              {exerciseOptions.map((ex) => (
                <option key={ex} value={ex}>
                  {ex}
                </option>
              ))}
            </select>

            {entry.variant === "bodyweight" && (
              <div className="mb-3 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-ink-soft">Level:</span>
                  {[1, 2, 3].map((lvl) => (
                    <button
                      key={lvl}
                      onClick={() =>
                        updateEntry(slug, {
                          bodyweightLevel: entry.bodyweightLevel === lvl ? null : (lvl as 1 | 2 | 3),
                        })
                      }
                      className={cn(
                        "h-7 w-7 rounded-full text-xs font-semibold transition-colors",
                        entry.bodyweightLevel === lvl
                          ? "bg-sage-deep text-white"
                          : "bg-cream-soft text-ink-soft",
                      )}
                    >
                      {lvl}
                    </button>
                  ))}
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {HARDER_MARKERS.map((marker) => (
                    <button
                      key={marker.key}
                      onClick={() => toggleMarker(slug, marker.key)}
                      className={cn(
                        "rounded-full px-2.5 py-1 text-[11px] font-medium transition-colors",
                        entry.harderVariantMarkers.includes(marker.key)
                          ? "bg-plum text-white"
                          : "bg-cream-soft text-ink-soft",
                      )}
                    >
                      {marker.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="space-y-2">
              {entry.sets.map((set, i) => (
                <div key={i} className="flex items-center gap-2">
                  <span className="w-6 text-xs text-ink-faint">#{i + 1}</span>
                  <Input
                    type="number"
                    placeholder="Reps"
                    value={set.reps}
                    onChange={(e) => updateSet(slug, i, { reps: e.target.value })}
                    className="w-20"
                  />
                  <Input
                    type="number"
                    placeholder={entry.variant === "bodyweight" ? "kg (optional)" : "kg"}
                    value={set.weightKg}
                    onChange={(e) => updateSet(slug, i, { weightKg: e.target.value })}
                    className="w-28"
                  />
                  <button
                    onClick={() => removeSet(slug, i)}
                    className="text-ink-faint hover:text-terracotta-deep"
                    aria-label="Remove set"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
              <button
                onClick={() => addSet(slug)}
                className="flex items-center gap-1 text-xs font-semibold text-terracotta-deep"
              >
                <Plus size={14} /> Add set
              </button>
            </div>
          </div>
        );
      })}

      <Button onClick={handleSubmit} disabled={isPending || Object.keys(entries).length === 0}>
        {isPending ? "Logging…" : "Log this session"}
      </Button>

      {justLogged && (
        <p className="animate-gentle-fade text-sm font-medium text-sage-deep">
          {getWorkoutCelebration()}
        </p>
      )}
    </div>
  );
}
