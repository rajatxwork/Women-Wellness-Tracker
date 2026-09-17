"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function createBundle(name: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not signed in");

  const { data, error } = await supabase
    .from("exercise_bundles")
    .insert({ user_id: user.id, name })
    .select()
    .single();
  if (error) throw error;

  revalidatePath("/workout");
  return data;
}

export async function deleteBundle(bundleId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not signed in");

  const { error } = await supabase
    .from("exercise_bundles")
    .delete()
    .eq("id", bundleId)
    .eq("user_id", user.id);
  if (error) throw error;

  revalidatePath("/workout");
}

export async function createCustomExercise(input: {
  name: string;
  patternSlug: string | null;
  bundleId: string | null;
  variant: "gym" | "home-weights" | "bodyweight" | null;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not signed in");

  const { error } = await supabase.from("custom_exercises").insert({
    user_id: user.id,
    name: input.name,
    pattern_slug: input.patternSlug,
    bundle_id: input.bundleId,
    variant: input.variant,
  });
  if (error) throw error;

  revalidatePath("/workout");
}

export async function deleteCustomExercise(exerciseId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not signed in");

  const { error } = await supabase
    .from("custom_exercises")
    .delete()
    .eq("id", exerciseId)
    .eq("user_id", user.id);
  if (error) throw error;

  revalidatePath("/workout");
}
