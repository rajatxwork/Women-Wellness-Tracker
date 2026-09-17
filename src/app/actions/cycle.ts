"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { todayISO } from "@/lib/utils";

export async function logPeriodStart(periodStart: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not signed in");

  const { error } = await supabase.from("cycle_logs").insert({
    user_id: user.id,
    period_start: periodStart,
  });
  if (error) throw error;

  await supabase
    .from("profiles")
    .update({ last_period_start: periodStart })
    .eq("id", user.id);

  revalidatePath("/cycle");
  revalidatePath("/");
  revalidatePath("/progress");
}

export async function logPeriodEnd(cycleLogId: string, periodEnd: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not signed in");

  const { error } = await supabase
    .from("cycle_logs")
    .update({ period_end: periodEnd })
    .eq("id", cycleLogId)
    .eq("user_id", user.id);
  if (error) throw error;

  revalidatePath("/cycle");
  revalidatePath("/");
}

export async function updateCycleSettings(avgCycleLength: number) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not signed in");

  const { error } = await supabase
    .from("profiles")
    .update({ avg_cycle_length: avgCycleLength })
    .eq("id", user.id);
  if (error) throw error;

  revalidatePath("/cycle");
  revalidatePath("/");
}

export async function logSymptoms(input: {
  logDate?: string;
  cramps?: number;
  bloating?: number;
  mood?: number;
  energy?: number;
  notes?: string;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not signed in");

  const logDate = input.logDate ?? todayISO();

  const { error } = await supabase.from("symptom_logs").upsert(
    {
      user_id: user.id,
      log_date: logDate,
      cramps: input.cramps ?? null,
      bloating: input.bloating ?? null,
      mood: input.mood ?? null,
      energy: input.energy ?? null,
      notes: input.notes ?? null,
    },
    { onConflict: "user_id,log_date" },
  );
  if (error) throw error;

  revalidatePath("/cycle");
  revalidatePath("/progress");
}
