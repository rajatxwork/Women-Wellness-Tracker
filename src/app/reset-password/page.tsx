import { redirect } from "next/navigation";
import { getAuthedUser } from "@/lib/supabase/get-user";
import { AuthShell } from "@/components/auth-shell";
import { ResetPasswordForm } from "./reset-password-form";

export default async function ResetPasswordPage() {
  const user = await getAuthedUser();

  if (!user) redirect("/forgot-password");

  return (
    <AuthShell>
      <div className="mb-8 text-center">
        <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-sage/20 flex items-center justify-center">
          <span className="text-2xl">🔑</span>
        </div>
        <h1 className="font-serif-display text-3xl text-ink">Set a new password</h1>
        <p className="mt-2 text-ink-soft">Almost there. Pick something you&apos;ll remember.</p>
      </div>
      <ResetPasswordForm />
    </AuthShell>
  );
}
