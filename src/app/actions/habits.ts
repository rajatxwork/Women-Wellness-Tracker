"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { todayISO } from "@/lib/utils";

export async function createHabit(name: string, category: string = "general") {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not signed in");

  const { error } = await supabase.from("habits").insert({
    user_id: user.id,
    name,
    category,
  });
  if (error) throw error;

  revalidatePath("/habits");
  revalidatePath("/");
}

export async function toggleSuggestedHabit(name: string, category: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not signed in");

  const { data: existing } = await supabase
    .from("habits")
    .select("id")
    .eq("user_id", user.id)
    .eq("name", name)
    .eq("is_suggested", true)
    .maybeSingle();

  if (existing) {
    await supabase.from("habits").delete().eq("id", existing.id);
  } else {
    await supabase.from("habits").insert({
      user_id: user.id,
      name,
      category,
      is_suggested: true,
    });
  }

  revalidatePath("/habits");
  revalidatePath("/");
}

export async function archiveHabit(habitId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not signed in");

  const { error } = await supabase
    .from("habits")
    .update({ archived: true })
    .eq("id", habitId)
    .eq("user_id", user.id);
  if (error) throw error;

  revalidatePath("/habits");
  revalidatePath("/");
}

export async function toggleHabitLog(habitId: string, logDate: string = todayISO()) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not signed in");

  const { data: existing } = await supabase
    .from("habit_logs")
    .select("id")
    .eq("habit_id", habitId)
    .eq("log_date", logDate)
    .maybeSingle();

  if (existing) {
    await supabase.from("habit_logs").delete().eq("id", existing.id);
  } else {
    await supabase.from("habit_logs").insert({
      habit_id: habitId,
      user_id: user.id,
      log_date: logDate,
    });
  }

  revalidatePath("/habits");
  revalidatePath("/");
  revalidatePath("/progress");
}
