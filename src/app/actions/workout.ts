"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { todayISO } from "@/lib/utils";

export type SetInput = {
  patternSlug: string;
  exerciseName: string;
  variant: "gym" | "home-weights" | "bodyweight" | null;
  setNumber: number;
  reps: number | null;
  weightKg: number | null;
  isBodyweight: boolean;
  bodyweightLevel: 1 | 2 | 3 | null;
  harderVariantMarkers: string[];
};

export async function logWorkoutSession(input: {
  sessionDate: string;
  patternsTrained: string[];
  notes: string | null;
  sets: SetInput[];
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not signed in");

  const { data: session, error: sessionError } = await supabase
    .from("workout_sessions")
    .insert({
      user_id: user.id,
      session_date: input.sessionDate,
      session_type: "strength",
      patterns_trained: input.patternsTrained,
      notes: input.notes,
    })
    .select()
    .single();
  if (sessionError) throw sessionError;

  if (input.sets.length > 0) {
    const { error: setsError } = await supabase.from("workout_sets").insert(
      input.sets.map((s) => ({
        session_id: session.id,
        user_id: user.id,
        pattern_slug: s.patternSlug,
        exercise_name: s.exerciseName,
        variant: s.variant,
        set_number: s.setNumber,
        reps: s.reps,
        weight_kg: s.weightKg,
        is_bodyweight: s.isBodyweight,
        bodyweight_level: s.bodyweightLevel,
        harder_variant_markers: s.harderVariantMarkers,
      })),
    );
    if (setsError) throw setsError;
  }

  revalidatePath("/workout");
  revalidatePath("/");
  revalidatePath("/progress");
}

export async function logCardio(input: {
  logDate?: string;
  cardioType: "zone2" | "hiit";
  durationMinutes: number;
  notes?: string;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not signed in");

  const { error } = await supabase.from("cardio_logs").insert({
    user_id: user.id,
    log_date: input.logDate ?? todayISO(),
    cardio_type: input.cardioType,
    duration_minutes: input.durationMinutes,
    notes: input.notes ?? null,
  });
  if (error) throw error;

  await supabase.from("workout_sessions").insert({
    user_id: user.id,
    session_date: input.logDate ?? todayISO(),
    session_type: "cardio",
    notes: input.notes ?? null,
  });

  revalidatePath("/workout");
  revalidatePath("/");
  revalidatePath("/progress");
}

export async function logPlyo(input: {
  logDate?: string;
  ageBand: "20s-30s" | "30s-50s" | "60-plus";
  exercisesCompleted: string[];
  sets?: number;
  reps?: number;
  notes?: string;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not signed in");

  const { error } = await supabase.from("plyo_logs").insert({
    user_id: user.id,
    log_date: input.logDate ?? todayISO(),
    age_band: input.ageBand,
    exercises_completed: input.exercisesCompleted,
    sets: input.sets ?? null,
    reps: input.reps ?? null,
    notes: input.notes ?? null,
  });
  if (error) throw error;

  await supabase.from("workout_sessions").insert({
    user_id: user.id,
    session_date: input.logDate ?? todayISO(),
    session_type: "plyo",
    notes: input.notes ?? null,
  });

  revalidatePath("/workout");
  revalidatePath("/");
  revalidatePath("/progress");
}

export async function logRecovery(input: {
  logDate?: string;
  activityType: "walking" | "foam-rolling" | "mobility" | "yoga" | "rest";
  durationMinutes?: number;
  notes?: string;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not signed in");

  const { error } = await supabase.from("recovery_logs").insert({
    user_id: user.id,
    log_date: input.logDate ?? todayISO(),
    activity_type: input.activityType,
    duration_minutes: input.durationMinutes ?? null,
    notes: input.notes ?? null,
  });
  if (error) throw error;

  await supabase.from("workout_sessions").insert({
    user_id: user.id,
    session_date: input.logDate ?? todayISO(),
    session_type: "recovery",
    notes: input.notes ?? null,
  });

  revalidatePath("/workout");
  revalidatePath("/");
  revalidatePath("/progress");
}
