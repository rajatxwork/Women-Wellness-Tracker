// General, educational nutrient guidance for adult women, not medical advice.
// Calorie and macro math uses the Mifflin-St Jeor equation (the most
// validated resting metabolic rate formula in current use) and standard
// activity multipliers. Micronutrient targets are the U.S. National
// Academies' Dietary Reference Intakes (DRI), as summarized by the NIH
// Office of Dietary Supplements consumer fact sheets. These are population
// level reference values, not a personalized prescription. Pregnancy,
// lactation, and diagnosed conditions all shift these numbers and are not
// accounted for here. Always suggest checking with a doctor or registered
// dietitian for anything that matters medically.

export type ActivityLevel = "sedentary" | "light" | "moderate" | "active" | "very-active";
export type NutritionGoal = "maintain" | "fat-loss" | "muscle-gain";

export const ACTIVITY_MULTIPLIERS: Record<ActivityLevel, { label: string; multiplier: number }> = {
  sedentary: { label: "Sedentary (little to no exercise)", multiplier: 1.2 },
  light: { label: "Light (exercise 1 to 3 days a week)", multiplier: 1.375 },
  moderate: { label: "Moderate (exercise 3 to 5 days a week)", multiplier: 1.55 },
  active: { label: "Active (exercise 6 to 7 days a week)", multiplier: 1.725 },
  "very-active": { label: "Very active (hard training or a physical job)", multiplier: 1.9 },
};

export type CalculatorInput = {
  heightCm: number;
  weightKg: number;
  age: number;
  activityLevel: ActivityLevel;
  goal: NutritionGoal;
};

export type CalculatorResult = {
  bmr: number;
  tdee: number;
  calorieTarget: number;
  proteinLowG: number;
  proteinHighG: number;
  fatG: number;
  carbG: number;
  fiberG: number;
  waterMl: number;
};

export function calculateTargets(input: CalculatorInput): CalculatorResult {
  const { heightCm, weightKg, age, activityLevel, goal } = input;

  const bmr = 10 * weightKg + 6.25 * heightCm - 5 * age - 161;
  const tdee = bmr * ACTIVITY_MULTIPLIERS[activityLevel].multiplier;

  const calorieTarget =
    goal === "fat-loss" ? tdee - 500 : goal === "muscle-gain" ? tdee + 300 : tdee;

  // Protein: the e-book's own guidance for strength training (1.6 to 2.2
  // g/kg) anchors the muscle-gain range. Fat loss skews higher to protect
  // lean mass in a deficit (Helms et al., 2014); general maintenance uses a
  // lighter range still well above the 0.8 g/kg RDA floor.
  const proteinRange: [number, number] =
    goal === "muscle-gain" ? [1.6, 2.2] : goal === "fat-loss" ? [1.8, 2.4] : [1.2, 1.6];
  const proteinLowG = Math.round(proteinRange[0] * weightKg);
  const proteinHighG = Math.round(proteinRange[1] * weightKg);
  const proteinMidG = Math.round(((proteinRange[0] + proteinRange[1]) / 2) * weightKg);

  // Fat: 30% of calories, within the 20 to 35% range most bodies of
  // nutrition guidance converge on for adult women.
  const fatG = Math.round((calorieTarget * 0.3) / 9);

  // Carbs fill the remainder.
  const carbCalories = calorieTarget - proteinMidG * 4 - fatG * 9;
  const carbG = Math.max(0, Math.round(carbCalories / 4));

  // Fiber: National Academies Adequate Intake for women.
  const fiberG = age > 50 ? 21 : 25;

  // Total water: National Academies AI (2.7 L/day total, roughly 80% from
  // beverages), nudged up a little on more active days.
  const baseWaterMl = 2200;
  const activityBumpMl =
    activityLevel === "active" ? 300 : activityLevel === "very-active" ? 500 : 0;
  const waterMl = baseWaterMl + activityBumpMl;

  return {
    bmr: Math.round(bmr),
    tdee: Math.round(tdee),
    calorieTarget: Math.round(calorieTarget),
    proteinLowG,
    proteinHighG,
    fatG,
    carbG,
    fiberG,
    waterMl,
  };
}

export type MicronutrientSpec = {
  key: string;
  name: string;
  unit: string;
  rda: (age: number) => number;
  note?: string;
};

// Source: NIH Office of Dietary Supplements consumer fact sheets, drawing
// on the National Academies of Sciences, Engineering, and Medicine DRI
// values for adult women (non-pregnant, non-lactating).
export const MICRONUTRIENT_RDA: MicronutrientSpec[] = [
  {
    key: "iron",
    name: "Iron",
    unit: "mg",
    rda: (age) => (age <= 50 ? 18 : 8),
    note: "Drops after menopause since regular iron loss from periods stops.",
  },
  { key: "calcium", name: "Calcium", unit: "mg", rda: (age) => (age <= 50 ? 1000 : 1200) },
  {
    key: "vitamin-d",
    name: "Vitamin D",
    unit: "mcg",
    rda: (age) => (age <= 70 ? 15 : 20),
  },
  { key: "magnesium", name: "Magnesium", unit: "mg", rda: (age) => (age <= 30 ? 310 : 320) },
  { key: "zinc", name: "Zinc", unit: "mg", rda: () => 8 },
  { key: "vitamin-c", name: "Vitamin C", unit: "mg", rda: () => 75 },
  { key: "vitamin-b6", name: "Vitamin B6", unit: "mg", rda: (age) => (age <= 50 ? 1.3 : 1.5) },
  { key: "vitamin-b12", name: "Vitamin B12", unit: "mcg", rda: () => 2.4 },
  { key: "folate", name: "Folate", unit: "mcg DFE", rda: () => 400 },
  { key: "potassium", name: "Potassium", unit: "mg", rda: () => 2600 },
  { key: "vitamin-k", name: "Vitamin K", unit: "mcg", rda: () => 90 },
  { key: "selenium", name: "Selenium", unit: "mcg", rda: () => 55 },
  { key: "biotin", name: "Biotin", unit: "mcg", rda: () => 30 },
  { key: "vitamin-e", name: "Vitamin E", unit: "mg", rda: () => 15 },
  { key: "iodine", name: "Iodine", unit: "mcg", rda: () => 150 },
  { key: "chromium", name: "Chromium", unit: "mcg", rda: (age) => (age <= 50 ? 25 : 20) },
];
