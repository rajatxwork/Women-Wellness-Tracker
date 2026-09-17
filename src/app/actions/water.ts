"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { todayISO } from "@/lib/utils";

export async function addWater(amountMl: number, logDate: string = todayISO()) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not signed in");

  const { error } = await supabase.from("water_logs").insert({
    user_id: user.id,
    log_date: logDate,
    amount_ml: amountMl,
  });
  if (error) throw error;

  revalidatePath("/");
  revalidatePath("/nutrition");
  revalidatePath("/progress");
}

export async function setWaterGoal(goalMl: number) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not signed in");

  const { error } = await supabase
    .from("profiles")
    .update({ water_goal_ml: goalMl })
    .eq("id", user.id);
  if (error) throw error;

  revalidatePath("/");
  revalidatePath("/nutrition");
}
