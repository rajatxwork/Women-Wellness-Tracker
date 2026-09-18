// Goal-first intake for the Workout page. Each goal maps to a concrete,
// opinionated weekly template (which days, what kind, what body focus, what
// rep range), so picking one gives a real program, not just a vibe.
import { MOVEMENT_PATTERNS, WEEKLY_STRUCTURE, type MovementVariant, type BodyweightLevel } from "@/lib/data/movement";
import type { PlanDay } from "@/lib/types";

export type AgeBand = "20s-30s" | "30s-50s" | "60-plus";
export type TrainingLevel = "beginner" | "intermediate" | "advanced";
export type DayType = PlanDay["day_type"];
export type DayFocus = "full" | "upper" | "lower" | null;

// 1 = Monday ... 7 = Sunday, matching plan_days.day_of_week.
export function todayDayOfWeek(): number {
  const jsWeekday = new Date().getDay(); // 0 = Sunday
  return jsWeekday === 0 ? 7 : jsWeekday;
}

// The book's own weekly structure, mapped onto the day_type enum plan_days
// uses, as the fallback for any day the user hasn't customized.
export function baselineDayType(dayOfWeek: number): DayType {
  const type = WEEKLY_STRUCTURE[dayOfWeek - 1]?.type;
  if (type === "recovery") return "recovery";
  if (type === "rest") return "rest";
  if (type === "cardio") return "cardio";
  return "strength";
}

export const AGE_BAND_OPTIONS: { value: AgeBand; label: string }[] = [
  { value: "20s-30s", label: "20s to 30s" },
  { value: "30s-50s", label: "30s to 50s" },
  { value: "60-plus", label: "60 and beyond" },
];

export const ENVIRONMENT_OPTIONS: { value: MovementVariant; label: string; blurb: string }[] = [
  { value: "gym", label: "Gym", blurb: "Machines, barbells, the full setup." },
  { value: "home-weights", label: "Home + weights", blurb: "Dumbbells, kettlebells, bands, whatever you've got." },
  { value: "bodyweight", label: "Bodyweight", blurb: "No equipment at all, just you." },
];

export const TRAINING_LEVEL_OPTIONS: {
  value: TrainingLevel;
  label: string;
  blurb: string;
  defaultVariant: MovementVariant;
  defaultBodyweightLevel: BodyweightLevel;
}[] = [
  {
    value: "beginner",
    label: "Just starting out",
    blurb: "New to structured training, or coming back after a long break.",
    defaultVariant: "bodyweight",
    defaultBodyweightLevel: 1,
  },
  {
    value: "intermediate",
    label: "Consistent for a while",
    blurb: "You train somewhat regularly and know your way around the basics.",
    defaultVariant: "home-weights",
    defaultBodyweightLevel: 2,
  },
  {
    value: "advanced",
    label: "Experienced",
    blurb: "Training is a settled habit and you want to keep progressing.",
    defaultVariant: "gym",
    defaultBodyweightLevel: 3,
  },
];

export type WorkoutGoalSlug =
  | "general-health"
  | "strength-muscle"
  | "heart-health"
  | "lower-body-focus"
  | "fat-loss";

export type WorkoutGoal = {
  slug: WorkoutGoalSlug;
  name: string;
  blurb: string;
  structureSummary: string;
};

export const WORKOUT_GOALS: WorkoutGoal[] = [
  {
    slug: "general-health",
    name: "General health & overall fitness",
    blurb: "A solid, sustainable baseline, nothing specific, just feeling good and staying capable.",
    structureSummary: "3 full body strength days, 2 cardio days, active recovery worked in.",
  },
  {
    slug: "strength-muscle",
    name: "Strength & muscle building",
    blurb: "Getting visibly and measurably stronger over time.",
    structureSummary: "4 day upper/lower split, balanced, with cardio and plyo worked in around it.",
  },
  {
    slug: "heart-health",
    name: "Better heart health",
    blurb: "Cardio-forward, with enough lifting to keep your muscle and bones strong.",
    structureSummary: "Cardio heavy, 3 cardio days, plus 2 full body lifting days.",
  },
  {
    slug: "lower-body-focus",
    name: "Lower body focus",
    blurb: "More squat, hinge, and leg work in the mix, without dropping everything else.",
    structureSummary: "Lower body dominant split, 3 lower days, 1 upper day, cardio and recovery around it.",
  },
  {
    slug: "fat-loss",
    name: "Fat loss",
    blurb: "A balanced, sustainable mix of lifting and cardio, built so you can actually keep it up.",
    structureSummary: "3 lifting days, 3 cardio days, with active recovery or rest worked in.",
  },
];

// The book's "priority" patterns (squat, hinge, pull, push & press) are the
// big compound lifts; the rest (quads/adductors/abductors, calves, arms,
// shoulders) are isolation work. Same rule for every goal: 2 sets, and a
// rep range that depends on which kind of movement it is.
export const REP_GUIDANCE_NOTE =
  "2 sets to start: 8–10 reps on compound lifts (squat, hinge, pull, push & press), 10–12 reps on isolation work (quads/adductors/abductors, calves, arms, shoulders).";

export function repGuidanceForPattern(patternSlug: string | null): { sets: number; reps: string } | null {
  if (!patternSlug) return null;
  const pattern = MOVEMENT_PATTERNS.find((p) => p.slug === patternSlug);
  if (!pattern) return null;
  return { sets: 2, reps: pattern.priority ? "8–10" : "10–12" };
}

const DAY_LABELS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

const FULL_BODY_PATTERNS = ["squat", "hinge", "pull", "push-press"] as const;
const UPPER_PATTERNS = ["pull", "push-press", "shoulders", "arms"] as const;
const LOWER_PATTERNS = ["squat", "hinge", "quads-adductors-abductors", "calves"] as const;

function patternsForFocus(focus: DayFocus): readonly string[] {
  if (focus === "upper") return UPPER_PATTERNS;
  if (focus === "lower") return LOWER_PATTERNS;
  return FULL_BODY_PATTERNS;
}

export type RecommendedDay = {
  dayOfWeek: number; // 1 = Monday ... 7 = Sunday
  label: string;
  dayType: DayType;
  focus: DayFocus;
  note: string;
};

type DayTemplate = { dayType: DayType; focus: DayFocus; note: string };

const GOAL_TEMPLATES: Record<WorkoutGoalSlug, DayTemplate[]> = {
  "general-health": [
    { dayType: "strength", focus: "full", note: "Full body strength" },
    { dayType: "cardio", focus: null, note: "Cardio, your choice of pace" },
    { dayType: "strength", focus: "full", note: "Full body strength" },
    { dayType: "recovery", focus: null, note: "Active recovery or a gentle walk" },
    { dayType: "strength", focus: "full", note: "Full body strength" },
    { dayType: "cardio", focus: null, note: "Cardio, your choice of pace" },
    { dayType: "rest", focus: null, note: "Rest" },
  ],
  "strength-muscle": [
    { dayType: "strength", focus: "upper", note: "Upper body" },
    { dayType: "strength", focus: "lower", note: "Lower body" },
    { dayType: "cardio", focus: null, note: "Light cardio or a plyometric session" },
    { dayType: "strength", focus: "upper", note: "Upper body" },
    { dayType: "strength", focus: "lower", note: "Lower body" },
    { dayType: "cardio", focus: null, note: "Cardio, your choice of pace" },
    { dayType: "rest", focus: null, note: "Rest" },
  ],
  "heart-health": [
    { dayType: "cardio", focus: null, note: "Cardio" },
    { dayType: "strength", focus: "full", note: "Full body strength" },
    { dayType: "cardio", focus: null, note: "Cardio" },
    { dayType: "recovery", focus: null, note: "Active recovery" },
    { dayType: "strength", focus: "full", note: "Full body strength" },
    { dayType: "cardio", focus: null, note: "Cardio" },
    { dayType: "rest", focus: null, note: "Rest" },
  ],
  "lower-body-focus": [
    { dayType: "strength", focus: "lower", note: "Lower body" },
    { dayType: "strength", focus: "upper", note: "Upper body" },
    { dayType: "cardio", focus: null, note: "Cardio, your choice of pace" },
    { dayType: "strength", focus: "lower", note: "Lower body" },
    { dayType: "recovery", focus: null, note: "Active recovery" },
    { dayType: "strength", focus: "lower", note: "Lower body" },
    { dayType: "rest", focus: null, note: "Rest" },
  ],
  "fat-loss": [
    { dayType: "strength", focus: "full", note: "Full body strength" },
    { dayType: "cardio", focus: null, note: "Cardio" },
    { dayType: "strength", focus: "full", note: "Full body strength" },
    { dayType: "cardio", focus: null, note: "Cardio" },
    { dayType: "strength", focus: "full", note: "Full body strength" },
    { dayType: "cardio", focus: null, note: "Cardio" },
    { dayType: "recovery", focus: null, note: "Active recovery or rest, your call" },
  ],
};

export type Recommendation = {
  goal: WorkoutGoal;
  days: RecommendedDay[];
  disclaimer: string;
};

export function buildRecommendation(goalSlug: WorkoutGoalSlug): Recommendation {
  const goal = WORKOUT_GOALS.find((g) => g.slug === goalSlug)!;
  const template = GOAL_TEMPLATES[goalSlug];
  const days: RecommendedDay[] = template.map((t, i) => ({
    dayOfWeek: i + 1,
    label: DAY_LABELS[i],
    dayType: t.dayType,
    focus: t.focus,
    note: t.note,
  }));

  return {
    goal,
    days,
    disclaimer:
      "A general starting point based on the book's guidance, not personalized medical or professional advice. Ease in, adjust anything that doesn't feel right, and check with a doctor first if you're new to exercise or managing a health condition.",
  };
}

// Suggests one exercise per pattern relevant to a day's focus, at the given
// variant, so "build my week for me" has actual movements to add rather
// than just a labeled day.
export function suggestedExercisesForDay(focus: DayFocus, variant: MovementVariant) {
  const slugs = patternsForFocus(focus);
  return slugs.map((slug) => {
    const pattern = MOVEMENT_PATTERNS.find((p) => p.slug === slug)!;
    return {
      patternSlug: pattern.slug,
      exerciseName: pattern.exercises[variant]?.[0] ?? pattern.exercises.bodyweight[0],
    };
  });
}
