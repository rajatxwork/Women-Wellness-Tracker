// Goal-first intake for the Workout page. The book's own weekly structure
// (movement.ts WEEKLY_STRUCTURE) is a fairly universal recommendation, so
// "personalizing" a program means: carrying that baseline through, picking
// a sensible default exercise variant from age/training level, and
// surfacing the book's own goal-specific "why" tips (already written for
// nutrition and cardio) rather than inventing new copy or a fake algorithm.
import { WEEKLY_STRUCTURE, type MovementVariant, type BodyweightLevel } from "@/lib/data/movement";
import { CARDIO_GOAL_TIPS, CARDIO_WEEKLY_TARGETS } from "@/lib/data/cardio";
import { NUTRITION_GOAL_CATEGORIES } from "@/lib/data/nutrition";
import type { PlanDay } from "@/lib/types";

export type AgeBand = "20s-30s" | "30s-50s" | "60-plus";
export type TrainingLevel = "beginner" | "intermediate" | "advanced";
export type DayType = PlanDay["day_type"];

export const AGE_BAND_OPTIONS: { value: AgeBand; label: string }[] = [
  { value: "20s-30s", label: "20s to 30s" },
  { value: "30s-50s", label: "30s to 50s" },
  { value: "60-plus", label: "60 and beyond" },
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

export type WorkoutGoal = {
  slug: string;
  name: string;
  blurb: string;
};

// A workout-flavored subset: two general-purpose goals, plus every existing
// goal slug that already has cardio-specific "why" tips written for it.
export const WORKOUT_GOALS: WorkoutGoal[] = [
  {
    slug: "general-wellness",
    name: "General health",
    blurb: "A solid, sustainable baseline, nothing specific, just feeling good.",
  },
  {
    slug: "build-strength",
    name: "Build strength & muscle",
    blurb: "Getting visibly and measurably stronger over time.",
  },
  ...CARDIO_GOAL_TIPS.map((g) => {
    const cat = NUTRITION_GOAL_CATEGORIES.find((c) => c.slug === g.goalSlug);
    return { slug: g.goalSlug, name: cat?.name ?? g.goalSlug, blurb: cat?.tagline ?? "" };
  }),
];

export function tipsForGoal(slug: string): string[] {
  return CARDIO_GOAL_TIPS.find((g) => g.goalSlug === slug)?.tips ?? [];
}

export type RecommendedDay = {
  dayOfWeek: number; // 1 = Monday ... 7 = Sunday
  label: string;
  dayType: DayType;
  focus: string;
};

export type Recommendation = {
  days: RecommendedDay[];
  cardioNote: string;
  strengthNote: string;
  tips: string[];
};

const DAY_LABELS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

// Maps the book's own WEEKLY_STRUCTURE onto the day_type enum plan_days
// uses. "plyo" doesn't have its own plan_days slot (it lives alongside
// cardio on the book's flexible day 6), so it folds into "cardio".
function toDayType(type: (typeof WEEKLY_STRUCTURE)[number]["type"]): DayType {
  if (type === "recovery") return "recovery";
  if (type === "rest") return "rest";
  if (type === "cardio") return "cardio";
  return "strength";
}

export function buildRecommendation(goalSlugs: string[]): Recommendation {
  const days: RecommendedDay[] = WEEKLY_STRUCTURE.map((d, i) => ({
    dayOfWeek: d.day,
    label: DAY_LABELS[i],
    dayType: toDayType(d.type),
    focus: d.focus,
  }));

  const tips = goalSlugs.flatMap(tipsForGoal).slice(0, 4);

  return {
    days,
    strengthNote: "Three full body strength sessions a week, the book's baseline for building and keeping muscle.",
    cardioNote: `${CARDIO_WEEKLY_TARGETS.moderateMinutesLow}–${CARDIO_WEEKLY_TARGETS.moderateMinutesHigh} min of moderate cardio a week (or ${CARDIO_WEEKLY_TARGETS.vigorousMinutesLow}–${CARDIO_WEEKLY_TARGETS.vigorousMinutesHigh} min vigorous), spread across your cardio day.`,
    tips,
  };
}
