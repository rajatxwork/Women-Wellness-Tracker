"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function saveTrainingProfile(input: {
  ageBand: "20s-30s" | "30s-50s" | "60-plus";
  trainingLevel: "beginner" | "intermediate" | "advanced";
  goalSlugs: string[];
  preferredVariant: "gym" | "home-weights" | "bodyweight";
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not signed in");

  const { error } = await supabase
    .from("profiles")
    .update({
      age_band: input.ageBand,
      training_level: input.trainingLevel,
      workout_goal_slugs: input.goalSlugs,
      preferred_variant: input.preferredVariant,
    })
    .eq("id", user.id);
  if (error) throw error;

  revalidatePath("/workout");
  revalidatePath("/");
}
