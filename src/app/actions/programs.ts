"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { todayISO } from "@/lib/utils";

export async function createProgram(name: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not signed in");

  const { data, error } = await supabase
    .from("programs")
    .insert({ user_id: user.id, name })
    .select()
    .single();
  if (error) throw error;

  revalidatePath("/workout");
  return data;
}

export async function deleteProgram(programId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not signed in");

  const { error } = await supabase
    .from("programs")
    .delete()
    .eq("id", programId)
    .eq("user_id", user.id);
  if (error) throw error;

  revalidatePath("/workout");
}

export async function addProgramItem(input: {
  programId: string;
  exerciseName: string;
  patternSlug: string | null;
  bundleId: string | null;
  variant: "gym" | "home-weights" | "bodyweight" | null;
  sortOrder: number;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not signed in");

  const { error } = await supabase.from("program_items").insert({
    program_id: input.programId,
    user_id: user.id,
    exercise_name: input.exerciseName,
    pattern_slug: input.patternSlug,
    bundle_id: input.bundleId,
    variant: input.variant,
    sort_order: input.sortOrder,
  });
  if (error) throw error;

  revalidatePath("/workout");
}

export async function removeProgramItem(itemId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not signed in");

  const { error } = await supabase
    .from("program_items")
    .delete()
    .eq("id", itemId)
    .eq("user_id", user.id);
  if (error) throw error;

  revalidatePath("/workout");
}

// Quick-logs one working set for a program's exercise today, creating the
// day's session on first log so every entry made from the program table
// still shows up in the normal session history and progress charts.
export async function logProgramEntry(input: {
  programId: string;
  patternSlug: string | null;
  bundleId: string | null;
  exerciseName: string;
  variant: "gym" | "home-weights" | "bodyweight" | null;
  reps: number | null;
  weightKg: number | null;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not signed in");

  const today = todayISO();

  const { data: existingSession } = await supabase
    .from("workout_sessions")
    .select("id")
    .eq("user_id", user.id)
    .eq("session_date", today)
    .eq("program_id", input.programId)
    .maybeSingle();

  let sessionId = existingSession?.id as string | undefined;

  if (!sessionId) {
    const { data: newSession, error: sessionError } = await supabase
      .from("workout_sessions")
      .insert({
        user_id: user.id,
        session_date: today,
        session_type: "strength",
        program_id: input.programId,
      })
      .select("id")
      .single();
    if (sessionError) throw sessionError;
    sessionId = newSession.id;
  }

  const { count } = await supabase
    .from("workout_sets")
    .select("id", { count: "exact", head: true })
    .eq("session_id", sessionId)
    .eq("exercise_name", input.exerciseName);

  const { error } = await supabase.from("workout_sets").insert({
    session_id: sessionId,
    user_id: user.id,
    pattern_slug: input.patternSlug,
    bundle_id: input.bundleId,
    exercise_name: input.exerciseName,
    variant: input.variant,
    set_number: (count ?? 0) + 1,
    reps: input.reps,
    weight_kg: input.weightKg,
    is_bodyweight: input.variant === "bodyweight",
  });
  if (error) throw error;

  revalidatePath("/workout");
  revalidatePath("/progress");
}
