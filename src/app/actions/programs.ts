"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { todayISO } from "@/lib/utils";

// The Workout page now has exactly one implicit weekly program per user
// (the editable "This week" builder) rather than a list of named programs a
// user manages directly. This finds that program, creating it on first use.
async function getOrCreateWeekProgram(
  supabase: Awaited<ReturnType<typeof createClient>>,
  userId: string,
) {
  const { data: existing } = await supabase
    .from("programs")
    .select("id")
    .eq("user_id", userId)
    .order("created_at", { ascending: true })
    .limit(1)
    .maybeSingle();
  if (existing) return existing.id as string;

  const { data: created, error } = await supabase
    .from("programs")
    .insert({ user_id: userId, name: "My Week" })
    .select("id")
    .single();
  if (error) throw error;
  return created.id as string;
}

// Adds a movement directly to a day in the user's week, creating her one
// implicit program on first use so the caller never has to think about
// program ids.
export async function addWeekMovement(input: {
  dayOfWeek: number;
  exerciseName: string;
  patternSlug: string | null;
  bundleId: string | null;
  variant: "gym" | "home-weights" | "bodyweight" | null;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not signed in");

  const programId = await getOrCreateWeekProgram(supabase, user.id);

  const { count } = await supabase
    .from("program_items")
    .select("id", { count: "exact", head: true })
    .eq("program_id", programId)
    .eq("day_of_week", input.dayOfWeek);

  const { error } = await supabase.from("program_items").insert({
    program_id: programId,
    user_id: user.id,
    exercise_name: input.exerciseName,
    pattern_slug: input.patternSlug,
    bundle_id: input.bundleId,
    variant: input.variant,
    day_of_week: input.dayOfWeek,
    sort_order: count ?? 0,
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
