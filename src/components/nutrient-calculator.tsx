"use client";

import { useState, useTransition } from "react";
import {
  ACTIVITY_MULTIPLIERS,
  MICRONUTRIENT_RDA,
  calculateTargets,
  type ActivityLevel,
  type NutritionGoal,
  type CalculatorResult,
} from "@/lib/nutrient-science";
import { bulkUpsertNutrientTargets } from "@/app/actions/nutrient-targets";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export function NutrientCalculator() {
  const [units, setUnits] = useState<"metric" | "imperial">("metric");
  const [heightCm, setHeightCm] = useState("165");
  const [heightFt, setHeightFt] = useState("5");
  const [heightIn, setHeightIn] = useState("5");
  const [weightKg, setWeightKg] = useState("65");
  const [weightLb, setWeightLb] = useState("143");
  const [age, setAge] = useState("30");
  const [activityLevel, setActivityLevel] = useState<ActivityLevel>("moderate");
  const [goal, setGoal] = useState<NutritionGoal>("maintain");
  const [result, setResult] = useState<CalculatorResult | null>(null);
  const [isPending, startTransition] = useTransition();
  const [saved, setSaved] = useState(false);

  function handleCalculate() {
    const h =
      units === "metric"
        ? Number(heightCm)
        : (Number(heightFt) * 12 + Number(heightIn)) * 2.54;
    const w = units === "metric" ? Number(weightKg) : Number(weightLb) * 0.453592;
    const a = Number(age);

    if (!h || !w || !a) return;

    setResult(calculateTargets({ heightCm: h, weightKg: w, age: a, activityLevel, goal }));
    setSaved(false);
  }

  function handleApply() {
    if (!result) return;
    const a = Number(age);

    const rows = [
      { nutrientName: "Calories", category: "macro" as const, targetAmount: result.calorieTarget, unit: "kcal" },
      {
        nutrientName: "Protein",
        category: "macro" as const,
        targetAmount: Math.round((result.proteinLowG + result.proteinHighG) / 2),
        unit: "g",
      },
      { nutrientName: "Fat", category: "macro" as const, targetAmount: result.fatG, unit: "g" },
      { nutrientName: "Carbohydrates", category: "macro" as const, targetAmount: result.carbG, unit: "g" },
      { nutrientName: "Fiber", category: "macro" as const, targetAmount: result.fiberG, unit: "g" },
      ...MICRONUTRIENT_RDA.map((m) => ({
        nutrientName: m.name,
        category: "micro" as const,
        targetAmount: m.rda(a),
        unit: m.unit,
      })),
    ];

    startTransition(async () => {
      await bulkUpsertNutrientTargets(rows);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    });
  }

  return (
    <div className="space-y-5">
      <div className="flex gap-2">
        {(["metric", "imperial"] as const).map((u) => (
          <button
            key={u}
            onClick={() => setUnits(u)}
            className={cn(
              "rounded-full px-3 py-1 text-xs font-medium",
              units === u ? "bg-ink text-cream" : "bg-cream-soft text-ink-soft",
            )}
          >
            {u === "metric" ? "cm / kg" : "ft-in / lb"}
          </button>
        ))}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label>Height</Label>
          {units === "metric" ? (
            <Input type="number" value={heightCm} onChange={(e) => setHeightCm(e.target.value)} placeholder="cm" />
          ) : (
            <div className="flex gap-2">
              <Input type="number" value={heightFt} onChange={(e) => setHeightFt(e.target.value)} placeholder="ft" />
              <Input type="number" value={heightIn} onChange={(e) => setHeightIn(e.target.value)} placeholder="in" />
            </div>
          )}
        </div>
        <div>
          <Label>Weight</Label>
          {units === "metric" ? (
            <Input type="number" value={weightKg} onChange={(e) => setWeightKg(e.target.value)} placeholder="kg" />
          ) : (
            <Input type="number" value={weightLb} onChange={(e) => setWeightLb(e.target.value)} placeholder="lb" />
          )}
        </div>
        <div>
          <Label>Age</Label>
          <Input type="number" value={age} onChange={(e) => setAge(e.target.value)} />
        </div>
        <div>
          <Label>Activity level</Label>
          <select
            value={activityLevel}
            onChange={(e) => setActivityLevel(e.target.value as ActivityLevel)}
            className="w-full rounded-2xl border border-border bg-surface-soft px-4 py-2.5 text-sm text-ink"
          >
            {Object.entries(ACTIVITY_MULTIPLIERS).map(([key, v]) => (
              <option key={key} value={key}>
                {v.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <Label>Your goal</Label>
        <div className="flex flex-wrap gap-2">
          {(
            [
              { key: "maintain", label: "Maintain" },
              { key: "fat-loss", label: "Fat loss" },
              { key: "muscle-gain", label: "Muscle gain" },
            ] as { key: NutritionGoal; label: string }[]
          ).map((g) => (
            <button
              key={g.key}
              onClick={() => setGoal(g.key)}
              className={cn(
                "rounded-full px-3.5 py-1.5 text-sm font-medium",
                goal === g.key ? "bg-terracotta text-white" : "bg-cream-soft text-ink-soft",
              )}
            >
              {g.label}
            </button>
          ))}
        </div>
      </div>

      <Button size="sm" onClick={handleCalculate}>
        Calculate my targets
      </Button>

      {result && (
        <div className="space-y-4 rounded-2xl border border-border bg-surface-soft p-4">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            <Stat label="Calories" value={`${result.calorieTarget}`} unit="kcal/day" />
            <Stat
              label="Protein"
              value={`${result.proteinLowG}–${result.proteinHighG}`}
              unit="g/day"
            />
            <Stat label="Fat" value={`${result.fatG}`} unit="g/day" />
            <Stat label="Carbohydrates" value={`${result.carbG}`} unit="g/day" />
            <Stat label="Fiber" value={`${result.fiberG}`} unit="g/day" />
            <Stat label="Water" value={`${(result.waterMl / 1000).toFixed(1)}`} unit="L/day" />
          </div>

          <p className="text-xs text-ink-faint">
            Based on the Mifflin-St Jeor equation and National Academies dietary
            reference intakes for adult women. This is general, educational guidance,
            not a personalized medical recommendation. Worth checking with a doctor or
            registered dietitian for anything that matters medically.
          </p>

          <Button size="sm" variant="outline" disabled={isPending} onClick={handleApply}>
            {isPending ? "Adding…" : saved ? "Added to your table ✓" : "Add to my targets table"}
          </Button>
        </div>
      )}
    </div>
  );
}

function Stat({ label, value, unit }: { label: string; value: string; unit: string }) {
  return (
    <div>
      <p className="text-xs text-ink-faint">{label}</p>
      <p className="font-serif-display text-lg text-ink">{value}</p>
      <p className="text-[11px] text-ink-faint">{unit}</p>
    </div>
  );
}
