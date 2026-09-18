"use client";

import { useState, useTransition } from "react";
import { ChevronDown, ChevronUp, Plus, Trash2 } from "lucide-react";
import { MOVEMENT_PATTERNS, type MovementVariant } from "@/lib/data/movement";
import { setPlanDayType, type DayType } from "@/app/actions/plan-days";
import { addWeekMovement, removeProgramItem, logProgramEntry } from "@/app/actions/programs";
import { ExercisePicker, type PickedExercise } from "@/components/exercise-picker";
import { VideoLink } from "@/components/video-link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const PRIORITY_PATTERN_SLUGS = MOVEMENT_PATTERNS.filter((p) => p.priority).map((p) => p.slug);

const DAY_TYPE_OPTIONS: { value: DayType; label: string }[] = [
  { value: "strength", label: "Strength" },
  { value: "cardio", label: "Cardio" },
  { value: "recovery", label: "Active recovery" },
  { value: "rest", label: "Rest" },
];

type RecentEntry = { date: string; reps: number | null; weightKg: number | null };

export type PlanItemView = {
  id: string;
  programId: string;
  exerciseName: string;
  patternSlug: string | null;
  bundleId: string | null;
  variant: MovementVariant | null;
  isBookExercise: boolean;
  recentEntries: RecentEntry[];
};

export type DayView = {
  dayOfWeek: number;
  label: string;
  dateLabel: string;
  dayType: DayType;
  done: boolean;
  items: PlanItemView[];
};

type Bundle = { id: string; name: string };
type CustomExercise = {
  id: string;
  name: string;
  patternSlug: string | null;
  bundleId: string | null;
  variant: MovementVariant | null;
};

export function WeeklyPlanBuilder({
  days,
  bundles,
  customExercises,
  defaultVariant,
}: {
  days: DayView[];
  bundles: Bundle[];
  customExercises: CustomExercise[];
  defaultVariant: MovementVariant;
}) {
  return (
    <div className="space-y-3">
      {days.map((day) => (
        <DayCard
          key={day.dayOfWeek}
          day={day}
          bundles={bundles}
          customExercises={customExercises}
          defaultVariant={defaultVariant}
        />
      ))}
    </div>
  );
}

function DayCard({
  day,
  bundles,
  customExercises,
  defaultVariant,
}: {
  day: DayView;
  bundles: Bundle[];
  customExercises: CustomExercise[];
  defaultVariant: MovementVariant;
}) {
  const [isPending, startTransition] = useTransition();
  const [addingMovement, setAddingMovement] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const presentPatterns = new Set(day.items.map((i) => i.patternSlug).filter(Boolean));
  const suggestedPatternSlugs = PRIORITY_PATTERN_SLUGS.filter((slug) => !presentPatterns.has(slug));
  const dayVariant = day.items.find((i) => i.variant)?.variant ?? defaultVariant;

  function handleTypeChange(newType: DayType) {
    setErrorMessage(null);
    startTransition(async () => {
      try {
        await setPlanDayType(day.dayOfWeek, newType);
      } catch {
        setErrorMessage("Couldn't save that, try again in a moment.");
      }
    });
  }

  function handlePick(picked: PickedExercise) {
    setErrorMessage(null);
    startTransition(async () => {
      try {
        await addWeekMovement({
          dayOfWeek: day.dayOfWeek,
          exerciseName: picked.exerciseName,
          patternSlug: picked.patternSlug,
          bundleId: picked.bundleId,
          variant: picked.variant,
        });
      } catch {
        setErrorMessage("Couldn't add that movement, try again in a moment.");
      }
    });
    setAddingMovement(false);
  }

  function handleQuickAddPattern(slug: string) {
    const pattern = MOVEMENT_PATTERNS.find((p) => p.slug === slug)!;
    const exerciseName = pattern.exercises[dayVariant]?.[0] ?? pattern.exercises.bodyweight[0];
    setErrorMessage(null);
    startTransition(async () => {
      try {
        await addWeekMovement({
          dayOfWeek: day.dayOfWeek,
          exerciseName,
          patternSlug: pattern.slug,
          bundleId: null,
          variant: dayVariant,
        });
      } catch {
        setErrorMessage("Couldn't add that movement, try again in a moment.");
      }
    });
  }

  return (
    <div className="rounded-3xl border border-border bg-surface-soft p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <p className="font-serif-display text-base text-ink">{day.label}</p>
          <span className="text-xs text-ink-faint">{day.dateLabel}</span>
          {day.done && (
            <span className="rounded-full bg-sage-deep/15 px-2 py-0.5 text-[10px] font-semibold text-sage-deep">
              Done ✓
            </span>
          )}
        </div>
        <select
          value={day.dayType}
          onChange={(e) => handleTypeChange(e.target.value as DayType)}
          disabled={isPending}
          className="rounded-full border border-border bg-surface px-3.5 py-1.5 text-sm font-medium text-ink"
        >
          {DAY_TYPE_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </div>

      {day.dayType === "strength" ? (
        <div className="mt-3 space-y-2">
          {day.items.map((item) => (
            <PlanItemRow key={item.id} item={item} />
          ))}

          {suggestedPatternSlugs.length > 0 && day.items.length > 0 && (
            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              <span className="text-xs text-ink-faint">Pairs well with:</span>
              {suggestedPatternSlugs.map((slug) => (
                <button
                  key={slug}
                  disabled={isPending}
                  onClick={() => handleQuickAddPattern(slug)}
                  className="rounded-full bg-cream-soft px-2.5 py-1 text-[11px] font-medium text-ink-soft transition-colors hover:bg-blush/50"
                >
                  + {MOVEMENT_PATTERNS.find((p) => p.slug === slug)!.name}
                </button>
              ))}
            </div>
          )}

          {addingMovement ? (
            <div className="rounded-2xl border border-dashed border-border p-3">
              <ExercisePicker customExercises={customExercises} bundles={bundles} onSelect={handlePick} />
              <button
                onClick={() => setAddingMovement(false)}
                className="mt-2 text-xs font-semibold text-ink-faint"
              >
                Close
              </button>
            </div>
          ) : (
            <button
              onClick={() => setAddingMovement(true)}
              className="flex min-h-11 items-center gap-1.5 text-xs font-semibold text-terracotta-deep"
            >
              <Plus size={14} /> Add a movement
            </button>
          )}
        </div>
      ) : (
        <p className="mt-3 text-sm text-ink-soft">
          {day.dayType === "cardio" && "Log your cardio session in the Cardio card below ↓"}
          {day.dayType === "recovery" && "Log your active recovery in the card below ↓"}
          {day.dayType === "rest" && "A rest day, however you want to spend it."}
        </p>
      )}

      {errorMessage && <p className="mt-2 text-xs text-terracotta-deep">{errorMessage}</p>}
    </div>
  );
}

function PlanItemRow({ item }: { item: PlanItemView }) {
  const [isPending, startTransition] = useTransition();
  const [expanded, setExpanded] = useState(false);
  const [reps, setReps] = useState("10");
  const [weight, setWeight] = useState("");
  const [justLogged, setJustLogged] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  function handleLog() {
    setErrorMessage(null);
    startTransition(async () => {
      try {
        await logProgramEntry({
          programId: item.programId,
          patternSlug: item.patternSlug,
          bundleId: item.bundleId,
          exerciseName: item.exerciseName,
          variant: item.variant,
          reps: reps ? Number(reps) : null,
          weightKg: weight ? Number(weight) : null,
        });
        setJustLogged(true);
        setTimeout(() => setJustLogged(false), 1500);
      } catch {
        setErrorMessage("Couldn't log that, try again in a moment.");
      }
    });
  }

  function handleRemove() {
    setErrorMessage(null);
    startTransition(async () => {
      try {
        await removeProgramItem(item.id);
      } catch {
        setErrorMessage("Couldn't remove that, try again in a moment.");
      }
    });
  }

  return (
    <div className="rounded-xl bg-surface p-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <button
          onClick={() => setExpanded((v) => !v)}
          className="flex items-center gap-1 text-sm font-medium text-ink"
        >
          {item.exerciseName}
          {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </button>
        <div className="flex items-center gap-1">
          <VideoLink exerciseName={item.exerciseName} />
          <button
            onClick={handleRemove}
            aria-label={`Remove ${item.exerciseName}`}
            className="flex h-11 w-11 items-center justify-center text-ink-faint hover:text-terracotta-deep"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      <div className="mt-2 flex flex-wrap items-center gap-2">
        <Input
          type="number"
          value={reps}
          onChange={(e) => setReps(e.target.value)}
          placeholder="Reps"
          className="w-20"
        />
        <Input
          type="number"
          value={weight}
          onChange={(e) => setWeight(e.target.value)}
          placeholder="kg (optional)"
          className="w-28"
        />
        <Button size="sm" variant="outline" disabled={isPending} onClick={handleLog}>
          {isPending ? "Logging…" : justLogged ? "Logged ✓" : "Log today"}
        </Button>
      </div>

      {errorMessage && <p className="mt-1.5 text-xs text-terracotta-deep">{errorMessage}</p>}

      {expanded && (
        <div className="mt-2 border-t border-border pt-2">
          {item.recentEntries.length === 0 ? (
            <p className="text-xs text-ink-faint">No entries yet, log one above to start tracking.</p>
          ) : (
            <table className="w-full text-xs text-ink-soft">
              <thead>
                <tr className="text-ink-faint">
                  <th className="pb-1 text-left font-normal">Date</th>
                  <th className="pb-1 text-left font-normal">Reps</th>
                  <th className="pb-1 text-left font-normal">Weight</th>
                </tr>
              </thead>
              <tbody>
                {item.recentEntries.map((entry, i) => (
                  <tr key={i}>
                    <td className="py-0.5">{entry.date}</td>
                    <td className="py-0.5">{entry.reps ?? "–"}</td>
                    <td className="py-0.5">{entry.weightKg ? `${entry.weightKg} kg` : "bodyweight"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
}
