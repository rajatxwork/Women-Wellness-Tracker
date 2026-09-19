"use client";

import { useActionState } from "react";
import Link from "next/link";
import { requestPasswordReset } from "@/app/auth/actions";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import { AuthShell } from "@/components/auth-shell";

export default function ForgotPasswordPage() {
  const [state, formAction, pending] = useActionState(requestPasswordReset, null);

  return (
    <AuthShell>
      <div className="mb-8 text-center">
        <h1 className="font-serif-display text-3xl text-ink">Forgot your password?</h1>
        <p className="mt-2 text-ink-soft">
          No worries, tell us the email you signed up with and we&apos;ll send you a link.
        </p>
      </div>

      <form action={formAction} className="card-soft space-y-4 p-6">
        <div>
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" type="email" required placeholder="you@example.com" />
        </div>

        {state?.error && <p className="text-sm text-ink-soft">{state.error}</p>}

        <Button type="submit" className="w-full" disabled={pending}>
          {pending ? "Sending…" : "Send reset link"}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-ink-soft">
        Remembered it after all?{" "}
        <Link href="/login" className="font-semibold text-terracotta-deep">
          Back to sign in
        </Link>
      </p>
    </AuthShell>
  );
}
