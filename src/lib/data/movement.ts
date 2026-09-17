// Extracted from the companion e-book's "Strength Training and Your Training Program" chapter.
export type MovementPatternSlug =
  | "squat"
  | "hinge"
  | "pull"
  | "push-press"
  | "quads-adductors-abductors"
  | "calves"
  | "arms"
  | "shoulders";

export type MovementVariant = "gym" | "home-weights" | "bodyweight";

export type MovementPattern = {
  slug: MovementPatternSlug;
  name: string;
  priority: boolean; // "prioritize if a session gets cut short"
  exercises: Record<MovementVariant, string[]>;
};

export const MOVEMENT_PATTERNS: MovementPattern[] = [
  {
    slug: "squat",
    name: "Squat",
    priority: true,
    exercises: {
      gym: ["Goblet squat", "Hack squat", "Any machine squat", "Box squat"],
      "home-weights": [
        "Kettlebell or dumbbell goblet squat",
        "Squat holding a filled water jug or household item",
      ],
      bodyweight: ["Bodyweight squats", "Box squats using a sturdy chair"],
    },
  },
  {
    slug: "hinge",
    name: "Hinge",
    priority: true,
    exercises: {
      gym: [
        "Romanian deadlifts",
        "Glute ham raises",
        "Kettlebell swings",
        "Hip thrusts (machine, barbell, or smith machine)",
        "Cable pull throughs",
      ],
      "home-weights": [
        "Kettlebell or dumbbell Romanian deadlifts",
        "Kettlebell swings",
        "Floor hip thrusts holding a weight across your hips",
      ],
      bodyweight: [
        "Floor glute bridges",
        "Bodyweight Romanian deadlifts",
        "Single leg hip hinges",
      ],
    },
  },
  {
    slug: "pull",
    name: "Pull",
    priority: true,
    exercises: {
      gym: [
        "Lat pulldowns",
        "Pull ups or assisted pull ups",
        "Dumbbell or kettlebell rows",
        "Barbell rows",
        "Cable rows",
        "Machine rows",
      ],
      "home-weights": [
        "Dumbbell or kettlebell rows",
        "Banded rows using a resistance band anchored to a door",
      ],
      bodyweight: [
        "Doorway rows holding a door frame and pulling yourself in",
        "Table rows using a sturdy table",
      ],
    },
  },
  {
    slug: "push-press",
    name: "Push & Press",
    priority: true,
    exercises: {
      gym: [
        "Dumbbell incline bench press",
        "Any machine chest press",
        "Dumbbell shoulder press",
        "Any machine shoulder press",
      ],
      "home-weights": ["Dumbbell floor press", "Dumbbell shoulder press"],
      bodyweight: [
        "Push ups",
        "Wall or incline push ups against a counter if a full push up isn't accessible yet",
      ],
    },
  },
  {
    slug: "quads-adductors-abductors",
    name: "Quads, Adductors & Abductors",
    priority: false,
    exercises: {
      gym: ["Quad extension machine", "Adduction and abduction machines"],
      "home-weights": [
        "Lateral lunges",
        "Side lying leg raises",
        "Standing inner and outer thigh leg lifts with a resistance band around your ankles",
      ],
      bodyweight: [
        "Lateral lunges",
        "Side lying leg raises",
        "Standing inner and outer thigh leg lifts",
      ],
    },
  },
  {
    slug: "calves",
    name: "Calves",
    priority: false,
    exercises: {
      gym: ["Standing calf raises"],
      "home-weights": ["Standing calf raises off the edge of a step"],
      bodyweight: [
        "Standing calf raises on a flat floor or off the edge of a step for extra range",
      ],
    },
  },
  {
    slug: "arms",
    name: "Arms",
    priority: false,
    exercises: {
      gym: ["Dumbbell curls", "Tricep press downs"],
      "home-weights": ["Dumbbell curls", "Tricep press downs"],
      bodyweight: ["Close grip push ups", "Doorway tricep presses"],
    },
  },
  {
    slug: "shoulders",
    name: "Shoulders",
    priority: false,
    exercises: {
      gym: ["Lateral raises", "Face pulls using a resistance band"],
      "home-weights": ["Lateral raises", "Face pulls using a resistance band"],
      bodyweight: [
        "Bodyweight external rotation drills against light resistance",
      ],
    },
  },
];

export type BodyweightLevel = 1 | 2 | 3;

export type BodyweightProgressionExercise = {
  exercise: string;
  pattern: MovementPatternSlug | "core";
};

export const BODYWEIGHT_PROGRESSION: Record<
  BodyweightLevel,
  { label: string; exercises: BodyweightProgressionExercise[] }
> = {
  1: {
    label: "Level 1: Building Your Foundation",
    exercises: [
      { exercise: "Box squats using a chair", pattern: "squat" },
      { exercise: "Floor glute bridges", pattern: "hinge" },
      { exercise: "Reverse lunges", pattern: "squat" },
      { exercise: "Wall or incline push ups", pattern: "push-press" },
      { exercise: "Doorway rows", pattern: "pull" },
      { exercise: "Side planks from your knees", pattern: "core" },
    ],
  },
  2: {
    label: "Level 2: Increasing the Challenge",
    exercises: [
      { exercise: "Full depth bodyweight squats", pattern: "squat" },
      { exercise: "Single leg glute bridges", pattern: "hinge" },
      {
        exercise: "Lateral lunges",
        pattern: "quads-adductors-abductors",
      },
      {
        exercise: "Standard push ups from your toes",
        pattern: "push-press",
      },
      { exercise: "Banded or table rows", pattern: "pull" },
      { exercise: "Full plank holds", pattern: "core" },
      { exercise: "Standing calf raises", pattern: "calves" },
    ],
  },
  3: {
    label: "Level 3: Mastering Single Leg & Single Arm Work",
    exercises: [
      { exercise: "Pistol squats", pattern: "squat" },
      {
        exercise: "Skater squats",
        pattern: "quads-adductors-abductors",
      },
      { exercise: "Elevated split squats", pattern: "squat" },
      { exercise: "Strict push ups", pattern: "push-press" },
      { exercise: "Slow negative pull ups", pattern: "pull" },
      { exercise: "Hanging knee raises", pattern: "core" },
    ],
  },
};

export const PROGRESSION_VARIABLES = [
  {
    name: "Slow down your repetitions",
    detail:
      "A four second lowering phase with a one second pause at the bottom makes the exact same movement noticeably harder.",
  },
  {
    name: "Switch to single leg or single arm versions",
    detail:
      "Moving from a two-legged squat to a single leg version effectively doubles the load on the working leg.",
  },
  {
    name: "Add a pause at the hardest part of the movement",
    detail:
      "Holding for two seconds at the top of a hip thrust or the peak of a row increases the challenge without adding weight.",
  },
  {
    name: "Add more repetitions or shorten your rest",
    detail:
      "Trimming your rest from around 90 seconds down to 45 to 60 seconds meaningfully increases the demand on your muscles.",
  },
];

export const WEEKLY_STRUCTURE = [
  { day: 1, focus: "Full body resistance training", type: "strength" as const },
  {
    day: 2,
    focus: "Active recovery, light cardio, or a plyometric session",
    type: "recovery" as const,
  },
  { day: 3, focus: "Full body resistance training", type: "strength" as const },
  {
    day: 4,
    focus: "Rest, or gentle active recovery if you feel like moving",
    type: "rest" as const,
  },
  { day: 5, focus: "Full body resistance training", type: "strength" as const },
  {
    day: 6,
    focus: "Cardio or a plyometric session, whichever you enjoy more that week",
    type: "cardio" as const,
  },
  { day: 7, focus: "Rest", type: "rest" as const },
];

export const FORM_PRINCIPLES = [
  "Control the lowering part of every movement, slowing the descent over two to three seconds creates more useful muscle tension than dropping quickly.",
  "Keep three points of contact on the ground during lower body moves: the base of your big toe, the base of your pinky toe, and your heel.",
  "Keep your ribs gently drawn down toward your hips, avoid letting your lower back arch excessively during presses or squats.",
];

export const WARMUP_TIPS = [
  "Dynamic movement, not static stretching, beforehand, gentle cat-cow stretches and bodyweight squats raise your muscle temperature.",
  "Save static, held stretches for afterward, as part of your cool down.",
  "A few minutes is genuinely enough, just enough to feel noticeably looser and more awake.",
];

export const ACTIVE_RECOVERY_OPTIONS = [
  {
    name: "Gentle low impact cardio",
    detail:
      "Twenty to thirty minutes of easy walking, casual cycling, or swimming, at a pace where you can comfortably hold a conversation.",
  },
  {
    name: "Mobility and dynamic stretching",
    detail:
      "Moving your joints through their full range, hip openers, cat-cow stretches, gentle spine rotations, and ankle mobility work.",
  },
  {
    name: "Foam rolling",
    detail:
      "Ten to fifteen minutes rolling your glutes, quads, calves, and upper back to release tight tissue.",
  },
  {
    name: "Gentle yoga or pilates",
    detail: "Focused on breathing and gentle lengthening, rather than intense holds.",
  },
];

export const RECOVERY_FLOW_15MIN = [
  { minutes: 5, activity: "Easy walking or light cycling at a relaxed pace" },
  {
    minutes: 5,
    activity: "Foam rolling your glutes, quads, and upper back, about 30 seconds per spot",
  },
  {
    minutes: 5,
    activity:
      "A simple mobility circuit, cat-cow stretches, a gentle full body stretch sequence, and legs up the wall",
  },
];
