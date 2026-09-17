// The app's voice, in one place. Warm, direct, a little wry — never
// saccharine, never a notification bot. Pull from these arrays anywhere the
// UI needs to say something back to her, so it doesn't feel robotic or
// repetitive.
import type { CyclePhase } from "@/lib/data/cycle-phases";
import { CYCLE_PHASES } from "@/lib/data/cycle-phases";

function pick(list: string[], seed?: number): string {
  if (list.length === 0) return "";
  const index =
    seed !== undefined
      ? Math.abs(seed) % list.length
      : Math.floor(Math.random() * list.length);
  return list[index];
}

export const CELEBRATION = [
  "You showed up for yourself today — that's the whole game.",
  "Logged and done. Look at you.",
  "That's one more thing your future self will thank you for.",
  "Small action, real follow-through. That's how this actually works.",
  "You did the thing. No asterisk needed.",
  "That counts, fully and completely.",
  "Nice. Quietly, consistently nice.",
  "You kept a promise to yourself today.",
];

export const CELEBRATION_WORKOUT = [
  "Strength session logged. Your body's going to feel that, in a good way.",
  "You moved with intention today — that's worth noticing.",
  "Another session in the books. This is how strength actually gets built.",
  "You showed up to lift, and that's the hard part done.",
];

export const CELEBRATION_WATER = [
  "Water goal hit. Simple, unglamorous, and it genuinely matters.",
  "Fully hydrated and fully counted. Nice work.",
  "That's your goal for today, met.",
];

export const STREAK = [
  (n: number) => `${n} days in a row. However long this lasts, it counts.`,
  (n: number) => `${n} days now. You're building something real here.`,
  (n: number) => `${n} in a row — not because it has to be perfect, just because you kept coming back.`,
  (n: number) => `That's ${n} days. No pressure to keep it going, just proud of where it's at.`,
];

export const GENTLE_NUDGE = [
  "Yesterday got away from you — that's allowed. Want to pick one small thing for today?",
  "A day off the radar doesn't erase the ones before it. Whenever you're ready.",
  "No log yesterday, no story there. Today's a clean slate if you want it.",
  "Life happened — it does that. Come back whenever it suits you, not because you owe anyone.",
  "Missing a day doesn't undo the ones you showed up for. This is still working.",
];

export const STREAK_BROKEN = [
  "The streak reset, and that's genuinely fine — the habit itself is still yours.",
  "Streaks end. What you built while it lasted didn't go anywhere.",
  "However many days that was, they still happened. Starting again counts just as much as starting the first time.",
];

export const EMPTY_STATE = [
  "Nothing logged yet — whenever you're ready, this is your space.",
  "Quiet in here so far. No rush to fill it.",
  "This page is just waiting for whenever you want to start.",
  "Nothing here yet, and that's a fine place to begin.",
];

export const GREETING = [
  "Good to see you.",
  "Hey — glad you're here.",
  "Welcome back.",
  "Here's your space for today.",
];

export function getCelebration(seed?: number) {
  return pick(CELEBRATION, seed);
}

export function getWorkoutCelebration(seed?: number) {
  return pick(CELEBRATION_WORKOUT, seed);
}

export function getWaterCelebration(seed?: number) {
  return pick(CELEBRATION_WATER, seed);
}

export function getStreakMessage(days: number, seed?: number) {
  const fn = STREAK[Math.abs(seed ?? days) % STREAK.length];
  return fn(days);
}

export function getStreakBrokenMessage(seed?: number) {
  return pick(STREAK_BROKEN, seed);
}

export function getGentleNudge(seed?: number) {
  return pick(GENTLE_NUDGE, seed);
}

export function getEmptyState(seed?: number) {
  return pick(EMPTY_STATE, seed);
}

export function getGreeting(seed?: number) {
  return pick(GREETING, seed);
}

export function getPhaseTip(phase: CyclePhase): string {
  const tips = CYCLE_PHASES[phase].tips;
  return pick(tips);
}

// Coverage framing for the nutrition weekly view — always encouraging,
// never a scorecard.
export function getCoveragePraise(categoryName: string) {
  const templates = [
    `You've been great about ${categoryName} this week.`,
    `${categoryName} has been a strong spot for you lately.`,
    `You're consistently showing up for ${categoryName}.`,
  ];
  return pick(templates);
}

export function getCoverageNudge(categoryName: string) {
  const templates = [
    `${categoryName} could use a little more attention — no rush, just noting it.`,
    `${categoryName} has been quiet this week. Even one small addition would count.`,
    `Maybe work a bit more ${categoryName} in when you get the chance.`,
  ];
  return pick(templates);
}
