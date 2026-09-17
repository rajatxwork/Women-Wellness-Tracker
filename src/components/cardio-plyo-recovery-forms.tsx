"use client";

import { useState, useTransition } from "react";
import { logCardio, logPlyo, logRecovery } from "@/app/actions/workout";
import { CARDIO_TYPES } from "@/lib/data/cardio";
import { PLYOMETRIC_SETS, PLYO_QUICK_TIP, type AgeBand } from "@/lib/data/plyometrics";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getCelebration } from "@/lib/encouragement";
import { cn } from "@/lib/utils";

export function CardioForm() {
  const [type, setType] = useState<"zone2" | "hiit">("zone2");
  const [duration, setDuration] = useState("30");
  const [isPending, startTransition] = useTransition();
  const [done, setDone] = useState(false);

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        {CARDIO_TYPES.map((c) => (
          <button
            key={c.type}
            onClick={() => setType(c.type)}
            className={cn(
              "rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors",
              type === c.type ? "bg-terracotta text-white" : "bg-cream-soft text-ink-soft",
            )}
          >
            {c.name}
          </button>
        ))}
      </div>
      <div className="flex items-center gap-2">
        <Input
          type="number"
          value={duration}
          onChange={(e) => setDuration(e.target.value)}
          className="w-24"
        />
        <span className="text-sm text-ink-soft">minutes</span>
      </div>
      <Button
        size="sm"
        disabled={isPending}
        onClick={() =>
          startTransition(async () => {
            await logCardio({ cardioType: type, durationMinutes: Number(duration) || 0 });
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

export function PlyoForm({ defaultAgeBand }: { defaultAgeBand: AgeBand }) {
  const [ageBand, setAgeBand] = useState<AgeBand>(defaultAgeBand);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [isPending, startTransition] = useTransition();
  const [done, setDone] = useState(false);

  const set = PLYOMETRIC_SETS.find((s) => s.ageBand === ageBand)!;

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
      <div className="flex gap-2">
        {PLYOMETRIC_SETS.map((s) => (
          <button
            key={s.ageBand}
            onClick={() => setAgeBand(s.ageBand)}
            className={cn(
              "rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors",
              ageBand === s.ageBand ? "bg-terracotta text-white" : "bg-cream-soft text-ink-soft",
            )}
          >
            {s.label}
          </button>
        ))}
      </div>
      <p className="text-xs text-ink-soft">{set.focus}</p>
      <div className="space-y-1.5">
        {set.exercises.map((ex) => (
          <button
            key={ex.name}
            onClick={() => toggle(ex.name)}
            className={cn(
              "block w-full rounded-xl border px-3 py-2 text-left text-sm transition-colors",
              selected.has(ex.name)
                ? "border-sage-deep bg-sage-deep/10 text-ink"
                : "border-border bg-surface-soft text-ink-soft",
            )}
          >
            <span className="font-medium text-ink">{ex.name}</span>, {ex.detail}
          </button>
        ))}
      </div>
      <p className="text-xs text-ink-faint">{PLYO_QUICK_TIP}</p>
      <Button
        size="sm"
        disabled={isPending || selected.size === 0}
        onClick={() =>
          startTransition(async () => {
            await logPlyo({ ageBand, exercisesCompleted: Array.from(selected) });
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
  const [isPending, startTransition] = useTransition();
  const [done, setDone] = useState(false);

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        {RECOVERY_ACTIVITIES.map((a) => (
          <button
            key={a.key}
            onClick={() => setActivity(a.key)}
            className={cn(
              "rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors",
              activity === a.key ? "bg-sage-deep text-white" : "bg-cream-soft text-ink-soft",
            )}
          >
            {a.label}
          </button>
        ))}
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
        </div>
      )}
      <Button
        size="sm"
        variant="secondary"
        disabled={isPending}
        onClick={() =>
          startTransition(async () => {
            await logRecovery({
              activityType: activity,
              durationMinutes: activity === "rest" ? undefined : Number(duration) || undefined,
            });
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
