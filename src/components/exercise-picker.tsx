"use client";

import { useMemo, useState, useTransition } from "react";
import { Search, Plus } from "lucide-react";
import { MOVEMENT_PATTERNS, type MovementVariant } from "@/lib/data/movement";
import { createCustomExercise } from "@/app/actions/exercises";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { VideoLink } from "@/components/video-link";
import { cn } from "@/lib/utils";

export type PickedExercise = {
  exerciseName: string;
  patternSlug: string | null;
  bundleId: string | null;
  variant: MovementVariant | null;
  isBookExercise: boolean;
};

type Bundle = { id: string; name: string };
type CustomExercise = {
  id: string;
  name: string;
  patternSlug: string | null;
  bundleId: string | null;
  variant: MovementVariant | null;
};

const ALL_BOOK_EXERCISES: { name: string; patternSlug: string; variant: MovementVariant }[] =
  MOVEMENT_PATTERNS.flatMap((pattern) =>
    (["gym", "home-weights", "bodyweight"] as MovementVariant[]).flatMap((variant) =>
      pattern.exercises[variant].map((name) => ({ name, patternSlug: pattern.slug, variant })),
    ),
  );

const VARIANT_LABEL: Record<MovementVariant, string> = {
  gym: "Gym",
  "home-weights": "Home + weights",
  bodyweight: "Bodyweight",
};

// Movement-first exercise search: pick from the book's full exercise list
// or your own, and the movement pattern comes along with it automatically.
// Nothing matching your search yet? Add it as a new custom exercise and
// tag it under a pattern (or your own bundle) yourself, right here.
export function ExercisePicker({
  customExercises,
  bundles,
  onSelect,
  placeholder = "Search exercises, e.g. \"squat\"",
}: {
  customExercises: CustomExercise[];
  bundles: Bundle[];
  onSelect: (result: PickedExercise) => void;
  placeholder?: string;
}) {
  const [query, setQuery] = useState("");
  const [showAddNew, setShowAddNew] = useState(false);

  const patternName = (slug: string) => MOVEMENT_PATTERNS.find((p) => p.slug === slug)?.name ?? slug;
  const bundleName = (id: string | null) => bundles.find((b) => b.id === id)?.name;

  const matches = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return { book: [], custom: [] };
    return {
      book: ALL_BOOK_EXERCISES.filter((e) => e.name.toLowerCase().includes(q)).slice(0, 6),
      custom: customExercises.filter((e) => e.name.toLowerCase().includes(q)).slice(0, 6),
    };
  }, [query, customExercises]);

  const hasResults = matches.book.length > 0 || matches.custom.length > 0;

  function pickBook(e: { name: string; patternSlug: string; variant: MovementVariant }) {
    onSelect({
      exerciseName: e.name,
      patternSlug: e.patternSlug,
      bundleId: null,
      variant: e.variant,
      isBookExercise: true,
    });
    setQuery("");
  }

  function pickCustom(e: CustomExercise) {
    onSelect({
      exerciseName: e.name,
      patternSlug: e.patternSlug,
      bundleId: e.bundleId,
      variant: e.variant,
      isBookExercise: false,
    });
    setQuery("");
  }

  return (
    <div className="space-y-2">
      <div className="relative">
        <Search size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-faint" />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          className="pl-10"
        />
      </div>

      {query.trim() && (
        <div className="rounded-2xl border border-border bg-surface-soft p-2">
          {hasResults ? (
            <ul className="space-y-1">
              {matches.custom.map((e) => (
                <li key={e.id}>
                  <button
                    type="button"
                    onClick={() => pickCustom(e)}
                    className="flex min-h-11 w-full items-center justify-between rounded-xl px-2.5 py-1.5 text-left text-sm text-ink hover:bg-surface"
                  >
                    <span>{e.name}</span>
                    <span className="text-xs text-ink-faint">
                      {e.bundleId ? bundleName(e.bundleId) : e.patternSlug ? patternName(e.patternSlug) : "Yours"}
                    </span>
                  </button>
                </li>
              ))}
              {matches.book.map((e) => (
                <li key={`${e.patternSlug}-${e.variant}-${e.name}`}>
                  <button
                    type="button"
                    onClick={() => pickBook(e)}
                    className="flex min-h-11 w-full items-center justify-between rounded-xl px-2.5 py-1.5 text-left text-sm text-ink hover:bg-surface"
                  >
                    <span>{e.name}</span>
                    <span className="text-xs text-ink-faint">
                      {patternName(e.patternSlug)} · {VARIANT_LABEL[e.variant]}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="px-2.5 py-1.5 text-sm text-ink-faint">No matches, add it as your own below.</p>
          )}
        </div>
      )}

      {showAddNew ? (
        <AddNewExercise
          initialName={query}
          bundles={bundles}
          onDone={(result) => {
            onSelect(result);
            setQuery("");
            setShowAddNew(false);
          }}
          onCancel={() => setShowAddNew(false)}
        />
      ) : (
        <button
          type="button"
          onClick={() => setShowAddNew(true)}
          className="flex min-h-11 items-center gap-1.5 text-xs font-semibold text-terracotta-deep"
        >
          <Plus size={14} /> Can&apos;t find it? Add your own
        </button>
      )}
    </div>
  );
}

function AddNewExercise({
  initialName,
  bundles,
  onDone,
  onCancel,
}: {
  initialName: string;
  bundles: Bundle[];
  onDone: (result: PickedExercise) => void;
  onCancel: () => void;
}) {
  const [isPending, startTransition] = useTransition();
  const [name, setName] = useState(initialName);
  const [homeType, setHomeType] = useState<"pattern" | "bundle">("pattern");
  const [patternSlug, setPatternSlug] = useState(MOVEMENT_PATTERNS[0].slug);
  const [bundleId, setBundleId] = useState<string>(bundles[0]?.id ?? "");
  const [variant, setVariant] = useState<MovementVariant>("bodyweight");

  function handleAdd() {
    const trimmed = name.trim();
    if (!trimmed) return;
    if (homeType === "bundle" && !bundleId) return;

    const patternSlugToSave = homeType === "pattern" ? patternSlug : null;
    const bundleIdToSave = homeType === "bundle" ? bundleId : null;

    startTransition(async () => {
      await createCustomExercise({
        name: trimmed,
        patternSlug: patternSlugToSave,
        bundleId: bundleIdToSave,
        variant,
      });
      onDone({
        exerciseName: trimmed,
        patternSlug: patternSlugToSave,
        bundleId: bundleIdToSave,
        variant,
        isBookExercise: false,
      });
    });
  }

  return (
    <div className="space-y-2.5 rounded-2xl border border-dashed border-border p-3">
      <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Exercise name" />

      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => setHomeType("pattern")}
          className={cn(
            "rounded-full px-3 py-1 text-xs font-medium",
            homeType === "pattern" ? "bg-ink text-cream" : "bg-cream-soft text-ink-soft",
          )}
        >
          Under a movement pattern
        </button>
        <button
          type="button"
          onClick={() => setHomeType("bundle")}
          disabled={bundles.length === 0}
          className={cn(
            "rounded-full px-3 py-1 text-xs font-medium disabled:opacity-40",
            homeType === "bundle" ? "bg-ink text-cream" : "bg-cream-soft text-ink-soft",
          )}
        >
          Under my own bundle
        </button>
      </div>

      {homeType === "pattern" ? (
        <select
          value={patternSlug}
          onChange={(e) => setPatternSlug(e.target.value as typeof patternSlug)}
          className="w-full rounded-2xl border border-border bg-surface px-4 py-2 text-sm text-ink"
        >
          {MOVEMENT_PATTERNS.map((p) => (
            <option key={p.slug} value={p.slug}>
              {p.name}
            </option>
          ))}
        </select>
      ) : (
        <select
          value={bundleId}
          onChange={(e) => setBundleId(e.target.value)}
          className="w-full rounded-2xl border border-border bg-surface px-4 py-2 text-sm text-ink"
        >
          {bundles.map((b) => (
            <option key={b.id} value={b.id}>
              {b.name}
            </option>
          ))}
        </select>
      )}

      <div className="flex flex-wrap gap-2">
        {(["gym", "home-weights", "bodyweight"] as MovementVariant[]).map((v) => (
          <button
            type="button"
            key={v}
            onClick={() => setVariant(v)}
            className={cn(
              "rounded-full px-3 py-1 text-xs font-medium",
              variant === v ? "bg-terracotta text-white" : "bg-cream-soft text-ink-soft",
            )}
          >
            {VARIANT_LABEL[v]}
          </button>
        ))}
      </div>

      <div className="flex items-center gap-2">
        <Button size="sm" disabled={isPending} onClick={handleAdd}>
          Add exercise
        </Button>
        <Button size="sm" variant="ghost" onClick={onCancel}>
          Cancel
        </Button>
        {name.trim() && <VideoLink exerciseName={name.trim()} />}
      </div>
    </div>
  );
}
