"use client";

import { useState, useTransition } from "react";
import { Pencil } from "lucide-react";
import {
  AGE_BAND_OPTIONS,
  TRAINING_LEVEL_OPTIONS,
  WORKOUT_GOALS,
  buildRecommendation,
  type AgeBand,
  type TrainingLevel,
} from "@/lib/data/workout-goals";
import { saveTrainingProfile } from "@/app/actions/training-profile";
import { applyRecommendedWeek } from "@/app/actions/plan-days";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Props = {
  initialAgeBand: AgeBand | null;
  initialTrainingLevel: TrainingLevel | null;
  initialGoalSlugs: string[];
};

export function TrainingGoalSetup({ initialAgeBand, initialTrainingLevel, initialGoalSlugs }: Props) {
  const hasProfile = Boolean(initialAgeBand && initialTrainingLevel);
  const [editing, setEditing] = useState(!hasProfile);

  const [ageBand, setAgeBand] = useState<AgeBand>(initialAgeBand ?? "20s-30s");
  const [trainingLevel, setTrainingLevel] = useState<TrainingLevel>(initialTrainingLevel ?? "beginner");
  const [goalSlugs, setGoalSlugs] = useState<string[]>(initialGoalSlugs);
  const [saved, setSaved] = useState(false);
  const [showSuggestion, setShowSuggestion] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [weekApplied, setWeekApplied] = useState(false);

  function toggleGoal(slug: string) {
    setGoalSlugs((prev) => (prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug]));
  }

  function handleSave() {
    startTransition(async () => {
      await saveTrainingProfile({ ageBand, trainingLevel, goalSlugs });
      setSaved(true);
      setShowSuggestion(true);
      setTimeout(() => setSaved(false), 2000);
    });
  }

  function handleApplyWeek() {
    const rec = buildRecommendation(goalSlugs);
    startTransition(async () => {
      await applyRecommendedWeek(rec.days.map((d) => ({ dayOfWeek: d.dayOfWeek, dayType: d.dayType })));
      setWeekApplied(true);
      setEditing(false);
    });
  }

  if (!editing) {
    const levelLabel = TRAINING_LEVEL_OPTIONS.find((l) => l.value === trainingLevel)?.label;
    const ageLabel = AGE_BAND_OPTIONS.find((a) => a.value === ageBand)?.label;
    const goalNames = goalSlugs.map((s) => WORKOUT_GOALS.find((g) => g.slug === s)?.name).filter(Boolean);
    return (
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border bg-surface-soft px-4 py-3">
        <p className="text-sm text-ink-soft">
          <span className="font-medium text-ink">{ageLabel} · {levelLabel}</span>
          {goalNames.length > 0 && <span> · Focused on {goalNames.join(", ")}</span>}
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

  const recommendation = showSuggestion ? buildRecommendation(goalSlugs) : null;

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
                "rounded-2xl border p-3 text-left transition-colors",
                trainingLevel === l.value
                  ? "border-terracotta bg-terracotta/10"
                  : "border-border bg-surface-soft hover:border-terracotta/40",
              )}
            >
              <p className="text-sm font-semibold text-ink">{l.label}</p>
              <p className="mt-0.5 text-xs text-ink-soft">{l.blurb}</p>
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="mb-2 text-sm font-medium text-ink-soft">What are you mainly trying to achieve?</p>
        <div className="flex flex-wrap gap-2">
          {WORKOUT_GOALS.map((g) => {
            const active = goalSlugs.includes(g.slug);
            return (
              <button
                key={g.slug}
                onClick={() => toggleGoal(g.slug)}
                title={g.blurb}
                className={cn(
                  "rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors",
                  active
                    ? "border-terracotta bg-terracotta text-white"
                    : "border-border bg-surface-soft text-ink-soft hover:border-terracotta/40",
                )}
              >
                {g.name}
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Button size="sm" disabled={isPending} onClick={handleSave}>
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
          <p className="font-serif-display text-base text-ink">Here&apos;s an ideal week for you</p>
          <p className="mt-1 text-sm text-ink-soft">{recommendation.strengthNote}</p>
          <p className="mt-1 text-sm text-ink-soft">{recommendation.cardioNote}</p>

          <div className="mt-3 grid grid-cols-4 gap-1.5 sm:grid-cols-7">
            {recommendation.days.map((d) => (
              <div key={d.dayOfWeek} className="rounded-xl bg-surface px-2 py-2 text-center">
                <p className="text-[10px] font-semibold uppercase text-ink-faint">{d.label.slice(0, 3)}</p>
                <p className="mt-1 text-[11px] font-medium capitalize text-ink">{d.dayType}</p>
              </div>
            ))}
          </div>

          {recommendation.tips.length > 0 && (
            <ul className="mt-3 space-y-1.5">
              {recommendation.tips.map((tip) => (
                <li key={tip} className="text-xs leading-relaxed text-ink-soft">
                  {tip}
                </li>
              ))}
            </ul>
          )}

          <div className="mt-3 flex flex-wrap items-center gap-3">
            <Button size="sm" disabled={isPending} onClick={handleApplyWeek}>
              {weekApplied ? "Applied to your week ✓" : "Use this as my week"}
            </Button>
            <button
              onClick={() => {
                setShowSuggestion(false);
                setEditing(false);
              }}
              className="text-xs font-semibold text-terracotta-deep"
            >
              I&apos;ll build my own instead
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
