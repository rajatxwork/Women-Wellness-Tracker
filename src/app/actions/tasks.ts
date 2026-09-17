"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function createTask(
  title: string,
  category: string | null,
  dueDate: string | null,
) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not signed in");

  const { error } = await supabase.from("tasks").insert({
    user_id: user.id,
    title,
    category,
    due_date: dueDate,
  });
  if (error) throw error;

  revalidatePath("/habits");
  revalidatePath("/");
}

export async function toggleTask(taskId: string, completed: boolean) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not signed in");

  const { error } = await supabase
    .from("tasks")
    .update({ completed })
    .eq("id", taskId)
    .eq("user_id", user.id);
  if (error) throw error;

  revalidatePath("/habits");
  revalidatePath("/");
}

export async function deleteTask(taskId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not signed in");

  const { error } = await supabase
    .from("tasks")
    .delete()
    .eq("id", taskId)
    .eq("user_id", user.id);
  if (error) throw error;

  revalidatePath("/habits");
  revalidatePath("/");
}
