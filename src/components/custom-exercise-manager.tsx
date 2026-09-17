"use client";

import { useState, useTransition } from "react";
import { Plus, X } from "lucide-react";
import {
  createBundle,
  deleteBundle,
  createCustomExercise,
  deleteCustomExercise,
} from "@/app/actions/exercises";
import { MOVEMENT_PATTERNS, type MovementVariant } from "@/lib/data/movement";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type Bundle = { id: string; name: string };
type CustomExercise = {
  id: string;
  name: string;
  patternSlug: string | null;
  bundleId: string | null;
  variant: MovementVariant | null;
};

export function CustomExerciseManager({
  bundles,
  customExercises,
}: {
  bundles: Bundle[];
  customExercises: CustomExercise[];
}) {
  const [isPending, startTransition] = useTransition();
  const [newBundleName, setNewBundleName] = useState("");
  const [exerciseName, setExerciseName] = useState("");
  const [homeType, setHomeType] = useState<"pattern" | "bundle">("pattern");
  const [patternSlug, setPatternSlug] = useState(MOVEMENT_PATTERNS[0].slug);
  const [bundleId, setBundleId] = useState<string>(bundles[0]?.id ?? "");
  const [variant, setVariant] = useState<MovementVariant>("bodyweight");

  function handleAddBundle() {
    const name = newBundleName.trim();
    if (!name) return;
    setNewBundleName("");
    startTransition(() => createBundle(name));
  }

  function handleAddExercise() {
    const name = exerciseName.trim();
    if (!name) return;
    if (homeType === "bundle" && !bundleId) return;
    setExerciseName("");
    startTransition(() =>
      createCustomExercise({
        name,
        patternSlug: homeType === "pattern" ? patternSlug : null,
        bundleId: homeType === "bundle" ? bundleId : null,
        variant,
      }),
    );
  }

  const bundleName = (id: string) => bundles.find((b) => b.id === id)?.name ?? "Uncategorized";
  const patternName = (slug: string) =>
    MOVEMENT_PATTERNS.find((p) => p.slug === slug)?.name ?? slug;

  return (
    <div className="space-y-6">
      <div>
        <p className="mb-2 text-sm font-medium text-ink-soft">
          Your own bundles (categories that don&apos;t fit the book&apos;s 8 patterns)
        </p>
        <div className="flex flex-wrap gap-2">
          {bundles.map((b) => (
            <span
              key={b.id}
              className="flex items-center gap-1.5 rounded-full bg-plum/15 px-3 py-1.5 text-xs font-medium text-ink"
            >
              {b.name}
              <button
                onClick={() => startTransition(() => deleteBundle(b.id))}
                aria-label={`Delete bundle ${b.name}`}
                className="text-ink-faint hover:text-terracotta-deep"
              >
                <X size={12} />
              </button>
            </span>
          ))}
        </div>
        <div className="mt-2 flex gap-2">
          <Input
            value={newBundleName}
            onChange={(e) => setNewBundleName(e.target.value)}
            placeholder="e.g. Pilates, Boxing, Climbing"
            className="max-w-xs"
          />
          <Button size="sm" variant="outline" disabled={isPending} onClick={handleAddBundle}>
            <Plus size={14} /> Bundle
          </Button>
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-surface-soft p-4">
        <p className="mb-3 text-sm font-medium text-ink-soft">Add your own exercise</p>
        <div className="space-y-3">
          <Input
            value={exerciseName}
            onChange={(e) => setExerciseName(e.target.value)}
            placeholder="Exercise name"
          />

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setHomeType("pattern")}
              className={cn(
                "rounded-full px-3 py-1 text-xs font-medium",
                homeType === "pattern" ? "bg-ink text-cream" : "bg-cream-soft text-ink-soft",
              )}
            >
              Under a movement pattern
            </button>
            <button
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
                key={v}
                onClick={() => setVariant(v)}
                className={cn(
                  "rounded-full px-3 py-1 text-xs font-medium",
                  variant === v ? "bg-terracotta text-white" : "bg-cream-soft text-ink-soft",
                )}
              >
                {v === "gym" ? "Gym" : v === "home-weights" ? "Home + weights" : "Bodyweight"}
              </button>
            ))}
          </div>

          <Button size="sm" disabled={isPending} onClick={handleAddExercise}>
            Add exercise
          </Button>
        </div>
      </div>

      {customExercises.length > 0 && (
        <div>
          <p className="mb-2 text-sm font-medium text-ink-soft">Your exercises</p>
          <ul className="space-y-1.5">
            {customExercises.map((ex) => (
              <li
                key={ex.id}
                className="flex items-center justify-between rounded-xl border border-border bg-surface-soft px-3 py-2 text-sm"
              >
                <span className="text-ink">
                  {ex.name}
                  <span className="ml-2 text-xs text-ink-faint">
                    {ex.bundleId ? bundleName(ex.bundleId) : patternName(ex.patternSlug ?? "")}
                  </span>
                </span>
                <button
                  onClick={() => startTransition(() => deleteCustomExercise(ex.id))}
                  aria-label={`Delete ${ex.name}`}
                  className="text-ink-faint hover:text-terracotta-deep"
                >
                  <X size={14} />
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
