"use client";

import { useState, useTransition } from "react";
import { Pencil, CheckCircle2 } from "lucide-react";
import {
  AGE_BAND_OPTIONS,
  TRAINING_LEVEL_OPTIONS,
  WORKOUT_GOALS,
  buildRecommendation,
  suggestedExercisesForDay,
  type AgeBand,
  type TrainingLevel,
  type WorkoutGoalSlug,
} from "@/lib/data/workout-goals";
import { saveTrainingProfile } from "@/app/actions/training-profile";
import { applyRecommendedProgram } from "@/app/actions/programs";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Props = {
  initialAgeBand: AgeBand | null;
  initialTrainingLevel: TrainingLevel | null;
  initialGoalSlugs: string[];
};

const DAY_TYPE_LABEL: Record<string, string> = {
  strength: "Strength",
  cardio: "Cardio",
  recovery: "Recovery",
  rest: "Rest",
};

export function TrainingGoalSetup({ initialAgeBand, initialTrainingLevel, initialGoalSlugs }: Props) {
  const initialGoalSlug = (initialGoalSlugs[0] as WorkoutGoalSlug | undefined) ?? null;
  const hasProfile = Boolean(initialAgeBand && initialTrainingLevel && initialGoalSlug);
  const [editing, setEditing] = useState(!hasProfile);

  const [ageBand, setAgeBand] = useState<AgeBand>(initialAgeBand ?? "20s-30s");
  const [trainingLevel, setTrainingLevel] = useState<TrainingLevel>(initialTrainingLevel ?? "beginner");
  const [goalSlug, setGoalSlug] = useState<WorkoutGoalSlug | null>(initialGoalSlug);
  const [saved, setSaved] = useState(false);
  const [showSuggestion, setShowSuggestion] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [weekApplied, setWeekApplied] = useState<"yes" | "no" | null>(null);

  function handleSave() {
    if (!goalSlug) return;
    startTransition(async () => {
      await saveTrainingProfile({ ageBand, trainingLevel, goalSlugs: [goalSlug] });
      setSaved(true);
      setShowSuggestion(true);
      setWeekApplied(null);
      setTimeout(() => setSaved(false), 2000);
    });
  }

  function handleBuildForMe() {
    const variant = TRAINING_LEVEL_OPTIONS.find((l) => l.value === trainingLevel)!.defaultVariant;
    const rec = buildRecommendation(goalSlug!);
    const days = rec.days.map((d) => ({
      dayOfWeek: d.dayOfWeek,
      dayType: d.dayType,
      exercises: d.dayType === "strength" ? suggestedExercisesForDay(d.focus, variant) : [],
    }));

    startTransition(async () => {
      await applyRecommendedProgram({ days, variant });
      setWeekApplied("yes");
      setEditing(false);
    });
  }

  function handleBuildMyself() {
    setWeekApplied("no");
    setEditing(false);
  }

  if (!editing) {
    const levelLabel = TRAINING_LEVEL_OPTIONS.find((l) => l.value === trainingLevel)?.label;
    const ageLabel = AGE_BAND_OPTIONS.find((a) => a.value === ageBand)?.label;
    const goalName = WORKOUT_GOALS.find((g) => g.slug === goalSlug)?.name;
    return (
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border bg-surface-soft px-4 py-3">
        <p className="text-sm text-ink-soft">
          <span className="font-medium text-ink">
            {ageLabel} · {levelLabel}
          </span>
          {goalName && <span> · {goalName}</span>}
        </p>
        <button
          onClick={() => setEditing(true)}
          className="flex items-center gap-1.5 text-xs font-semibold text-terracotta-deep"
        >
          <Pencil size={13} /> Edit
        </button>
      </div>
    );
  }

  const recommendation = showSuggestion && goalSlug ? buildRecommendation(goalSlug) : null;

  return (
    <div className="space-y-5">
      <div>
        <p className="mb-2 text-sm font-medium text-ink-soft">Your age range</p>
        <div className="flex flex-wrap gap-2">
          {AGE_BAND_OPTIONS.map((a) => (
            <button
              key={a.value}
              onClick={() => setAgeBand(a.value)}
              className={cn(
                "rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors",
                ageBand === a.value
                  ? "border-terracotta bg-terracotta text-white"
                  : "border-border bg-surface-soft text-ink-soft hover:border-terracotta/40",
              )}
            >
              {a.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="mb-2 text-sm font-medium text-ink-soft">Your training level</p>
        <div className="grid gap-2 sm:grid-cols-3">
          {TRAINING_LEVEL_OPTIONS.map((l) => (
            <button
              key={l.value}
              onClick={() => setTrainingLevel(l.value)}
              className={cn(
                "relative rounded-2xl border-2 p-3 text-left transition-colors",
                trainingLevel === l.value
                  ? "border-terracotta bg-terracotta/15"
                  : "border-border bg-surface-soft hover:border-terracotta/40",
              )}
            >
              {trainingLevel === l.value && (
                <CheckCircle2 size={16} className="absolute right-2.5 top-2.5 text-terracotta-deep" />
              )}
              <p className="pr-5 text-sm font-semibold text-ink">{l.label}</p>
              <p className="mt-0.5 text-xs text-ink-soft">{l.blurb}</p>
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="mb-2 text-sm font-medium text-ink-soft">What&apos;s your main goal?</p>
        <div className="grid gap-2 sm:grid-cols-2">
          {WORKOUT_GOALS.map((g) => (
            <button
              key={g.slug}
              onClick={() => setGoalSlug(g.slug)}
              className={cn(
                "relative rounded-2xl border-2 p-3 text-left transition-colors",
                goalSlug === g.slug
                  ? "border-terracotta bg-terracotta/15"
                  : "border-border bg-surface-soft hover:border-terracotta/40",
              )}
            >
              {goalSlug === g.slug && (
                <CheckCircle2 size={16} className="absolute right-2.5 top-2.5 text-terracotta-deep" />
              )}
              <p className="pr-5 text-sm font-semibold text-ink">{g.name}</p>
              <p className="mt-0.5 text-xs text-ink-soft">{g.blurb}</p>
              <p className="mt-1.5 text-xs font-medium text-terracotta-deep">{g.structureSummary}</p>
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Button size="sm" disabled={isPending || !goalSlug} onClick={handleSave}>
          {isPending && !showSuggestion ? "Saving…" : saved ? "Saved ✓" : "Save & suggest a week"}
        </Button>
        {hasProfile && (
          <Button size="sm" variant="ghost" onClick={() => setEditing(false)}>
            Cancel
          </Button>
        )}
      </div>

      {recommendation && (
        <div className="rounded-2xl border border-border bg-surface-soft p-4">
          <p className="font-serif-display text-base text-ink">
            Here&apos;s an ideal week for {recommendation.goal.name.toLowerCase()}
          </p>
          <p className="mt-1 text-sm text-ink-soft">{recommendation.goal.structureSummary}</p>

          <div className="mt-3 rounded-xl bg-surface px-3 py-2.5">
            <p className="text-sm font-semibold text-ink">
              Suggested rep range: {recommendation.goal.repRange}
            </p>
            <p className="mt-0.5 text-xs text-ink-soft">{recommendation.goal.repRangeWhy}</p>
          </div>

          <div className="mt-3 grid grid-cols-4 gap-1.5 sm:grid-cols-7">
            {recommendation.days.map((d) => (
              <div key={d.dayOfWeek} className="rounded-xl bg-surface px-2 py-2 text-center">
                <p className="text-[10px] font-semibold uppercase text-ink-faint">{d.label.slice(0, 3)}</p>
                <p className="mt-1 text-[11px] font-medium text-ink">{DAY_TYPE_LABEL[d.dayType]}</p>
                {d.focus && <p className="text-[10px] capitalize text-ink-faint">{d.focus} body</p>}
              </div>
            ))}
          </div>

          <p className="mt-3 text-xs leading-relaxed text-ink-faint">{recommendation.disclaimer}</p>

          {weekApplied === "yes" ? (
            <p className="mt-3 text-sm font-medium text-sage-deep">
              Done, your week below is filled in, feel free to change anything.
            </p>
          ) : weekApplied === "no" ? (
            <p className="mt-3 text-sm text-ink-soft">No problem, build your week however you want below.</p>
          ) : (
            <div className="mt-3 rounded-xl border border-dashed border-border p-3">
              <p className="text-sm font-medium text-ink">
                Want us to build this into your week for you?
              </p>
              <div className="mt-2 flex flex-wrap items-center gap-3">
                <Button size="sm" disabled={isPending} onClick={handleBuildForMe}>
                  {isPending ? "Building…" : "Yes, build my week"}
                </Button>
                <button
                  onClick={handleBuildMyself}
                  className="text-xs font-semibold text-terracotta-deep"
                >
                  No, I&apos;ll build it myself
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
