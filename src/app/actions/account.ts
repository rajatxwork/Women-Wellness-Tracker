"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export type AccountState = { error?: string } | null;

// Every table scoped to user_id that a full account deletion needs to be
// aware of for the data export below. Deletion itself doesn't need this
// list: every one of these tables references auth.users(id) with
// `on delete cascade`, so removing the auth user wipes all of it at once.
const USER_SCOPED_TABLES = [
  "cycle_logs",
  "symptom_logs",
  "user_goal_categories",
  "nutrition_logs",
  "nutrition_notes",
  "water_logs",
  "nutrient_targets",
  "supplements",
  "supplement_logs",
  "exercise_bundles",
  "custom_exercises",
  "programs",
  "program_items",
  "workout_sessions",
  "workout_sets",
  "cardio_logs",
  "plyo_logs",
  "recovery_logs",
  "habits",
  "habit_logs",
  "tasks",
] as const;

export async function exportMyData() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not signed in");

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .maybeSingle();

  const results = await Promise.all(
    USER_SCOPED_TABLES.map((table) => supabase.from(table).select("*").eq("user_id", user.id)),
  );

  const data: Record<string, unknown> = {
    exported_at: new Date().toISOString(),
    account_email: user.email,
    profile,
  };
  USER_SCOPED_TABLES.forEach((table, i) => {
    data[table] = results[i].data ?? [];
  });

  return data;
}

export async function deleteAccount(
  _prevState: AccountState,
  formData: FormData,
): Promise<AccountState> {
  const confirmation = String(formData.get("confirmation") ?? "");
  if (confirmation !== "DELETE") {
    return { error: 'Type "DELETE" to confirm, exactly like that.' };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { error: "You'll need to be signed in to do this." };
  }

  const admin = createAdminClient();
  const { error } = await admin.auth.admin.deleteUser(user.id);
  if (error) {
    return { error: "Something went wrong deleting your account. Please try again." };
  }

  await supabase.auth.signOut();
  redirect("/login?error=Your account and all its data have been deleted.");
}
