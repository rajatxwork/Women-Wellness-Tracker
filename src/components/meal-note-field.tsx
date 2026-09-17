"use client";

import { useState, useTransition } from "react";
import { saveMealNote } from "@/app/actions/nutrition";
import { Textarea } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function MealNoteField({ initialNote }: { initialNote: string }) {
  const [note, setNote] = useState(initialNote);
  const [isPending, startTransition] = useTransition();
  const [saved, setSaved] = useState(false);

  function save() {
    startTransition(async () => {
      await saveMealNote(note);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    });
  }

  return (
    <div>
      <Textarea
        value={note}
        onChange={(e) => setNote(e.target.value)}
        rows={3}
        placeholder="What did you eat today? Jot down anything worth remembering."
      />
      <Button onClick={save} disabled={isPending} size="sm" className="mt-3">
        {isPending ? "Saving…" : saved ? "Saved ✓" : "Save note"}
      </Button>
    </div>
  );
}
