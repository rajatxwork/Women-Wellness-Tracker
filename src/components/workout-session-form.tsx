"use client";

import { useState, useTransition } from "react";
import { Plus, Trash2 } from "lucide-react";
import { MOVEMENT_PATTERNS, type MovementVariant } from "@/lib/data/movement";
import { logWorkoutSession, type SetInput } from "@/app/actions/workout";
import { ExercisePicker, type PickedExercise } from "@/components/exercise-picker";
import { VideoLink } from "@/components/video-link";
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

type SessionEntry = {
  id: string;
  exerciseName: string;
  patternSlug: string | null;
  bundleId: string | null;
  variant: MovementVariant | null;
  isBookExercise: boolean;
  bodyweightLevel: 1 | 2 | 3 | null;
  harderVariantMarkers: string[];
  sets: SetRow[];
};

type Bundle = { id: string; name: string };
type CustomExercise = {
  id: string;
  name: string;
  patternSlug: string | null;
  bundleId: string | null;
  variant: MovementVariant | null;
};

export function WorkoutSessionForm({
  bundles,
  customExercises,
}: {
  bundles: Bundle[];
  customExercises: CustomExercise[];
}) {
  const [sessionDate, setSessionDate] = useState(todayISO());
  const [entries, setEntries] = useState<SessionEntry[]>([]);
  const [addingExercise, setAddingExercise] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [justLogged, setJustLogged] = useState(false);

  function addEntry(picked: PickedExercise) {
    setEntries((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        exerciseName: picked.exerciseName,
        patternSlug: picked.patternSlug,
        bundleId: picked.bundleId,
        variant: picked.variant ?? "bodyweight",
        isBookExercise: picked.isBookExercise,
        bodyweightLevel: null,
        harderVariantMarkers: [],
        sets: [{ reps: "10", weightKg: "" }],
      },
    ]);
    setAddingExercise(false);
  }

  function updateEntry(id: string, patch: Partial<SessionEntry>) {
    setEntries((prev) => prev.map((e) => (e.id === id ? { ...e, ...patch } : e)));
  }

  function removeEntry(id: string) {
    setEntries((prev) => prev.filter((e) => e.id !== id));
  }

  function addSet(id: string) {
    setEntries((prev) =>
      prev.map((e) => (e.id === id ? { ...e, sets: [...e.sets, { reps: "10", weightKg: "" }] } : e)),
    );
  }

  function removeSet(id: string, index: number) {
    setEntries((prev) =>
      prev.map((e) => (e.id === id ? { ...e, sets: e.sets.filter((_, i) => i !== index) } : e)),
    );
  }

  function updateSet(id: string, index: number, patch: Partial<SetRow>) {
    setEntries((prev) =>
      prev.map((e) =>
        e.id === id ? { ...e, sets: e.sets.map((s, i) => (i === index ? { ...s, ...patch } : s)) } : e,
      ),
    );
  }

  function toggleMarker(id: string, markerKey: string) {
    setEntries((prev) =>
      prev.map((e) =>
        e.id === id
          ? {
              ...e,
              harderVariantMarkers: e.harderVariantMarkers.includes(markerKey)
                ? e.harderVariantMarkers.filter((m) => m !== markerKey)
                : [...e.harderVariantMarkers, markerKey],
            }
          : e,
      ),
    );
  }

  function handleSubmit() {
    if (entries.length === 0) return;

    const patternsTrained = Array.from(
      new Set(entries.map((e) => e.patternSlug).filter((p): p is string => Boolean(p))),
    );

    const sets: SetInput[] = [];
    for (const entry of entries) {
      entry.sets.forEach((s, i) => {
        sets.push({
          patternSlug: entry.patternSlug,
          bundleId: entry.bundleId,
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
      setEntries([]);
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

      {entries.map((entry) => {
        const pattern = entry.patternSlug
          ? MOVEMENT_PATTERNS.find((p) => p.slug === entry.patternSlug)
          : null;

        return (
          <div key={entry.id} className="rounded-2xl border border-border bg-surface-soft p-4">
            <div className="mb-3 flex items-start justify-between gap-2">
              <div>
                <p className="font-serif-display text-base text-ink">{entry.exerciseName}</p>
                <p className="text-xs text-ink-faint">{pattern?.name ?? "Your own exercise"}</p>
              </div>
              <div className="flex items-center gap-1">
                <VideoLink exerciseName={entry.exerciseName} />
                <button
                  onClick={() => removeEntry(entry.id)}
                  aria-label={`Remove ${entry.exerciseName}`}
                  className="flex h-11 w-11 items-center justify-center text-ink-faint hover:text-terracotta-deep"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>

            {entry.isBookExercise && pattern && (
              <div className="mb-3 flex flex-wrap gap-2">
                {(["gym", "home-weights", "bodyweight"] as MovementVariant[]).map((variant) => (
                  <button
                    key={variant}
                    onClick={() =>
                      updateEntry(entry.id, {
                        variant,
                        exerciseName: pattern.exercises[variant][0] ?? entry.exerciseName,
                      })
                    }
                    className={cn(
                      "rounded-full px-3 py-1 text-xs font-medium transition-colors",
                      entry.variant === variant ? "bg-ink text-cream" : "bg-cream-soft text-ink-soft",
                    )}
                  >
                    {variant === "gym" ? "Gym" : variant === "home-weights" ? "Home + weights" : "Bodyweight"}
                  </button>
                ))}
              </div>
            )}

            {entry.variant === "bodyweight" && (
              <div className="mb-3 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-ink-soft">Level:</span>
                  {[1, 2, 3].map((lvl) => (
                    <button
                      key={lvl}
                      onClick={() =>
                        updateEntry(entry.id, {
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
                      onClick={() => toggleMarker(entry.id, marker.key)}
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
                    onChange={(e) => updateSet(entry.id, i, { reps: e.target.value })}
                    className="w-20"
                  />
                  <Input
                    type="number"
                    placeholder={entry.variant === "bodyweight" ? "kg (optional)" : "kg"}
                    value={set.weightKg}
                    onChange={(e) => updateSet(entry.id, i, { weightKg: e.target.value })}
                    className="w-28"
                  />
                  <button
                    onClick={() => removeSet(entry.id, i)}
                    className="text-ink-faint hover:text-terracotta-deep"
                    aria-label="Remove set"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
              <button
                onClick={() => addSet(entry.id)}
                className="flex items-center gap-1 text-xs font-semibold text-terracotta-deep"
              >
                <Plus size={14} /> Add set
              </button>
            </div>
          </div>
        );
      })}

      {addingExercise ? (
        <div className="rounded-2xl border border-dashed border-border p-3">
          <p className="mb-2 text-sm font-medium text-ink-soft">Which exercise?</p>
          <ExercisePicker customExercises={customExercises} bundles={bundles} onSelect={addEntry} />
          <button
            onClick={() => setAddingExercise(false)}
            className="mt-2 text-xs font-semibold text-ink-faint"
          >
            Close
          </button>
        </div>
      ) : (
        <button
          onClick={() => setAddingExercise(true)}
          className="flex min-h-11 items-center gap-1.5 text-sm font-semibold text-terracotta-deep"
        >
          <Plus size={16} /> Add an exercise
        </button>
      )}

      <Button onClick={handleSubmit} disabled={isPending || entries.length === 0}>
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
