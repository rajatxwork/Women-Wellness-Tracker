// Extracted from the companion e-book's "Cardio, Made Simple" chapter.
export type CardioType = "zone2" | "hiit";

export const CARDIO_TYPES: {
  type: CardioType;
  name: string;
  description: string;
  examples: string[];
}[] = [
  {
    type: "zone2",
    name: "Steady & Easy (Zone 2)",
    description:
      "Movement at a pace where you can comfortably talk, like brisk walking or easy cycling. This is your longevity workhorse, it builds your body's energy producing capacity and burns fat efficiently without spiking stress hormones.",
    examples: [
      "Brisk walking",
      "Easy cycling",
      "Dancing",
      "Incline treadmill walking",
      "Swimming at a relaxed pace",
    ],
  },
  {
    type: "hiit",
    name: "Short & Intense (HIIT)",
    description:
      "Brief bursts of hard effort followed by rest, like sprinting up a hill or fast intervals. This is what rapidly improves your body's ability to use oxygen, one of the strongest predictors of a long, healthy life.",
    examples: [
      "Hill sprints",
      "Fast intervals",
      "Rowing machine sprints",
      "Assault bike intervals",
      "Stair climbing bursts",
    ],
  },
];

export const CARDIO_WEEKLY_TARGETS = {
  moderateMinutesLow: 150,
  moderateMinutesHigh: 300,
  vigorousMinutesLow: 75,
  vigorousMinutesHigh: 150,
  note: "Research indicates women get equal or even greater benefit from shorter durations of cardio compared to men, around 140 minutes of moderate movement a week has been shown to reduce all-cause mortality risk by about 18 percent.",
};

export const CARDIO_NO_EQUIPMENT_OPTIONS = [
  "Outdoor brisk walking",
  "Walking with a weighted backpack",
  "Dancing",
  "Stair climbing",
  "Bodyweight intervals like jumping jacks and high knees",
];

export const CARDIO_EQUIPMENT_OPTIONS = [
  "Incline treadmill walking",
  "A stationary bike",
  "An elliptical or stair machine",
  "Rowing machine sprints",
  "An assault bike",
];

export const CARDIO_FRICTION_TIPS = [
  "Take your calls on the move, pace around your home or walk outside during phone calls, podcasts, or audiobooks.",
  "Snack on movement, one or two minutes of brisk stair climbing or jumping jacks between tasks adds up more than you'd expect.",
  "Upgrade your commute, park further away, take the stairs, or walk briskly for ten minutes before and after work.",
  "Turn coffee dates into walking dates.",
  "Walk after you eat, a ten minute walk after lunch and dinner adds up to about twenty minutes of easy cardio a day.",
];

export const CARDIO_GOAL_TIPS: { goalSlug: string; tips: string[] }[] = [
  {
    goalSlug: "heart",
    tips: [
      "Brisk walking or easy cycling helps your blood vessels stay flexible over time, lowering resting blood pressure.",
      "Regular cardio has been shown to cut the risk of fatal heart events in women by around 30 to 36 percent.",
    ],
  },
  {
    goalSlug: "focus-brain",
    tips: [
      "Aerobic movement, done regularly, stimulates BDNF, nicknamed 'fertilizer for the brain', helping grow new brain cells involved in memory.",
      "Short, intense bursts of effort are especially good at boosting focus and mental clarity, often within the same day.",
    ],
  },
  {
    goalSlug: "energy",
    tips: [
      "Steady, moderate movement helps your muscles absorb blood sugar directly, preventing energy crashes.",
      "A short ten-minute walk after meals blunts the blood sugar spike and prevents that sluggish, heavy feeling.",
    ],
  },
  {
    goalSlug: "sleep",
    tips: [
      "Moderate cardio earlier in the day raises your core temperature temporarily, the natural drop a few hours later signals your brain to wind down.",
      "Try to finish your workout at least three hours before bed.",
    ],
  },
  {
    goalSlug: "period-cramps",
    tips: [
      "Light cycling or brisk walking during your period increases blood flow to your pelvic area and releases endorphins, easing cramp intensity.",
      "Regular movement across your whole cycle supports your body's ability to clear excess circulating estrogen.",
    ],
  },
  {
    goalSlug: "skin-hair-nails",
    tips: [
      "Cardio opens tiny blood vessels near your skin's surface, delivering oxygen, zinc, and vitamin C directly to skin cells, that's the post-workout glow.",
      "Increased blood flow to your scalp delivers iron, oxygen, and biotin straight to your hair follicles.",
    ],
  },
  {
    goalSlug: "digestion-gut",
    tips: [
      "A fifteen minute walk physically stimulates the muscles in your digestive tract, easing bloating.",
      "Regular moderate cardio supports a healthier variety of gut bacteria.",
    ],
  },
  {
    goalSlug: "mood",
    tips: [
      "Sustained aerobic movement helps burn off excess cortisol and adrenaline while boosting endorphins, dopamine, and serotonin.",
      "A minute or two of stair climbing between tasks can noticeably dampen irritability, especially in the days leading up to your period.",
    ],
  },
];
