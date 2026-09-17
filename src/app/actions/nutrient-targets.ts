"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export type NutrientTargetInput = {
  nutrientName: string;
  category: "macro" | "micro";
  targetAmount: number;
  unit: string;
};

export async function upsertNutrientTarget(input: NutrientTargetInput) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not signed in");

  const { error } = await supabase.from("nutrient_targets").upsert(
    {
      user_id: user.id,
      nutrient_name: input.nutrientName,
      category: input.category,
      target_amount: input.targetAmount,
      unit: input.unit,
    },
    { onConflict: "user_id,nutrient_name" },
  );
  if (error) throw error;

  revalidatePath("/nutrition");
}

export async function bulkUpsertNutrientTargets(inputs: NutrientTargetInput[]) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not signed in");

  const { error } = await supabase.from("nutrient_targets").upsert(
    inputs.map((input) => ({
      user_id: user.id,
      nutrient_name: input.nutrientName,
      category: input.category,
      target_amount: input.targetAmount,
      unit: input.unit,
    })),
    { onConflict: "user_id,nutrient_name" },
  );
  if (error) throw error;

  revalidatePath("/nutrition");
}

export async function deleteNutrientTarget(id: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not signed in");

  const { error } = await supabase
    .from("nutrient_targets")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);
  if (error) throw error;

  revalidatePath("/nutrition");
}
