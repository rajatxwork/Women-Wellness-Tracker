"use client";

import { useState, useTransition } from "react";
import { Check, Plus, Trash2 } from "lucide-react";
import { createSupplement, deleteSupplement, toggleSupplementLog } from "@/app/actions/supplements";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getEmptyState } from "@/lib/encouragement";
import { cn } from "@/lib/utils";

type SupplementItem = {
  id: string;
  name: string;
  dosage: string | null;
  takenToday: boolean;
};

export function SupplementTracker({ supplements }: { supplements: SupplementItem[] }) {
  const [isPending, startTransition] = useTransition();
  const [adding, setAdding] = useState(false);
  const [name, setName] = useState("");
  const [dosage, setDosage] = useState("");

  function handleAdd() {
    const n = name.trim();
    if (!n) return;
    startTransition(() => createSupplement(n, dosage.trim(), ""));
    setName("");
    setDosage("");
    setAdding(false);
  }

  return (
    <div className="space-y-3">
      {supplements.length === 0 && !adding && (
        <p className="text-sm text-ink-faint">{getEmptyState()}</p>
      )}

      <ul className="space-y-2">
        {supplements.map((s) => (
          <li
            key={s.id}
            className="flex items-center gap-3 rounded-2xl border border-border bg-surface-soft px-3.5 py-2.5"
          >
            <button
              onClick={() => startTransition(() => toggleSupplementLog(s.id))}
              disabled={isPending}
              className={cn(
                "flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full border-2 transition-all",
                s.takenToday
                  ? "border-sage-deep bg-sage-deep text-white"
                  : "border-border text-transparent",
              )}
            >
              <Check size={14} strokeWidth={3} />
            </button>
            <div className="min-w-0 flex-1">
              <p className={cn("text-sm", s.takenToday ? "text-ink-faint line-through" : "text-ink")}>
                {s.name}
              </p>
              {s.dosage && <p className="text-xs text-ink-faint">{s.dosage}</p>}
            </div>
            <button
              onClick={() => startTransition(() => deleteSupplement(s.id))}
              aria-label={`Remove ${s.name}`}
              className="text-ink-faint hover:text-terracotta-deep"
            >
              <Trash2 size={14} />
            </button>
          </li>
        ))}
      </ul>

      {adding ? (
        <div className="flex flex-wrap items-end gap-2 rounded-xl border border-dashed border-border p-3">
          <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Supplement name" />
          <Input value={dosage} onChange={(e) => setDosage(e.target.value)} placeholder="Dosage (optional)" className="w-40" />
          <Button size="sm" disabled={isPending} onClick={handleAdd}>
            Add
          </Button>
          <Button size="sm" variant="ghost" onClick={() => setAdding(false)}>
            Cancel
          </Button>
        </div>
      ) : (
        <button
          onClick={() => setAdding(true)}
          className="flex items-center gap-1 text-xs font-semibold text-terracotta-deep"
        >
          <Plus size={14} /> Add a supplement
        </button>
      )}
    </div>
  );
}
