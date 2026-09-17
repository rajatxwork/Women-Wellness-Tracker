// Cycle-phase guidance grounded in the companion e-book's training and nutrition
// chapters ("Working With Your Cycle" and "You Want to Support Your Hormones and
// Your Cycle, Eat This"), written in the app's own supportive voice.
export type CyclePhase = "menstrual" | "follicular" | "ovulation" | "luteal";

export type CyclePhaseInfo = {
  phase: CyclePhase;
  name: string;
  trainingNote: string;
  nutritionNote: string;
  tips: string[];
};

export const CYCLE_PHASES: Record<CyclePhase, CyclePhaseInfo> = {
  menstrual: {
    phase: "menstrual",
    name: "Menstrual",
    trainingNote:
      "Light cycling or brisk walking increases blood flow to your pelvic area and releases natural pain-relieving endorphins, which can meaningfully ease cramp intensity. Gentle movement is doing real work here, not just distraction.",
    nutritionNote:
      "You're losing iron right now, red meat and lentils help replenish it, and pairing them with a squeeze of citrus helps your body absorb more of it. Magnesium-rich foods like pumpkin seeds and dark chocolate can help relax the uterine muscle itself.",
    tips: [
      "You're heading into your period, cramps and low energy are biology, not a lack of willpower. Light movement can genuinely help.",
      "Ginger tea has long been used to ease nausea and cramping, if that sounds good today.",
    ],
  },
  follicular: {
    phase: "follicular",
    name: "Follicular",
    trainingNote:
      "Your energy and recovery capacity are typically higher here. Light swimming, cycling, or more dynamic mobility work fits well, and it's a good window to build up your strength sessions if you're feeling it.",
    nutritionNote:
      "Your body handles carbohydrates especially efficiently in this first half of your cycle, a great time to fuel workouts and active days with your usual healthy carbs.",
    tips: [
      "You're in your follicular phase, energy tends to climb from here. A good stretch to push a little in your strength sessions if it feels good.",
      "Higher estrogen phases can make your joints slightly more flexible than usual, favor controlled, gentle mobility work over aggressive stretching.",
    ],
  },
  ovulation: {
    phase: "ovulation",
    name: "Ovulation",
    trainingNote:
      "Energy and confidence often peak for a lot of women around now, a good window for your more demanding strength or cardio sessions if that's how you're feeling. As always, let how your body actually feels lead the way.",
    nutritionNote:
      "You're still in the first half of your cycle, so your body is generally handling carbohydrates well, keep fueling active days without second-guessing it.",
    tips: [
      "You're around ovulation, many women feel their strongest and most energized here. Worth taking advantage of if your body's on board.",
    ],
  },
  luteal: {
    phase: "luteal",
    name: "Luteal",
    trainingNote:
      "Your body temperature and fatigue naturally rise here. Lean toward gentle walking, restorative yoga, and light stretching rather than pushing hard, this is recovery time, not a step backward.",
    nutritionNote:
      "Your metabolism actually rises slightly here and cravings increase, that's biology, not a lack of willpower. Your body is asking for a bit more food, along with magnesium and B vitamins to support hormone production.",
    tips: [
      "You're heading into your luteal phase, cravings and fatigue are biology, not a lack of willpower. Maybe ease up on intensity this week.",
      "Slow, deep belly breathing during recovery sessions can help release tension through your pelvic floor and lower back.",
    ],
  },
};

export function getCyclePhase(
  dayOfCycle: number,
  cycleLength: number,
): CyclePhase {
  const periodLength = 5;
  const ovulationDay = cycleLength - 14;
  if (dayOfCycle <= periodLength) return "menstrual";
  if (dayOfCycle < ovulationDay - 1) return "follicular";
  if (dayOfCycle <= ovulationDay + 1) return "ovulation";
  return "luteal";
}
