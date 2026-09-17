"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getSiteURL } from "@/lib/utils";

export type AuthState = { error?: string } | null;

export async function login(
  _prevState: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const supabase = await createClient();

  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");

  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/", "layout");
  redirect("/");
}

export async function signup(
  _prevState: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const supabase = await createClient();

  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");
  const name = String(formData.get("name") ?? "");
  const termsAccepted = formData.get("terms_accepted");

  if (!termsAccepted) {
    return { error: "You'll need to agree to the Terms of Service and Privacy Policy to continue." };
  }

  const termsAcceptedAt = new Date().toISOString();

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { name, terms_accepted_at: termsAcceptedAt } },
  });

  if (error) {
    return { error: error.message };
  }

  if (data.user && !data.session) {
    return {
      error:
        "Almost there, check your inbox for a confirmation link to finish setting up your account.",
    };
  }

  revalidatePath("/", "layout");
  redirect("/onboarding");
}

export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/login");
}

export async function completeOnboarding(
  _prevState: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "You'll need to be signed in to finish setting up." };
  }

  const name = String(formData.get("name") ?? "");
  const avgCycleLength = Number(formData.get("avg_cycle_length") ?? 28) || 28;
  const lastPeriodStart = String(formData.get("last_period_start") ?? "");
  const termsAcceptedAt = (user.user_metadata?.terms_accepted_at as string | undefined) ?? null;

  const { error } = await supabase.from("profiles").upsert({
    id: user.id,
    name,
    avg_cycle_length: avgCycleLength,
    last_period_start: lastPeriodStart || null,
    onboarded: true,
    terms_accepted_at: termsAcceptedAt,
  });

  if (error) {
    return { error: error.message };
  }

  if (lastPeriodStart) {
    await supabase.from("cycle_logs").insert({
      user_id: user.id,
      period_start: lastPeriodStart,
    });
  }

  revalidatePath("/", "layout");
  redirect("/");
}

export async function requestPasswordReset(
  _prevState: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const supabase = await createClient();
  const email = String(formData.get("email") ?? "");

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${getSiteURL()}/auth/confirm?type=recovery&next=/reset-password`,
  });

  if (error) {
    return { error: error.message };
  }

  return {
    error:
      "If an account exists for that email, a reset link is on its way. It can take a minute or two to land.",
  };
}

export async function updatePassword(
  _prevState: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "That reset link has expired. Request a new one and try again." };
  }

  const password = String(formData.get("password") ?? "");
  const confirmPassword = String(formData.get("confirm_password") ?? "");

  if (password.length < 6) {
    return { error: "Password needs to be at least 6 characters." };
  }

  if (password !== confirmPassword) {
    return { error: "Those two passwords don't match." };
  }

  const { error } = await supabase.auth.updateUser({ password });

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/", "layout");
  redirect("/");
}
