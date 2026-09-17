// Extracted from the companion e-book's "Plyometrics, Based on Your Stage of Life" section.
export type AgeBand = "20s-30s" | "30s-50s" | "60-plus";

export type PlyoSet = {
  ageBand: AgeBand;
  label: string;
  focus: string;
  exercises: { name: string; detail: string }[];
};

export const PLYOMETRIC_SETS: PlyoSet[] = [
  {
    ageBand: "20s-30s",
    label: "20s to 30s",
    focus: "Focus on athletic capacity and building peak bone density.",
    exercises: [
      {
        name: "Jump rope or shadow jumping",
        detail: "30 to 60 seconds of light, rhythmic bouncing on the balls of your feet.",
      },
      {
        name: "Low box or step jumps",
        detail:
          "Jumping onto a sturdy step and landing softly, then stepping back down one foot at a time.",
      },
      {
        name: "Skater bounds",
        detail:
          "Hopping side to side from one foot to the other, landing softly in a slight mini squat.",
      },
    ],
  },
  {
    ageBand: "30s-50s",
    label: "30s to 50s",
    focus:
      "Focus on quick, efficient movement and counteracting a day spent at a desk.",
    exercises: [
      {
        name: "Ankle pogos",
        detail: "Small, quick bounces on your toes with straight legs, barely leaving the floor.",
      },
      {
        name: "Standing pillow or light medicine ball slams",
        detail: "Lifting overhead and throwing down explosively — genuinely great for releasing stress.",
      },
      {
        name: "In and out squat jacks",
        detail: "A light mini squat, jumping your feet out wide then back together.",
      },
    ],
  },
  {
    ageBand: "60-plus",
    label: "60 and beyond",
    focus: "Focus on balance, fall prevention, and safely maintaining bone health.",
    exercises: [
      {
        name: "Subtle heel drops",
        detail: "Rising onto your tiptoes then dropping your heels down with a firm, comfortable bump.",
      },
      {
        name: "Chair assisted line hops",
        detail: "Holding a counter or sturdy chair and hopping gently side to side.",
      },
      {
        name: "Fast step step-ups",
        detail: "Stepping up onto a low stair quickly, then stepping back down slowly.",
      },
    ],
  },
];

export const PLYO_QUICK_TIP =
  "Always aim for a soft, quiet landing — that means your muscles and tendons are absorbing the impact properly, not your joints. Two to three sets of five to ten reps, twice a week, is genuinely enough.";
