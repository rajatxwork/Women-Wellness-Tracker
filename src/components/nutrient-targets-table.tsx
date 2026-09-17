"use client";

import { useState, useTransition } from "react";
import { Plus, Trash2 } from "lucide-react";
import {
  upsertNutrientTarget,
  deleteNutrientTarget,
} from "@/app/actions/nutrient-targets";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type TargetRow = {
  id: string;
  nutrientName: string;
  category: "macro" | "micro";
  targetAmount: number;
  unit: string;
};

export function NutrientTargetsTable({ targets }: { targets: TargetRow[] }) {
  const [isPending, startTransition] = useTransition();
  const [adding, setAdding] = useState(false);
  const [name, setName] = useState("");
  const [category, setCategory] = useState<"macro" | "micro">("micro");
  const [amount, setAmount] = useState("");
  const [unit, setUnit] = useState("mg");

  const macros = targets.filter((t) => t.category === "macro");
  const micros = targets.filter((t) => t.category === "micro");

  function handleAdd() {
    const n = name.trim();
    const amt = Number(amount);
    if (!n || !amt) return;
    startTransition(() =>
      upsertNutrientTarget({ nutrientName: n, category, targetAmount: amt, unit }),
    );
    setName("");
    setAmount("");
    setAdding(false);
  }

  if (targets.length === 0 && !adding) {
    return (
      <div>
        <p className="mb-3 text-sm text-ink-faint">
          Nothing here yet. Use the calculator above, or add your own rows below.
        </p>
        <Button size="sm" variant="outline" onClick={() => setAdding(true)}>
          <Plus size={14} /> Add a nutrient
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {macros.length > 0 && (
        <TargetGroup title="Macros" rows={macros} pending={isPending} />
      )}
      {micros.length > 0 && (
        <TargetGroup title="Micros" rows={micros} pending={isPending} />
      )}

      {adding ? (
        <div className="flex flex-wrap items-end gap-2 rounded-xl border border-dashed border-border p-3">
          <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Nutrient" className="max-w-[10rem]" />
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as "macro" | "micro")}
            className="rounded-2xl border border-border bg-surface-soft px-3 py-2 text-sm text-ink"
          >
            <option value="macro">Macro</option>
            <option value="micro">Micro</option>
          </select>
          <Input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Amount"
            className="w-24"
          />
          <Input value={unit} onChange={(e) => setUnit(e.target.value)} placeholder="Unit" className="w-20" />
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
          <Plus size={14} /> Add a nutrient
        </button>
      )}
    </div>
  );
}

function TargetGroup({
  title,
  rows,
  pending,
}: {
  title: string;
  rows: TargetRow[];
  pending: boolean;
}) {
  return (
    <div>
      <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-ink-faint">{title}</p>
      <div className="overflow-hidden rounded-xl border border-border">
        <table className="w-full text-sm">
          <tbody>
            {rows.map((row, i) => (
              <TargetRowView key={row.id} row={row} pending={pending} isLast={i === rows.length - 1} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function TargetRowView({
  row,
  pending,
  isLast,
}: {
  row: TargetRow;
  pending: boolean;
  isLast: boolean;
}) {
  const [, startTransition] = useTransition();
  const [amount, setAmount] = useState(String(row.targetAmount));

  function handleBlur() {
    const parsed = Number(amount);
    if (!parsed || parsed === row.targetAmount) return;
    startTransition(() =>
      upsertNutrientTarget({
        nutrientName: row.nutrientName,
        category: row.category,
        targetAmount: parsed,
        unit: row.unit,
      }),
    );
  }

  return (
    <tr className={cn(!isLast && "border-b border-border")}>
      <td className="px-3 py-2 text-ink">{row.nutrientName}</td>
      <td className="px-3 py-2">
        <div className="flex items-center gap-1.5">
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            onBlur={handleBlur}
            className="w-20 rounded-lg border border-border bg-surface-soft px-2 py-1 text-right text-ink"
          />
          <span className="text-xs text-ink-faint">{row.unit}</span>
        </div>
      </td>
      <td className="px-3 py-2 text-right">
        <button
          onClick={() => startTransition(() => deleteNutrientTarget(row.id))}
          disabled={pending}
          aria-label={`Remove ${row.nutrientName}`}
          className="text-ink-faint hover:text-terracotta-deep"
        >
          <Trash2 size={14} />
        </button>
      </td>
    </tr>
  );
}
