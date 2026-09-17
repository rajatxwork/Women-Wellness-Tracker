"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { todayISO } from "@/lib/utils";

export async function createSupplement(name: string, dosage: string, notes: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not signed in");

  const { error } = await supabase.from("supplements").insert({
    user_id: user.id,
    name,
    dosage: dosage || null,
    notes: notes || null,
  });
  if (error) throw error;

  revalidatePath("/nutrition");
}

export async function deleteSupplement(id: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not signed in");

  const { error } = await supabase
    .from("supplements")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);
  if (error) throw error;

  revalidatePath("/nutrition");
}

export async function toggleSupplementLog(supplementId: string, logDate: string = todayISO()) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not signed in");

  const { data: existing } = await supabase
    .from("supplement_logs")
    .select("id")
    .eq("supplement_id", supplementId)
    .eq("log_date", logDate)
    .maybeSingle();

  if (existing) {
    await supabase.from("supplement_logs").delete().eq("id", existing.id);
  } else {
    await supabase.from("supplement_logs").insert({
      supplement_id: supplementId,
      user_id: user.id,
      log_date: logDate,
      taken: true,
    });
  }

  revalidatePath("/nutrition");
}
