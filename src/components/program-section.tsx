"use client";

import { useState, useTransition } from "react";
import { Plus, Trash2, ChevronDown, ChevronUp } from "lucide-react";
import {
  createProgram,
  deleteProgram,
  addProgramItem,
  removeProgramItem,
  logProgramEntry,
} from "@/app/actions/programs";
import { MOVEMENT_PATTERNS, type MovementVariant } from "@/lib/data/movement";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type RecentEntry = { date: string; reps: number | null; weightKg: number | null };

type ProgramItemView = {
  id: string;
  exerciseName: string;
  patternSlug: string | null;
  bundleId: string | null;
  variant: MovementVariant | null;
  recentEntries: RecentEntry[];
};

type ProgramView = {
  id: string;
  name: string;
  items: ProgramItemView[];
};

type Bundle = { id: string; name: string };
type CustomExercise = {
  id: string;
  name: string;
  patternSlug: string | null;
  bundleId: string | null;
  variant: MovementVariant | null;
};

export function ProgramSection({
  programs,
  bundles,
  customExercises,
}: {
  programs: ProgramView[];
  bundles: Bundle[];
  customExercises: CustomExercise[];
}) {
  const [isPending, startTransition] = useTransition();
  const [newProgramName, setNewProgramName] = useState("");

  function handleCreateProgram() {
    const name = newProgramName.trim();
    if (!name) return;
    setNewProgramName("");
    startTransition(() => createProgram(name));
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap gap-2">
        <Input
          value={newProgramName}
          onChange={(e) => setNewProgramName(e.target.value)}
          placeholder="e.g. My Strength Program"
          className="max-w-xs"
        />
        <Button size="sm" disabled={isPending} onClick={handleCreateProgram}>
          <Plus size={14} /> New program
        </Button>
      </div>

      {programs.length === 0 && (
        <p className="text-sm text-ink-faint">
          Build a program from whatever movements you actually want to do, then log
          against it right here over time.
        </p>
      )}

      {programs.map((program) => (
        <ProgramCard
          key={program.id}
          program={program}
          bundles={bundles}
          customExercises={customExercises}
        />
      ))}
    </div>
  );
}

function ProgramCard({
  program,
  bundles,
  customExercises,
}: {
  program: ProgramView;
  bundles: Bundle[];
  customExercises: CustomExercise[];
}) {
  const [isPending, startTransition] = useTransition();
  const [addingItem, setAddingItem] = useState(false);

  return (
    <div className="rounded-2xl border border-border bg-surface-soft p-4">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="font-serif-display text-base text-ink">{program.name}</h3>
        <button
          onClick={() => startTransition(() => deleteProgram(program.id))}
          aria-label={`Delete program ${program.name}`}
          className="text-ink-faint hover:text-terracotta-deep"
        >
          <Trash2 size={16} />
        </button>
      </div>

      {program.items.length > 0 && (
        <div className="mb-3 space-y-2">
          {program.items.map((item) => (
            <ProgramItemRow key={item.id} programId={program.id} item={item} />
          ))}
        </div>
      )}

      {addingItem ? (
        <AddItemForm
          programId={program.id}
          bundles={bundles}
          customExercises={customExercises}
          sortOrder={program.items.length}
          onDone={() => setAddingItem(false)}
        />
      ) : (
        <button
          onClick={() => setAddingItem(true)}
          disabled={isPending}
          className="flex items-center gap-1 text-xs font-semibold text-terracotta-deep"
        >
          <Plus size={14} /> Add a movement
        </button>
      )}
    </div>
  );
}

function AddItemForm({
  programId,
  bundles,
  customExercises,
  sortOrder,
  onDone,
}: {
  programId: string;
  bundles: Bundle[];
  customExercises: CustomExercise[];
  sortOrder: number;
  onDone: () => void;
}) {
  const [isPending, startTransition] = useTransition();
  const [source, setSource] = useState<"built-in" | "mine" | "custom">("built-in");
  const [patternSlug, setPatternSlug] = useState(MOVEMENT_PATTERNS[0].slug);
  const [variant, setVariant] = useState<MovementVariant>("bodyweight");
  const [builtInExercise, setBuiltInExercise] = useState(
    MOVEMENT_PATTERNS[0].exercises.bodyweight[0],
  );
  const [mineId, setMineId] = useState(customExercises[0]?.id ?? "");
  const [customName, setCustomName] = useState("");

  const pattern = MOVEMENT_PATTERNS.find((p) => p.slug === patternSlug)!;
  const bundleName = (id: string | null) => bundles.find((b) => b.id === id)?.name;

  function handleAdd() {
    let payload: {
      exerciseName: string;
      patternSlug: string | null;
      bundleId: string | null;
      variant: MovementVariant | null;
    } | null = null;

    if (source === "built-in") {
      payload = { exerciseName: builtInExercise, patternSlug, bundleId: null, variant };
    } else if (source === "mine") {
      const ex = customExercises.find((c) => c.id === mineId);
      if (!ex) return;
      payload = {
        exerciseName: ex.name,
        patternSlug: ex.patternSlug,
        bundleId: ex.bundleId,
        variant: ex.variant,
      };
    } else {
      const name = customName.trim();
      if (!name) return;
      payload = { exerciseName: name, patternSlug: null, bundleId: null, variant: null };
    }

    startTransition(() => addProgramItem({ programId, sortOrder, ...payload! }));
    onDone();
  }

  return (
    <div className="space-y-2.5 rounded-xl border border-dashed border-border p-3">
      <div className="flex flex-wrap gap-1.5">
        <button
          onClick={() => setSource("built-in")}
          className={cn(
            "rounded-full px-2.5 py-1 text-[11px] font-medium",
            source === "built-in" ? "bg-ink text-cream" : "bg-cream-soft text-ink-soft",
          )}
        >
          Book&apos;s movements
        </button>
        <button
          onClick={() => setSource("mine")}
          disabled={customExercises.length === 0}
          className={cn(
            "rounded-full px-2.5 py-1 text-[11px] font-medium disabled:opacity-40",
            source === "mine" ? "bg-ink text-cream" : "bg-cream-soft text-ink-soft",
          )}
        >
          My exercises
        </button>
        <button
          onClick={() => setSource("custom")}
          className={cn(
            "rounded-full px-2.5 py-1 text-[11px] font-medium",
            source === "custom" ? "bg-ink text-cream" : "bg-cream-soft text-ink-soft",
          )}
        >
          Type my own
        </button>
      </div>

      {source === "built-in" && (
        <div className="flex flex-wrap gap-2">
          <select
            value={patternSlug}
            onChange={(e) => {
              const slug = e.target.value as typeof patternSlug;
              setPatternSlug(slug);
              const p = MOVEMENT_PATTERNS.find((mp) => mp.slug === slug)!;
              setBuiltInExercise(p.exercises[variant][0] ?? p.exercises.bodyweight[0]);
            }}
            className="rounded-xl border border-border bg-surface px-3 py-1.5 text-sm text-ink"
          >
            {MOVEMENT_PATTERNS.map((p) => (
              <option key={p.slug} value={p.slug}>
                {p.name}
              </option>
            ))}
          </select>
          <select
            value={variant}
            onChange={(e) => {
              const v = e.target.value as MovementVariant;
              setVariant(v);
              setBuiltInExercise(pattern.exercises[v][0]);
            }}
            className="rounded-xl border border-border bg-surface px-3 py-1.5 text-sm text-ink"
          >
            <option value="gym">Gym</option>
            <option value="home-weights">Home + weights</option>
            <option value="bodyweight">Bodyweight</option>
          </select>
          <select
            value={builtInExercise}
            onChange={(e) => setBuiltInExercise(e.target.value)}
            className="w-full rounded-xl border border-border bg-surface px-3 py-1.5 text-sm text-ink"
          >
            {pattern.exercises[variant].map((ex) => (
              <option key={ex} value={ex}>
                {ex}
              </option>
            ))}
          </select>
        </div>
      )}

      {source === "mine" && (
        <select
          value={mineId}
          onChange={(e) => setMineId(e.target.value)}
          className="w-full rounded-xl border border-border bg-surface px-3 py-1.5 text-sm text-ink"
        >
          {customExercises.map((ex) => (
            <option key={ex.id} value={ex.id}>
              {ex.name} ({bundleName(ex.bundleId) ?? "pattern"})
            </option>
          ))}
        </select>
      )}

      {source === "custom" && (
        <Input
          value={customName}
          onChange={(e) => setCustomName(e.target.value)}
          placeholder="Exercise name"
        />
      )}

      <div className="flex gap-2">
        <Button size="sm" disabled={isPending} onClick={handleAdd}>
          Add to program
        </Button>
        <Button size="sm" variant="ghost" onClick={onDone}>
          Cancel
        </Button>
      </div>
    </div>
  );
}

function ProgramItemRow({
  programId,
  item,
}: {
  programId: string;
  item: ProgramItemView;
}) {
  const [isPending, startTransition] = useTransition();
  const [expanded, setExpanded] = useState(false);
  const [reps, setReps] = useState("10");
  const [weight, setWeight] = useState("");
  const [justLogged, setJustLogged] = useState(false);

  function handleLog() {
    startTransition(async () => {
      await logProgramEntry({
        programId,
        patternSlug: item.patternSlug,
        bundleId: item.bundleId,
        exerciseName: item.exerciseName,
        variant: item.variant,
        reps: reps ? Number(reps) : null,
        weightKg: weight ? Number(weight) : null,
      });
      setJustLogged(true);
      setTimeout(() => setJustLogged(false), 1500);
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
        <button
          onClick={() => startTransition(() => removeProgramItem(item.id))}
          aria-label={`Remove ${item.exerciseName}`}
          className="text-ink-faint hover:text-terracotta-deep"
        >
          <Trash2 size={14} />
        </button>
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

