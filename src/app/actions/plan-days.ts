"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export type DayType = "strength" | "cardio" | "recovery" | "rest";

export async function setPlanDayType(dayOfWeek: number, dayType: DayType) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not signed in");

  const { error } = await supabase
    .from("plan_days")
    .upsert(
      { user_id: user.id, day_of_week: dayOfWeek, day_type: dayType },
      { onConflict: "user_id,day_of_week" },
    );
  if (error) throw error;

  revalidatePath("/workout");
  revalidatePath("/");
}

