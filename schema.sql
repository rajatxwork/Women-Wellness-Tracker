-- Selene: Women's Wellness Tracker
-- Complete database schema for Supabase (Postgres + Row Level Security).
-- Run this in the Supabase SQL editor on a fresh project.
-- All user-data tables are scoped to auth.uid() via RLS policies.

create extension if not exists "pgcrypto";

-- ============================================================================
-- PROFILES
-- ============================================================================
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  name text,
  avg_cycle_length int not null default 28,
  last_period_start date,
  water_goal_ml int not null default 2000,
  age_band text check (age_band in ('20s-30s', '30s-50s', '60-plus')),
  onboarded boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "profiles are self-viewable" on public.profiles
  for select using (auth.uid() = id);
create policy "profiles are self-insertable" on public.profiles
  for insert with check (auth.uid() = id);
create policy "profiles are self-updatable" on public.profiles
  for update using (auth.uid() = id);

-- ============================================================================
-- CYCLE TRACKING
-- ============================================================================
create table if not exists public.cycle_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  period_start date not null,
  period_end date,
  created_at timestamptz not null default now()
);

alter table public.cycle_logs enable row level security;

create policy "cycle_logs are owner-scoped select" on public.cycle_logs
  for select using (auth.uid() = user_id);
create policy "cycle_logs are owner-scoped insert" on public.cycle_logs
  for insert with check (auth.uid() = user_id);
create policy "cycle_logs are owner-scoped update" on public.cycle_logs
  for update using (auth.uid() = user_id);
create policy "cycle_logs are owner-scoped delete" on public.cycle_logs
  for delete using (auth.uid() = user_id);

create table if not exists public.symptom_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  log_date date not null,
  cramps smallint check (cramps between 1 and 5),
  bloating smallint check (bloating between 1 and 5),
  mood smallint check (mood between 1 and 5),
  energy smallint check (energy between 1 and 5),
  tags text[] default '{}',
  notes text,
  created_at timestamptz not null default now(),
  unique (user_id, log_date)
);

alter table public.symptom_logs enable row level security;

create policy "symptom_logs are owner-scoped select" on public.symptom_logs
  for select using (auth.uid() = user_id);
create policy "symptom_logs are owner-scoped insert" on public.symptom_logs
  for insert with check (auth.uid() = user_id);
create policy "symptom_logs are owner-scoped update" on public.symptom_logs
  for update using (auth.uid() = user_id);
create policy "symptom_logs are owner-scoped delete" on public.symptom_logs
  for delete using (auth.uid() = user_id);

-- ============================================================================
-- NUTRITION
-- ============================================================================
create table if not exists public.nutrition_goal_categories (
  slug text primary key,
  name text not null,
  tagline text not null,
  quick_tip text,
  foods jsonb not null default '[]',
  sort_order int not null default 0
);

alter table public.nutrition_goal_categories enable row level security;

create policy "nutrition_goal_categories are readable by anyone authenticated"
  on public.nutrition_goal_categories for select
  using (auth.role() = 'authenticated');

create table if not exists public.user_goal_categories (
  user_id uuid not null references auth.users (id) on delete cascade,
  category_slug text not null references public.nutrition_goal_categories (slug),
  primary key (user_id, category_slug)
);

alter table public.user_goal_categories enable row level security;

create policy "user_goal_categories are owner-scoped select" on public.user_goal_categories
  for select using (auth.uid() = user_id);
create policy "user_goal_categories are owner-scoped insert" on public.user_goal_categories
  for insert with check (auth.uid() = user_id);
create policy "user_goal_categories are owner-scoped delete" on public.user_goal_categories
  for delete using (auth.uid() = user_id);

create table if not exists public.nutrition_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  log_date date not null,
  category_slug text not null references public.nutrition_goal_categories (slug),
  created_at timestamptz not null default now(),
  unique (user_id, log_date, category_slug)
);

alter table public.nutrition_logs enable row level security;

create policy "nutrition_logs are owner-scoped select" on public.nutrition_logs
  for select using (auth.uid() = user_id);
create policy "nutrition_logs are owner-scoped insert" on public.nutrition_logs
  for insert with check (auth.uid() = user_id);
create policy "nutrition_logs are owner-scoped delete" on public.nutrition_logs
  for delete using (auth.uid() = user_id);

create table if not exists public.nutrition_notes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  log_date date not null,
  note text not null default '',
  updated_at timestamptz not null default now(),
  unique (user_id, log_date)
);

alter table public.nutrition_notes enable row level security;

create policy "nutrition_notes are owner-scoped select" on public.nutrition_notes
  for select using (auth.uid() = user_id);
create policy "nutrition_notes are owner-scoped insert" on public.nutrition_notes
  for insert with check (auth.uid() = user_id);
create policy "nutrition_notes are owner-scoped update" on public.nutrition_notes
  for update using (auth.uid() = user_id);

create table if not exists public.water_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  log_date date not null,
  amount_ml int not null check (amount_ml > 0),
  logged_at timestamptz not null default now()
);

alter table public.water_logs enable row level security;

create policy "water_logs are owner-scoped select" on public.water_logs
  for select using (auth.uid() = user_id);
create policy "water_logs are owner-scoped insert" on public.water_logs
  for insert with check (auth.uid() = user_id);
create policy "water_logs are owner-scoped delete" on public.water_logs
  for delete using (auth.uid() = user_id);

-- A personal macro/micro nutrient target sheet the user builds herself, or
-- prefills from the built-in calculator (client-side, science-based DRI/
-- Mifflin-St Jeor math, no external API).
create table if not exists public.nutrient_targets (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  nutrient_name text not null,
  category text not null check (category in ('macro', 'micro')),
  target_amount numeric not null,
  unit text not null,
  created_at timestamptz not null default now(),
  unique (user_id, nutrient_name)
);

alter table public.nutrient_targets enable row level security;

create policy "nutrient_targets are owner-scoped select" on public.nutrient_targets
  for select using (auth.uid() = user_id);
create policy "nutrient_targets are owner-scoped insert" on public.nutrient_targets
  for insert with check (auth.uid() = user_id);
create policy "nutrient_targets are owner-scoped update" on public.nutrient_targets
  for update using (auth.uid() = user_id);
create policy "nutrient_targets are owner-scoped delete" on public.nutrient_targets
  for delete using (auth.uid() = user_id);

create table if not exists public.supplements (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  name text not null,
  dosage text,
  notes text,
  created_at timestamptz not null default now()
);

alter table public.supplements enable row level security;

create policy "supplements are owner-scoped select" on public.supplements
  for select using (auth.uid() = user_id);
create policy "supplements are owner-scoped insert" on public.supplements
  for insert with check (auth.uid() = user_id);
create policy "supplements are owner-scoped delete" on public.supplements
  for delete using (auth.uid() = user_id);

create table if not exists public.supplement_logs (
  id uuid primary key default gen_random_uuid(),
  supplement_id uuid not null references public.supplements (id) on delete cascade,
  user_id uuid not null references auth.users (id) on delete cascade,
  log_date date not null,
  taken boolean not null default true,
  created_at timestamptz not null default now(),
  unique (supplement_id, log_date)
);

alter table public.supplement_logs enable row level security;

create policy "supplement_logs are owner-scoped select" on public.supplement_logs
  for select using (auth.uid() = user_id);
create policy "supplement_logs are owner-scoped insert" on public.supplement_logs
  for insert with check (auth.uid() = user_id);
create policy "supplement_logs are owner-scoped update" on public.supplement_logs
  for update using (auth.uid() = user_id);
create policy "supplement_logs are owner-scoped delete" on public.supplement_logs
  for delete using (auth.uid() = user_id);

-- ============================================================================
-- WORKOUTS
-- ============================================================================
create table if not exists public.movement_patterns (
  slug text primary key,
  name text not null,
  priority boolean not null default false,
  sort_order int not null default 0
);

alter table public.movement_patterns enable row level security;

create policy "movement_patterns are readable by anyone authenticated"
  on public.movement_patterns for select
  using (auth.role() = 'authenticated');

create table if not exists public.exercises (
  id uuid primary key default gen_random_uuid(),
  pattern_slug text not null references public.movement_patterns (slug),
  variant text not null check (variant in ('gym', 'home-weights', 'bodyweight')),
  name text not null,
  level smallint check (level in (1, 2, 3))
);

alter table public.exercises enable row level security;

create policy "exercises are readable by anyone authenticated"
  on public.exercises for select
  using (auth.role() = 'authenticated');

-- User-defined bundles: a free-form alternative to the book's 8 movement
-- patterns, for exercises that don't fit neatly into any of them.
create table if not exists public.exercise_bundles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  name text not null,
  created_at timestamptz not null default now()
);

alter table public.exercise_bundles enable row level security;

create policy "exercise_bundles are owner-scoped select" on public.exercise_bundles
  for select using (auth.uid() = user_id);
create policy "exercise_bundles are owner-scoped insert" on public.exercise_bundles
  for insert with check (auth.uid() = user_id);
create policy "exercise_bundles are owner-scoped update" on public.exercise_bundles
  for update using (auth.uid() = user_id);
create policy "exercise_bundles are owner-scoped delete" on public.exercise_bundles
  for delete using (auth.uid() = user_id);

-- Custom exercises a user adds herself, attached to either one of the
-- book's built-in movement patterns or one of her own bundles above.
create table if not exists public.custom_exercises (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  name text not null,
  pattern_slug text references public.movement_patterns (slug),
  bundle_id uuid references public.exercise_bundles (id) on delete cascade,
  variant text check (variant in ('gym', 'home-weights', 'bodyweight')),
  created_at timestamptz not null default now(),
  constraint custom_exercise_has_one_home check (
    (pattern_slug is not null and bundle_id is null)
    or (pattern_slug is null and bundle_id is not null)
  )
);

alter table public.custom_exercises enable row level security;

create policy "custom_exercises are owner-scoped select" on public.custom_exercises
  for select using (auth.uid() = user_id);
create policy "custom_exercises are owner-scoped insert" on public.custom_exercises
  for insert with check (auth.uid() = user_id);
create policy "custom_exercises are owner-scoped delete" on public.custom_exercises
  for delete using (auth.uid() = user_id);

-- Programs: a named training plan a user builds from her own chosen
-- movements (built-in or custom), logged and tracked over time.
create table if not exists public.programs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  name text not null,
  created_at timestamptz not null default now()
);

alter table public.programs enable row level security;

create policy "programs are owner-scoped select" on public.programs
  for select using (auth.uid() = user_id);
create policy "programs are owner-scoped insert" on public.programs
  for insert with check (auth.uid() = user_id);
create policy "programs are owner-scoped update" on public.programs
  for update using (auth.uid() = user_id);
create policy "programs are owner-scoped delete" on public.programs
  for delete using (auth.uid() = user_id);

create table if not exists public.program_items (
  id uuid primary key default gen_random_uuid(),
  program_id uuid not null references public.programs (id) on delete cascade,
  user_id uuid not null references auth.users (id) on delete cascade,
  pattern_slug text references public.movement_patterns (slug),
  bundle_id uuid references public.exercise_bundles (id) on delete set null,
  exercise_name text not null,
  variant text check (variant in ('gym', 'home-weights', 'bodyweight')),
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

alter table public.program_items enable row level security;

create policy "program_items are owner-scoped select" on public.program_items
  for select using (auth.uid() = user_id);
create policy "program_items are owner-scoped insert" on public.program_items
  for insert with check (auth.uid() = user_id);
create policy "program_items are owner-scoped delete" on public.program_items
  for delete using (auth.uid() = user_id);

create table if not exists public.workout_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  session_date date not null,
  session_type text not null default 'strength'
    check (session_type in ('strength', 'cardio', 'plyo', 'recovery', 'rest')),
  patterns_trained text[] default '{}',
  program_id uuid references public.programs (id) on delete set null,
  notes text,
  created_at timestamptz not null default now()
);

alter table public.workout_sessions enable row level security;

create policy "workout_sessions are owner-scoped select" on public.workout_sessions
  for select using (auth.uid() = user_id);
create policy "workout_sessions are owner-scoped insert" on public.workout_sessions
  for insert with check (auth.uid() = user_id);
create policy "workout_sessions are owner-scoped update" on public.workout_sessions
  for update using (auth.uid() = user_id);
create policy "workout_sessions are owner-scoped delete" on public.workout_sessions
  for delete using (auth.uid() = user_id);

create table if not exists public.workout_sets (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references public.workout_sessions (id) on delete cascade,
  user_id uuid not null references auth.users (id) on delete cascade,
  pattern_slug text references public.movement_patterns (slug),
  bundle_id uuid references public.exercise_bundles (id) on delete set null,
  exercise_name text not null,
  variant text check (variant in ('gym', 'home-weights', 'bodyweight')),
  set_number int not null default 1,
  reps int,
  weight_kg numeric,
  is_bodyweight boolean not null default false,
  bodyweight_level smallint check (bodyweight_level in (1, 2, 3)),
  harder_variant_markers text[] default '{}',
  created_at timestamptz not null default now()
);

alter table public.workout_sets enable row level security;

create policy "workout_sets are owner-scoped select" on public.workout_sets
  for select using (auth.uid() = user_id);
create policy "workout_sets are owner-scoped insert" on public.workout_sets
  for insert with check (auth.uid() = user_id);
create policy "workout_sets are owner-scoped update" on public.workout_sets
  for update using (auth.uid() = user_id);
create policy "workout_sets are owner-scoped delete" on public.workout_sets
  for delete using (auth.uid() = user_id);

create table if not exists public.cardio_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  log_date date not null,
  cardio_type text not null check (cardio_type in ('zone2', 'hiit')),
  duration_minutes int not null check (duration_minutes > 0),
  notes text,
  created_at timestamptz not null default now()
);

alter table public.cardio_logs enable row level security;

create policy "cardio_logs are owner-scoped select" on public.cardio_logs
  for select using (auth.uid() = user_id);
create policy "cardio_logs are owner-scoped insert" on public.cardio_logs
  for insert with check (auth.uid() = user_id);
create policy "cardio_logs are owner-scoped update" on public.cardio_logs
  for update using (auth.uid() = user_id);
create policy "cardio_logs are owner-scoped delete" on public.cardio_logs
  for delete using (auth.uid() = user_id);

create table if not exists public.plyo_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  log_date date not null,
  age_band text not null check (age_band in ('20s-30s', '30s-50s', '60-plus')),
  exercises_completed text[] default '{}',
  sets int,
  reps int,
  notes text,
  created_at timestamptz not null default now()
);

alter table public.plyo_logs enable row level security;

create policy "plyo_logs are owner-scoped select" on public.plyo_logs
  for select using (auth.uid() = user_id);
create policy "plyo_logs are owner-scoped insert" on public.plyo_logs
  for insert with check (auth.uid() = user_id);
create policy "plyo_logs are owner-scoped update" on public.plyo_logs
  for update using (auth.uid() = user_id);
create policy "plyo_logs are owner-scoped delete" on public.plyo_logs
  for delete using (auth.uid() = user_id);

create table if not exists public.recovery_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  log_date date not null,
  activity_type text not null
    check (activity_type in ('walking', 'foam-rolling', 'mobility', 'yoga', 'rest')),
  duration_minutes int,
  notes text,
  created_at timestamptz not null default now()
);

alter table public.recovery_logs enable row level security;

create policy "recovery_logs are owner-scoped select" on public.recovery_logs
  for select using (auth.uid() = user_id);
create policy "recovery_logs are owner-scoped insert" on public.recovery_logs
  for insert with check (auth.uid() = user_id);
create policy "recovery_logs are owner-scoped update" on public.recovery_logs
  for update using (auth.uid() = user_id);
create policy "recovery_logs are owner-scoped delete" on public.recovery_logs
  for delete using (auth.uid() = user_id);

-- ============================================================================
-- HABITS
-- ============================================================================
create table if not exists public.habits (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  name text not null,
  category text,
  is_suggested boolean not null default false,
  archived boolean not null default false,
  created_at timestamptz not null default now()
);

alter table public.habits enable row level security;

create policy "habits are owner-scoped select" on public.habits
  for select using (auth.uid() = user_id);
create policy "habits are owner-scoped insert" on public.habits
  for insert with check (auth.uid() = user_id);
create policy "habits are owner-scoped update" on public.habits
  for update using (auth.uid() = user_id);
create policy "habits are owner-scoped delete" on public.habits
  for delete using (auth.uid() = user_id);

create table if not exists public.habit_logs (
  id uuid primary key default gen_random_uuid(),
  habit_id uuid not null references public.habits (id) on delete cascade,
  user_id uuid not null references auth.users (id) on delete cascade,
  log_date date not null,
  created_at timestamptz not null default now(),
  unique (habit_id, log_date)
);

alter table public.habit_logs enable row level security;

create policy "habit_logs are owner-scoped select" on public.habit_logs
  for select using (auth.uid() = user_id);
create policy "habit_logs are owner-scoped insert" on public.habit_logs
  for insert with check (auth.uid() = user_id);
create policy "habit_logs are owner-scoped delete" on public.habit_logs
  for delete using (auth.uid() = user_id);

-- ============================================================================
-- TASKS
-- ============================================================================
create table if not exists public.tasks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  title text not null,
  category text check (category in ('workout', 'nutrition', 'cycle', 'general')),
  due_date date,
  completed boolean not null default false,
  created_at timestamptz not null default now()
);

alter table public.tasks enable row level security;

create policy "tasks are owner-scoped select" on public.tasks
  for select using (auth.uid() = user_id);
create policy "tasks are owner-scoped insert" on public.tasks
  for insert with check (auth.uid() = user_id);
create policy "tasks are owner-scoped update" on public.tasks
  for update using (auth.uid() = user_id);
create policy "tasks are owner-scoped delete" on public.tasks
  for delete using (auth.uid() = user_id);

-- ============================================================================
-- SEED DATA, reference content extracted from the companion e-book
-- ============================================================================

insert into public.movement_patterns (slug, name, priority, sort_order) values
  ('squat', 'Squat', true, 1),
  ('hinge', 'Hinge', true, 2),
  ('pull', 'Pull', true, 3),
  ('push-press', 'Push & Press', true, 4),
  ('quads-adductors-abductors', 'Quads, Adductors & Abductors', false, 5),
  ('calves', 'Calves', false, 6),
  ('arms', 'Arms', false, 7),
  ('shoulders', 'Shoulders', false, 8)
on conflict (slug) do nothing;

insert into public.exercises (pattern_slug, variant, name, level) values
  ('squat', 'gym', 'Goblet squat', null),
  ('squat', 'gym', 'Hack squat', null),
  ('squat', 'gym', 'Any machine squat', null),
  ('squat', 'gym', 'Box squat', null),
  ('squat', 'home-weights', 'Kettlebell or dumbbell goblet squat', null),
  ('squat', 'home-weights', 'Squat holding a filled water jug or household item', null),
  ('squat', 'bodyweight', 'Bodyweight squats', 2),
  ('squat', 'bodyweight', 'Box squats using a sturdy chair', 1),
  ('squat', 'bodyweight', 'Reverse lunges', 1),
  ('squat', 'bodyweight', 'Pistol squats', 3),
  ('squat', 'bodyweight', 'Elevated split squats', 3),

  ('hinge', 'gym', 'Romanian deadlifts', null),
  ('hinge', 'gym', 'Glute ham raises', null),
  ('hinge', 'gym', 'Kettlebell swings', null),
  ('hinge', 'gym', 'Hip thrusts (machine, barbell, or smith machine)', null),
  ('hinge', 'gym', 'Cable pull throughs', null),
  ('hinge', 'home-weights', 'Kettlebell or dumbbell Romanian deadlifts', null),
  ('hinge', 'home-weights', 'Kettlebell swings', null),
  ('hinge', 'home-weights', 'Floor hip thrusts holding a weight across your hips', null),
  ('hinge', 'bodyweight', 'Floor glute bridges', 1),
  ('hinge', 'bodyweight', 'Bodyweight Romanian deadlifts', null),
  ('hinge', 'bodyweight', 'Single leg hip hinges', null),
  ('hinge', 'bodyweight', 'Single leg glute bridges', 2),

  ('pull', 'gym', 'Lat pulldowns', null),
  ('pull', 'gym', 'Pull ups or assisted pull ups', null),
  ('pull', 'gym', 'Dumbbell or kettlebell rows', null),
  ('pull', 'gym', 'Barbell rows', null),
  ('pull', 'gym', 'Cable rows', null),
  ('pull', 'gym', 'Machine rows', null),
  ('pull', 'home-weights', 'Dumbbell or kettlebell rows', null),
  ('pull', 'home-weights', 'Banded rows using a resistance band anchored to a door', null),
  ('pull', 'bodyweight', 'Doorway rows holding a door frame and pulling yourself in', 1),
  ('pull', 'bodyweight', 'Table rows using a sturdy table', 2),
  ('pull', 'bodyweight', 'Slow negative pull ups', 3),

  ('push-press', 'gym', 'Dumbbell incline bench press', null),
  ('push-press', 'gym', 'Any machine chest press', null),
  ('push-press', 'gym', 'Dumbbell shoulder press', null),
  ('push-press', 'gym', 'Any machine shoulder press', null),
  ('push-press', 'home-weights', 'Dumbbell floor press', null),
  ('push-press', 'home-weights', 'Dumbbell shoulder press', null),
  ('push-press', 'bodyweight', 'Push ups', 2),
  ('push-press', 'bodyweight', 'Wall or incline push ups against a counter', 1),
  ('push-press', 'bodyweight', 'Strict push ups', 3),

  ('quads-adductors-abductors', 'gym', 'Quad extension machine', null),
  ('quads-adductors-abductors', 'gym', 'Adduction and abduction machines', null),
  ('quads-adductors-abductors', 'home-weights', 'Lateral lunges', null),
  ('quads-adductors-abductors', 'home-weights', 'Side lying leg raises', null),
  ('quads-adductors-abductors', 'home-weights', 'Standing inner/outer thigh leg lifts with an ankle band', null),
  ('quads-adductors-abductors', 'bodyweight', 'Lateral lunges', 2),
  ('quads-adductors-abductors', 'bodyweight', 'Side lying leg raises', null),
  ('quads-adductors-abductors', 'bodyweight', 'Standing inner and outer thigh leg lifts', null),
  ('quads-adductors-abductors', 'bodyweight', 'Skater squats', 3),

  ('calves', 'gym', 'Standing calf raises', null),
  ('calves', 'home-weights', 'Standing calf raises off the edge of a step', null),
  ('calves', 'bodyweight', 'Standing calf raises on a flat floor or off a step edge', 2),

  ('arms', 'gym', 'Dumbbell curls', null),
  ('arms', 'gym', 'Tricep press downs', null),
  ('arms', 'home-weights', 'Dumbbell curls', null),
  ('arms', 'home-weights', 'Tricep press downs', null),
  ('arms', 'bodyweight', 'Close grip push ups', null),
  ('arms', 'bodyweight', 'Doorway tricep presses', null),

  ('shoulders', 'gym', 'Lateral raises', null),
  ('shoulders', 'gym', 'Face pulls using a resistance band', null),
  ('shoulders', 'home-weights', 'Lateral raises', null),
  ('shoulders', 'home-weights', 'Face pulls using a resistance band', null),
  ('shoulders', 'bodyweight', 'Bodyweight external rotation drills against light resistance', null)
on conflict do nothing;

insert into public.nutrition_goal_categories (slug, name, tagline, quick_tip, foods, sort_order) values
('focus-brain', 'Focus & Brain',
 'Your ability to concentrate is not just about willpower, it depends on specific nutrients your brain needs to make its own focus chemicals.',
 null,
 '[
   {"food":"Eggs, especially the yolk","why":"They contain choline, which your brain directly turns into the chemical responsible for memory and staying on task."},
   {"food":"Salmon and other fatty fish","why":"These give your brain omega-3 fats, basically brain building material, plus they support blood flow to the parts of your brain involved in memory."},
   {"food":"Chickpeas and salmon","why":"Both are great sources of vitamin B6, which helps your brain produce dopamine, your natural motivation and drive chemical."},
   {"food":"Red meat and lentils","why":"These are rich in iron, and low iron is one of the most common, sneaky reasons for brain fog in women specifically, since periods cause regular iron loss."},
   {"food":"Pumpkin seeds and dark chocolate","why":"These bring magnesium, which helps calm an overstimulated, scattered brain so you can actually focus instead of feeling wired and jumpy."},
   {"food":"Blueberries and dark chocolate","why":"These contain natural plant compounds that improve blood flow to memory-centered parts of your brain."},
   {"food":"Citrus fruits and bell peppers","why":"Vitamin C helps your body properly use the iron from plant foods and helps convert your focus chemicals into their active form."}
 ]'::jsonb, 1),
('energy', 'Energy',
 'Feeling tired all the time is usually not about needing more coffee, it''s usually about your body missing the raw materials it needs to make energy at a cellular level.',
 'If you crash hard in the afternoon, look at what you had earlier, a meal of only fast-digesting carbs with nothing else tends to be the culprit.',
 '[
   {"food":"Red meat, lentils, and spinach","why":"Iron carries oxygen through your blood to fuel every cell in your body."},
   {"food":"Whole grains, pork, and legumes","why":"These contain B1, one of the very first steps your body takes to turn food into usable energy."},
   {"food":"Eggs, dairy, and mushrooms","why":"Rich in B2 and B5, both directly involved in your body''s energy production process."},
   {"food":"Poultry, tuna, and peanuts","why":"These provide niacin, which fuels a molecule your cells use constantly to generate energy."},
   {"food":"Pumpkin seeds, dark chocolate, and almonds","why":"Magnesium is required to actually activate the energy your body produces."},
   {"food":"Oats, sweet potato, and quinoa","why":"These are slow releasing carbohydrates, meaning steady energy for hours instead of a quick spike and crash."}
 ]'::jsonb, 2),
('bone-joint', 'Bone & Joint Health',
 'This one matters more than most people realize, and starting now genuinely protects you decades down the line.',
 null,
 '[
   {"food":"Dairy, fortified plant milk, and leafy greens","why":"Calcium is the actual building block of your bones."},
   {"food":"Fatty fish, egg yolks, and safe sun exposure","why":"Vitamin D is what allows your body to actually absorb that calcium."},
   {"food":"Fermented foods like natto, and leafy greens","why":"Vitamin K helps direct calcium into your bones specifically."},
   {"food":"Pumpkin seeds and almonds","why":"Magnesium supports the cells responsible for actually building new bone tissue."},
   {"food":"Bone broth and gelatin","why":"These provide collagen building blocks that support flexible, healthy joints and cartilage."},
   {"food":"Salmon, sardines, and chia seeds","why":"Omega-3 fats calm down the kind of inflammation that wears joints out over time."},
   {"food":"Citrus fruits and strawberries","why":"Vitamin C is essential for your body to actually build collagen in your tendons and ligaments."}
 ]'::jsonb, 3),
('muscle-recovery', 'Muscle & Recovery',
 'Muscle isn''t just about how you look, it protects your metabolism, your joints, and your independence as you get older.',
 null,
 '[
   {"food":"Chicken breast, Greek yogurt, eggs, and lentils","why":"These are rich in leucine, a specific amino acid that directly tells your body to build muscle."},
   {"food":"Beef, salmon, and herring","why":"These provide natural creatine, which helps regenerate quick energy during strength training."},
   {"food":"Salmon and walnuts","why":"Omega-3 fats help your muscles actually absorb and use the protein you eat, and reduce post-workout soreness."},
   {"food":"Fortified dairy and egg yolks","why":"Vitamin D and calcium work together to help your muscles contract properly and recover well."}
 ]'::jsonb, 4),
('skin-hair-nails', 'Skin, Hair & Nails',
 'Your skin, hair, and nails are made from the same nutrients as everything else in your body, they just show a deficiency faster and more visibly.',
 null,
 '[
   {"food":"Bone broth and collagen-rich foods","why":"These directly supply the building blocks for skin elasticity."},
   {"food":"Citrus fruits, bell peppers, and strawberries","why":"Vitamin C is required for your body to actually produce collagen, and protects your skin from sun-related damage."},
   {"food":"Eggs, almonds, and sweet potatoes","why":"Biotin supports keratin production, and low biotin is a common, correctable cause of brittle nails."},
   {"food":"Oysters, beef, and pumpkin seeds","why":"Zinc also supports keratin and helps your skin heal faster."},
   {"food":"Almonds, sunflower seeds, and avocado","why":"Vitamin E protects your skin cells and supports healthy, even skin turnover."}
 ]'::jsonb, 5),
('sleep', 'Sleep',
 'Good sleep isn''t only about your bedtime routine, it''s genuinely influenced by what you eat.',
 null,
 '[
   {"food":"Turkey, eggs, and seeds","why":"These contain tryptophan, which your body converts into serotonin and then into melatonin, your sleep hormone."},
   {"food":"Pumpkin seeds, dark chocolate, and spinach","why":"Magnesium calms your nervous system and helps reduce waking up in the middle of the night."},
   {"food":"Bone broth and gelatin","why":"These provide glycine, which helps lower your body temperature slightly to help you fall asleep faster."},
   {"food":"Red meat and lentils","why":"Iron plays a role in preventing restless, twitchy legs that can keep you from settling down at night."}
 ]'::jsonb, 6),
('hormones-cycle', 'Hormones & Cycle Support',
 'Your nutritional needs genuinely shift across your cycle, and working with that instead of against it makes a real difference.',
 null,
 '[
   {"food":"Healthy carbs, first half of your cycle","why":"Your body handles carbohydrates especially efficiently here, so this is a great time to fuel workouts and active days."},
   {"food":"A bit more food, second half of your cycle","why":"Your metabolism actually rises slightly and cravings increase, this is biology, not a lack of willpower."},
   {"food":"Onions, cooked and cooled potatoes, and apples","why":"These feed the healthy gut bacteria that help regulate your circulating hormone levels."},
   {"food":"Salmon, walnuts, and flaxseed","why":"Omega-3s support healthy hormone production overall."},
   {"food":"Avocado, olive oil, and nuts","why":"Your hormones are literally made from fat, don''t go too low on healthy fats if you want a stable, regular cycle."}
 ]'::jsonb, 7),
('immune', 'Immune System',
 'Your immune system isn''t something you only think about when you''re already sick, you can genuinely support it every single day through food.',
 null,
 '[
   {"food":"Oysters, beef, and pumpkin seeds","why":"Zinc is one of the most important minerals for immune defense and wound healing."},
   {"food":"Citrus fruits, bell peppers, and strawberries","why":"Vitamin C supports your immune cells directly."},
   {"food":"Fatty fish, egg yolks, and safe sun exposure","why":"Vitamin D plays a real role in regulating your immune response."},
   {"food":"Brazil nuts and tuna","why":"Selenium supports your body''s natural antioxidant defenses while your immune system is working hard."},
   {"food":"Garlic, onions, and cruciferous vegetables","why":"These contain sulfur compounds that support your body''s natural detoxification and immune processes."}
 ]'::jsonb, 8),
('mood', 'Mood',
 'Mood isn''t purely psychological, a good portion of it is genuinely chemical, and that chemistry runs on food.',
 null,
 '[
   {"food":"Turkey, eggs, and seeds","why":"Tryptophan is the direct building block for serotonin, your body''s natural mood-stabilizing chemical."},
   {"food":"Chickpeas, salmon, and poultry","why":"Vitamin B6 is a key part of actually producing both serotonin and dopamine."},
   {"food":"Salmon, walnuts, and flaxseed","why":"Omega-3 fats are linked to more stable mood and lower inflammation."},
   {"food":"Pumpkin seeds, dark chocolate, and spinach","why":"Magnesium has a genuine calming effect on your nervous system."},
   {"food":"Dark leafy greens, lentils, and beans","why":"Folate plays a role in producing mood-related brain chemicals."}
 ]'::jsonb, 9),
('digestion-gut', 'Digestion & Gut Health',
 'A happy gut affects way more than just digestion, it actually influences your hormones, your mood, and your immune system too.',
 null,
 '[
   {"food":"Onions, cooked and cooled potatoes, and apples","why":"These feed your beneficial gut bacteria with fermentable fiber."},
   {"food":"Fermented foods like natto and other fermented vegetables","why":"These introduce beneficial bacteria directly into your gut."},
   {"food":"Oats and legumes","why":"Rich in soluble fiber, which forms a gentle, gel-like substance that supports regular, comfortable digestion."},
   {"food":"Bone broth","why":"Gentle on digestion and provides amino acids that support the lining of your gut."},
   {"food":"Water, consistently through the day","why":"Fiber needs water to actually work properly in your digestive system."}
 ]'::jsonb, 10),
('heart', 'Heart Health',
 'Heart health isn''t just a concern for later in life, the habits that protect it are worth building now.',
 null,
 '[
   {"food":"Olive oil, avocado, and almonds","why":"Unsaturated fats support healthy blood flow and are linked to better heart health outcomes."},
   {"food":"Salmon, sardines, and mackerel","why":"Omega-3 fats specifically support a healthy heart rhythm and help lower inflammation."},
   {"food":"Bananas, potatoes, and spinach","why":"Potassium helps regulate healthy blood pressure."},
   {"food":"Oats and legumes","why":"The soluble fiber in these foods is linked to healthier cholesterol levels over time."},
   {"food":"Berries, dark chocolate, and green tea","why":"These contain plant compounds that support healthy blood vessels and lower oxidative stress."}
 ]'::jsonb, 11),
('metabolism', 'Metabolism',
 'Your metabolism isn''t simply fast or slow forever, it''s genuinely influenced by what and how you eat.',
 null,
 '[
   {"food":"Iodized salt, seaweed, and dairy","why":"Iodine is required to produce your thyroid hormones, and your thyroid largely sets your metabolic rate."},
   {"food":"Brazil nuts and tuna","why":"Selenium helps your body properly convert thyroid hormone into its active, usable form."},
   {"food":"Chicken breast, eggs, and lentils","why":"Adequate protein supports your metabolism because your body burns more energy digesting protein."},
   {"food":"Broccoli and whole grains","why":"The chromium in these foods supports how effectively your body uses insulin and processes carbohydrates."},
   {"food":"Regular meals rather than long gaps or skipping","why":"Consistently under-eating can actually slow your metabolism down over time."}
 ]'::jsonb, 12),
('period-cramps', 'Period & Cramps',
 'Period pain is common, but that doesn''t mean it has to be your normal, nutrition genuinely plays a role here.',
 null,
 '[
   {"food":"Pumpkin seeds, dark chocolate, and spinach","why":"Magnesium helps relax the uterine muscle itself, directly reducing cramp intensity for a lot of women."},
   {"food":"Salmon, walnuts, and flaxseed","why":"Omega-3 fats help lower the inflammatory compounds partly responsible for period pain."},
   {"food":"Red meat and lentils","why":"Since you lose iron during your period, replenishing it afterward helps prevent extra fatigue."},
   {"food":"Bananas and potatoes","why":"Potassium can help ease bloating by supporting your body''s natural fluid balance."},
   {"food":"Ginger tea","why":"Long used to help ease nausea and cramping, with some research supporting its use for period pain specifically."}
 ]'::jsonb, 13),
('long-term-brain', 'Long Term Brain Health',
 'This is less about how you feel today and more about investing in how you think and remember decades from now.',
 null,
 '[
   {"food":"Blueberries, blackberries, dark chocolate, and green tea","why":"These contain plant compounds that reduce inflammation in the brain over the long run."},
   {"food":"Eggs, wild-caught fish, lentils, and leafy greens","why":"Together these provide B6, folate, and B12, all of which lower a compound linked to long-term cognitive decline."},
   {"food":"Egg yolks, beef liver, and chicken","why":"Choline continues to support memory circuits well beyond your twenties and thirties."},
   {"food":"Kale, spinach, and egg yolks","why":"These contain compounds that build up in your eyes over time and protect your vision as you age."},
   {"food":"Olive oil, turmeric, and berries","why":"These contain plant compounds linked to healthy cellular aging throughout your whole body, brain included."}
 ]'::jsonb, 14)
on conflict (slug) do nothing;

-- ============================================================================
-- Keep updated_at fresh on profiles
-- ============================================================================
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();
