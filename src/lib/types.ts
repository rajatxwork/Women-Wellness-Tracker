export type Profile = {
  id: string;
  name: string | null;
  avg_cycle_length: number;
  last_period_start: string | null;
  water_goal_ml: number;
  age_band: "20s-30s" | "30s-50s" | "60-plus" | null;
  onboarded: boolean;
  created_at: string;
  updated_at: string;
};

export type CycleLog = {
  id: string;
  user_id: string;
  period_start: string;
  period_end: string | null;
  created_at: string;
};

export type SymptomLog = {
  id: string;
  user_id: string;
  log_date: string;
  cramps: number | null;
  bloating: number | null;
  mood: number | null;
  energy: number | null;
  tags: string[];
  notes: string | null;
  created_at: string;
};

export type NutritionLog = {
  id: string;
  user_id: string;
  log_date: string;
  category_slug: string;
  created_at: string;
};

export type NutritionNote = {
  id: string;
  user_id: string;
  log_date: string;
  note: string;
  updated_at: string;
};

export type WaterLog = {
  id: string;
  user_id: string;
  log_date: string;
  amount_ml: number;
  logged_at: string;
};

export type WorkoutSession = {
  id: string;
  user_id: string;
  session_date: string;
  session_type: "strength" | "cardio" | "plyo" | "recovery" | "rest";
  patterns_trained: string[];
  notes: string | null;
  created_at: string;
};

export type WorkoutSet = {
  id: string;
  session_id: string;
  user_id: string;
  pattern_slug: string;
  exercise_name: string;
  variant: "gym" | "home-weights" | "bodyweight" | null;
  set_number: number;
  reps: number | null;
  weight_kg: number | null;
  is_bodyweight: boolean;
  bodyweight_level: 1 | 2 | 3 | null;
  harder_variant_markers: string[];
  created_at: string;
};

export type CardioLog = {
  id: string;
  user_id: string;
  log_date: string;
  cardio_type: "zone2" | "hiit";
  duration_minutes: number;
  notes: string | null;
  created_at: string;
};

export type PlyoLog = {
  id: string;
  user_id: string;
  log_date: string;
  age_band: "20s-30s" | "30s-50s" | "60-plus";
  exercises_completed: string[];
  sets: number | null;
  reps: number | null;
  notes: string | null;
  created_at: string;
};

export type RecoveryLog = {
  id: string;
  user_id: string;
  log_date: string;
  activity_type: "walking" | "foam-rolling" | "mobility" | "yoga" | "rest";
  duration_minutes: number | null;
  notes: string | null;
  created_at: string;
};

export type Habit = {
  id: string;
  user_id: string;
  name: string;
  category: string | null;
  is_suggested: boolean;
  archived: boolean;
  created_at: string;
};

export type HabitLog = {
  id: string;
  habit_id: string;
  user_id: string;
  log_date: string;
  created_at: string;
};

export type Task = {
  id: string;
  user_id: string;
  title: string;
  category: "workout" | "nutrition" | "cycle" | "general" | null;
  due_date: string | null;
  completed: boolean;
  created_at: string;
};
