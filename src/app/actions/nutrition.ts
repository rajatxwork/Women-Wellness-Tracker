"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { todayISO } from "@/lib/utils";

export async function setUserGoalCategories(categorySlugs: string[]) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not signed in");

  await supabase.from("user_goal_categories").delete().eq("user_id", user.id);

  if (categorySlugs.length > 0) {
    const { error } = await supabase.from("user_goal_categories").insert(
      categorySlugs.map((slug) => ({ user_id: user.id, category_slug: slug })),
    );
    if (error) throw error;
  }

  revalidatePath("/nutrition");
  revalidatePath("/");
}

export async function toggleNutritionCategory(
  categorySlug: string,
  logDate: string = todayISO(),
) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not signed in");

  const { data: existing } = await supabase
    .from("nutrition_logs")
    .select("id")
    .eq("user_id", user.id)
    .eq("log_date", logDate)
    .eq("category_slug", categorySlug)
    .maybeSingle();

  if (existing) {
    await supabase.from("nutrition_logs").delete().eq("id", existing.id);
  } else {
    await supabase.from("nutrition_logs").insert({
      user_id: user.id,
      log_date: logDate,
      category_slug: categorySlug,
    });
  }

  revalidatePath("/nutrition");
  revalidatePath("/");
  revalidatePath("/progress");
}

export async function saveMealNote(note: string, logDate: string = todayISO()) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not signed in");

  const { error } = await supabase.from("nutrition_notes").upsert(
    { user_id: user.id, log_date: logDate, note },
    { onConflict: "user_id,log_date" },
  );
  if (error) throw error;

  revalidatePath("/nutrition");
}
