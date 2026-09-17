"use client";

import { useState, useTransition } from "react";
import { logSymptoms } from "@/app/actions/cycle";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/input";

const SLIDERS: { key: "cramps" | "bloating" | "mood" | "energy"; label: string }[] = [
  { key: "cramps", label: "Cramps" },
  { key: "bloating", label: "Bloating" },
  { key: "mood", label: "Mood" },
  { key: "energy", label: "Energy" },
];

export function SymptomLogForm({
  initial,
}: {
  initial: {
    cramps: number | null;
    bloating: number | null;
    mood: number | null;
    energy: number | null;
    notes: string | null;
  } | null;
}) {
  const [values, setValues] = useState({
    cramps: initial?.cramps ?? 1,
    bloating: initial?.bloating ?? 1,
    mood: initial?.mood ?? 3,
    energy: initial?.energy ?? 3,
  });
  const [notes, setNotes] = useState(initial?.notes ?? "");
  const [isPending, startTransition] = useTransition();
  const [saved, setSaved] = useState(false);

  function handleSave() {
    startTransition(async () => {
      await logSymptoms({ ...values, notes });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    });
  }

  return (
    <div className="space-y-5">
      {SLIDERS.map(({ key, label }) => (
        <div key={key}>
          <div className="mb-1.5 flex items-center justify-between text-sm">
            <span className="font-medium text-ink-soft">{label}</span>
            <span className="text-ink-faint">{values[key]}/5</span>
          </div>
          <input
            type="range"
            min={1}
            max={5}
            value={values[key]}
            onChange={(e) =>
              setValues((v) => ({ ...v, [key]: Number(e.target.value) }))
            }
            className="h-2 w-full cursor-pointer appearance-none rounded-full bg-cream-soft accent-terracotta"
          />
        </div>
      ))}

      <div>
        <label className="mb-1.5 block text-sm font-medium text-ink-soft">
          Anything else worth noting?
        </label>
        <Textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={2}
          placeholder="Optional"
        />
      </div>

      <Button onClick={handleSave} disabled={isPending} size="sm">
        {isPending ? "Saving…" : saved ? "Saved ✓" : "Save today's log"}
      </Button>
    </div>
  );
}
