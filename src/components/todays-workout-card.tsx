"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { TrendingUp, TrendingDown, Plus, Trash2 } from "lucide-react";
import { MOVEMENT_PATTERNS, type MovementVariant } from "@/lib/data/movement";
import { repGuidanceForPattern } from "@/lib/data/workout-goals";
import { logProgramEntry } from "@/app/actions/programs";
import { updateWorkoutSet, deleteWorkoutSet } from "@/app/actions/workout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { VideoLink } from "@/components/video-link";
import { cn } from "@/lib/utils";

export type SetEntry = { id: string; setNumber: number; reps: number | null; weightKg: number | null };

export type ExerciseCompare = {
  id: string;
  programId: string;
  exerciseName: string;
  patternSlug: string | null;
  bundleId: string | null;
  variant: MovementVariant | null;
  lastSession: { date: string; sets: SetEntry[] } | null;
  todaySets: SetEntry[];
};

export type VolumeTrend = {
  thisWeek: number;
  lastWeek: number;
  percentChange: number | null;
};

const DAY_TYPE_MESSAGE: Record<string, { title: string; body: string; href: string; linkLabel: string }> = {
  cardio: {
    title: "Today's a cardio day",
    body: "Head to the Cardio card to log today's session.",
    href: "/workout#cardio-log",
    linkLabel: "Log cardio",
  },
  recovery: {
    title: "Today's active recovery",
    body: "Something gentle, a walk, foam rolling, mobility work, whatever your body wants.",
    href: "/workout#recovery-log",
    linkLabel: "Log recovery",
  },
  rest: {
    title: "Today's a rest day",
    body: "However you want to spend it.",
    href: "/workout",
    linkLabel: "View your week",
  },
};

function formatSets(sets: SetEntry[]) {
  if (sets.length === 0) return null;
  return sets
    .slice()
    .sort((a, b) => a.setNumber - b.setNumber)
    .map((s) => `${s.reps ?? "–"} reps${s.weightKg ? ` @ ${s.weightKg}kg` : ""}`);
}

export function TodaysWorkoutCard({
  dayType,
  exercises,
  volumeTrend,
}: {
  dayType: "strength" | "cardio" | "recovery" | "rest";
  exercises: ExerciseCompare[];
  volumeTrend: VolumeTrend;
}) {
  return (
    <div className="space-y-4">
      <VolumeTrendBanner trend={volumeTrend} />

      {dayType !== "strength" ? (
        <NonStrengthNote dayType={dayType} />
      ) : exercises.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border p-4 text-center">
          <p className="text-sm text-ink-soft">You haven&apos;t added movements to today yet.</p>
          <Link
            href="/workout#this-week"
            className="mt-2 inline-block text-sm font-semibold text-terracotta-deep"
          >
            Build today into your week →
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {exercises.map((ex) => (
            <ExerciseCompareRow key={ex.id} exercise={ex} />
          ))}
        </div>
      )}
    </div>
  );
}

function NonStrengthNote({ dayType }: { dayType: "cardio" | "recovery" | "rest" }) {
  const msg = DAY_TYPE_MESSAGE[dayType];
  return (
    <div className="rounded-2xl border border-border bg-surface-soft p-4">
      <p className="font-serif-display text-base text-ink">{msg.title}</p>
      <p className="mt-1 text-sm text-ink-soft">{msg.body}</p>
      <Link href={msg.href} className="mt-2 inline-block text-sm font-semibold text-terracotta-deep">
        {msg.linkLabel} →
      </Link>
    </div>
  );
}

function VolumeTrendBanner({ trend }: { trend: VolumeTrend }) {
  if (trend.percentChange === null) {
    return (
      <div className="rounded-2xl bg-cream-soft px-4 py-3 text-sm text-ink-soft">
        Log a few sessions and this will show how your strength is trending week to week.
      </div>
    );
  }

  const up = trend.percentChange >= 0;
  const Icon = up ? TrendingUp : TrendingDown;

  return (
    <div
      className={cn(
        "flex items-center gap-3 rounded-2xl px-4 py-3",
        up ? "bg-sage-deep/15" : "bg-cream-soft",
      )}
    >
      <span
        className={cn(
          "flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full",
          up ? "bg-sage-deep/20 text-sage-deep" : "bg-blush/40 text-ink-soft",
        )}
      >
        <Icon size={18} />
      </span>
      <p className="text-sm text-ink">
        {up ? (
          <>
            You&apos;re lifting <span className="font-semibold">{Math.abs(trend.percentChange)}%</span>{" "}
            more than last week. Keep going.
          </>
        ) : (
          <>
            Down <span className="font-semibold">{Math.abs(trend.percentChange)}%</span> in volume from
            last week, that&apos;s alright, consistency matters more than any single week.
          </>
        )}
      </p>
    </div>
  );
}

function ExerciseCompareRow({ exercise }: { exercise: ExerciseCompare }) {
  const [isPending, startTransition] = useTransition();
  const [reps, setReps] = useState("10");
  const [weight, setWeight] = useState("");
  const [justLogged, setJustLogged] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const pattern = exercise.patternSlug
    ? MOVEMENT_PATTERNS.find((p) => p.slug === exercise.patternSlug)
    : null;

  const lastFormatted = exercise.lastSession ? formatSets(exercise.lastSession.sets) : null;
  const guidance = repGuidanceForPattern(exercise.patternSlug);

  function handleLog() {
    setErrorMessage(null);
    startTransition(async () => {
      try {
        await logProgramEntry({
          programId: exercise.programId,
          patternSlug: exercise.patternSlug,
          bundleId: exercise.bundleId,
          exerciseName: exercise.exerciseName,
          variant: exercise.variant,
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

  return (
    <div className="rounded-2xl border border-border bg-surface-soft p-4">
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="font-serif-display text-base text-ink">{exercise.exerciseName}</p>
          {pattern && <p className="text-xs text-ink-faint">{pattern.name}</p>}
          {guidance && (
            <p className="mt-0.5 text-xs text-ink-faint">
              Aim for {guidance.sets} sets · {guidance.reps} reps
            </p>
          )}
        </div>
        <VideoLink exerciseName={exercise.exerciseName} />
      </div>

      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        <div className="rounded-xl bg-surface p-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-ink-faint">
            Last session{exercise.lastSession ? ` · ${exercise.lastSession.date}` : ""}
          </p>
          {lastFormatted ? (
            <ul className="mt-1.5 space-y-1">
              {lastFormatted.map((line, i) => (
                <li key={i} className="text-sm text-ink">
                  Set {i + 1}: {line}
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-1.5 text-sm text-ink-faint">No previous session yet, this is the first.</p>
          )}
        </div>

        <div className="rounded-xl bg-surface p-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-ink-faint">This session</p>
          {exercise.todaySets.length > 0 ? (
            <div className="mt-1.5 space-y-1.5">
              {exercise.todaySets
                .slice()
                .sort((a, b) => a.setNumber - b.setNumber)
                .map((set) => (
                  <SetEditBox key={set.id} set={set} />
                ))}
            </div>
          ) : (
            <p className="mt-1.5 text-sm text-ink-faint">Nothing logged yet, beat last time above.</p>
          )}

          <div className="mt-2.5 flex flex-wrap items-center gap-2">
            <Input
              type="number"
              placeholder="Reps"
              value={reps}
              onChange={(e) => setReps(e.target.value)}
              className="w-16"
            />
            <Input
              type="number"
              placeholder="kg"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              className="w-20"
            />
            <Button size="sm" variant="outline" disabled={isPending} onClick={handleLog}>
              {isPending ? (
                "…"
              ) : justLogged ? (
                "Logged ✓"
              ) : (
                <span className="flex items-center gap-1">
                  <Plus size={13} /> Add set
                </span>
              )}
            </Button>
          </div>
          {errorMessage && <p className="mt-1.5 text-xs text-terracotta-deep">{errorMessage}</p>}
        </div>
      </div>
    </div>
  );
}

function SetEditBox({ set }: { set: SetEntry }) {
  const [isPending, startTransition] = useTransition();
  const [reps, setReps] = useState(set.reps !== null ? String(set.reps) : "");
  const [weight, setWeight] = useState(set.weightKg !== null ? String(set.weightKg) : "");
  const [saved, setSaved] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const dirty =
    reps !== (set.reps !== null ? String(set.reps) : "") ||
    weight !== (set.weightKg !== null ? String(set.weightKg) : "");

  function handleSave() {
    setErrorMessage(null);
    startTransition(async () => {
      try {
        await updateWorkoutSet({
          setId: set.id,
          reps: reps ? Number(reps) : null,
          weightKg: weight ? Number(weight) : null,
        });
        setSaved(true);
        setTimeout(() => setSaved(false), 1200);
      } catch {
        setErrorMessage("Couldn't save that, try again in a moment.");
      }
    });
  }

  function handleDelete() {
    setErrorMessage(null);
    startTransition(async () => {
      try {
        await deleteWorkoutSet(set.id);
      } catch {
        setErrorMessage("Couldn't delete that, try again in a moment.");
      }
    });
  }

  return (
    <div className="rounded-xl border border-border bg-cream-soft px-2.5 py-2">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-ink-faint">Set {set.setNumber}</span>
        <button
          onClick={handleDelete}
          disabled={isPending}
          aria-label={`Delete set ${set.setNumber}`}
          className="flex h-11 w-11 flex-shrink-0 items-center justify-center text-ink-faint hover:text-terracotta-deep disabled:opacity-50"
        >
          <Trash2 size={14} />
        </button>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <Input
          type="number"
          value={reps}
          onChange={(e) => setReps(e.target.value)}
          placeholder="Reps"
          className="w-16"
        />
        <Input
          type="number"
          value={weight}
          onChange={(e) => setWeight(e.target.value)}
          placeholder="kg"
          className="w-16"
        />
        {dirty && (
          <Button size="sm" variant="outline" disabled={isPending} onClick={handleSave}>
            {isPending ? "…" : saved ? "Saved ✓" : "Save"}
          </Button>
        )}
      </div>
      {errorMessage && <p className="mt-1 text-xs text-terracotta-deep">{errorMessage}</p>}
    </div>
  );
}
