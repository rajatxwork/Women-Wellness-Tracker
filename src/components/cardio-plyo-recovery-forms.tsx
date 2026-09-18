"use client";

import { useMemo, useState, useTransition } from "react";
import { logCardio, logPlyo, logRecovery } from "@/app/actions/workout";
import { CARDIO_TYPES } from "@/lib/data/cardio";
import { PLYOMETRIC_SETS, PLYO_QUICK_TIP, type AgeBand } from "@/lib/data/plyometrics";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import { VideoLink } from "@/components/video-link";
import { getCelebration } from "@/lib/encouragement";
import { cn } from "@/lib/utils";

const OTHER_VALUE = "__other__";

export function CardioForm() {
  const [type, setType] = useState<"zone2" | "hiit">("zone2");
  const [activity, setActivity] = useState<string>(CARDIO_TYPES[0].examples[0]);
  const [customActivity, setCustomActivity] = useState("");
  const [duration, setDuration] = useState("30");
  const [isPending, startTransition] = useTransition();
  const [done, setDone] = useState(false);

  const cardioType = CARDIO_TYPES.find((c) => c.type === type)!;
  const isOther = activity === OTHER_VALUE;
  const activityLabel = isOther ? customActivity.trim() : activity;

  function handleTypeChange(next: "zone2" | "hiit") {
    setType(next);
    const opts = CARDIO_TYPES.find((c) => c.type === next)!;
    setActivity(opts.examples[0]);
  }

  return (
    <div className="space-y-3">
      <div>
        <Label htmlFor="cardio-type">Type</Label>
        <select
          id="cardio-type"
          value={type}
          onChange={(e) => handleTypeChange(e.target.value as "zone2" | "hiit")}
          className="w-full rounded-2xl border border-border bg-surface px-4 py-2.5 text-sm text-ink"
        >
          {CARDIO_TYPES.map((c) => (
            <option key={c.type} value={c.type}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <Label htmlFor="cardio-activity">What did you do?</Label>
        <select
          id="cardio-activity"
          value={activity}
          onChange={(e) => setActivity(e.target.value)}
          className="w-full rounded-2xl border border-border bg-surface px-4 py-2.5 text-sm text-ink"
        >
          {cardioType.examples.map((ex) => (
            <option key={ex} value={ex}>
              {ex}
            </option>
          ))}
          <option value={OTHER_VALUE}>Other (type your own)</option>
        </select>
      </div>

      {isOther && (
        <Input
          value={customActivity}
          onChange={(e) => setCustomActivity(e.target.value)}
          placeholder="What did you do?"
        />
      )}

      <div className="flex items-center gap-2">
        <Input
          type="number"
          value={duration}
          onChange={(e) => setDuration(e.target.value)}
          className="w-24"
        />
        <span className="text-sm text-ink-soft">minutes</span>
        {!isOther && <VideoLink exerciseName={activity} />}
      </div>

      <Button
        size="sm"
        disabled={isPending || (isOther && !customActivity.trim())}
        onClick={() =>
          startTransition(async () => {
            await logCardio({
              cardioType: type,
              durationMinutes: Number(duration) || 0,
              notes: activityLabel || undefined,
            });
            setDone(true);
            setTimeout(() => setDone(false), 2000);
          })
        }
      >
        {isPending ? "Logging…" : "Log cardio"}
      </Button>
      {done && <p className="text-sm text-sage-deep">{getCelebration()}</p>}
    </div>
  );
}

export function PlyoForm({ ageBand }: { ageBand: AgeBand | null }) {
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [isPending, startTransition] = useTransition();
  const [done, setDone] = useState(false);

  const set = useMemo(
    () => PLYOMETRIC_SETS.find((s) => s.ageBand === (ageBand ?? "20s-30s"))!,
    [ageBand],
  );

  function toggle(name: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(name)) next.delete(name);
      else next.add(name);
      return next;
    });
  }

  return (
    <div className="space-y-3">
      {!ageBand && (
        <p className="rounded-xl bg-cream-soft px-3 py-2 text-xs text-ink-soft">
          Set your age range in your training profile above for exercises matched to your stage of
          life, showing {set.label} for now.
        </p>
      )}
      <p className="text-xs text-ink-soft">{set.focus}</p>
      <div className="space-y-1.5">
        {set.exercises.map((ex) => (
          <div
            key={ex.name}
            className={cn(
              "flex items-center justify-between gap-2 rounded-xl border px-3 py-2 transition-colors",
              selected.has(ex.name) ? "border-sage-deep bg-sage-deep/10" : "border-border bg-surface-soft",
            )}
          >
            <button
              onClick={() => toggle(ex.name)}
              className="flex-1 text-left text-sm text-ink-soft"
            >
              <span className="font-medium text-ink">{ex.name}</span>, {ex.detail}
            </button>
            <VideoLink exerciseName={ex.name} />
          </div>
        ))}
      </div>
      <p className="text-xs text-ink-faint">{PLYO_QUICK_TIP}</p>
      <Button
        size="sm"
        disabled={isPending || selected.size === 0}
        onClick={() =>
          startTransition(async () => {
            await logPlyo({ ageBand: ageBand ?? "20s-30s", exercisesCompleted: Array.from(selected) });
            setSelected(new Set());
            setDone(true);
            setTimeout(() => setDone(false), 2000);
          })
        }
      >
        {isPending ? "Logging…" : "Log plyometrics"}
      </Button>
      {done && <p className="text-sm text-sage-deep">{getCelebration()}</p>}
    </div>
  );
}

const RECOVERY_ACTIVITIES: { key: "walking" | "foam-rolling" | "mobility" | "yoga" | "rest"; label: string }[] = [
  { key: "walking", label: "Walking" },
  { key: "foam-rolling", label: "Foam rolling" },
  { key: "mobility", label: "Mobility" },
  { key: "yoga", label: "Yoga / pilates" },
  { key: "rest", label: "Full rest" },
];

export function RecoveryForm() {
  const [activity, setActivity] = useState<(typeof RECOVERY_ACTIVITIES)[number]["key"]>("walking");
  const [duration, setDuration] = useState("20");
  const [notes, setNotes] = useState("");
  const [isPending, startTransition] = useTransition();
  const [done, setDone] = useState(false);

  const activityLabel = RECOVERY_ACTIVITIES.find((a) => a.key === activity)!.label;

  return (
    <div className="space-y-3">
      <div>
        <Label htmlFor="recovery-activity">What did you do?</Label>
        <select
          id="recovery-activity"
          value={activity}
          onChange={(e) => setActivity(e.target.value as typeof activity)}
          className="w-full rounded-2xl border border-border bg-surface px-4 py-2.5 text-sm text-ink"
        >
          {RECOVERY_ACTIVITIES.map((a) => (
            <option key={a.key} value={a.key}>
              {a.label}
            </option>
          ))}
        </select>
      </div>

      {activity !== "rest" && (
        <div className="flex items-center gap-2">
          <Input
            type="number"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            className="w-24"
          />
          <span className="text-sm text-ink-soft">minutes</span>
          <VideoLink exerciseName={activityLabel} />
        </div>
      )}

      <Input
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        placeholder="Any details? (optional)"
      />

      <Button
        size="sm"
        variant="secondary"
        disabled={isPending}
        onClick={() =>
          startTransition(async () => {
            await logRecovery({
              activityType: activity,
              durationMinutes: activity === "rest" ? undefined : Number(duration) || undefined,
              notes: notes.trim() || undefined,
            });
            setNotes("");
            setDone(true);
            setTimeout(() => setDone(false), 2000);
          })
        }
      >
        {isPending ? "Logging…" : "Log recovery"}
      </Button>
      {done && <p className="text-sm text-sage-deep">{getCelebration()}</p>}
    </div>
  );
}
