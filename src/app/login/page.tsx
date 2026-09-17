"use client";

import { Suspense, useActionState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { login } from "@/app/auth/actions";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import { AuthShell } from "@/components/auth-shell";

function LinkExpiredNotice() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");
  if (!error) return null;
  return <p className="mb-4 text-center text-sm text-terracotta-deep">{error}</p>;
}

export default function LoginPage() {
  const [state, formAction, pending] = useActionState(login, null);

  return (
    <AuthShell>
      <div className="mb-8 text-center">
        <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-terracotta/15 flex items-center justify-center">
          <span className="text-2xl">🌿</span>
        </div>
        <h1 className="font-serif-display text-3xl text-ink">Welcome back</h1>
        <p className="mt-2 text-ink-soft">Good to see you again.</p>
      </div>

      <Suspense fallback={null}>
        <LinkExpiredNotice />
      </Suspense>

      <form action={formAction} className="card-soft space-y-4 p-6">
        <div>
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" type="email" required placeholder="you@example.com" />
        </div>
        <div>
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Password</Label>
            <Link href="/forgot-password" className="mb-1.5 text-xs font-semibold text-terracotta-deep">
              Forgot password?
            </Link>
          </div>
          <Input id="password" name="password" type="password" required placeholder="••••••••" />
        </div>

        {state?.error && (
          <p className="text-sm text-terracotta-deep">{state.error}</p>
        )}

        <Button type="submit" className="w-full" disabled={pending}>
          {pending ? "Signing in…" : "Sign in"}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-ink-soft">
        New here?{" "}
        <Link href="/signup" className="font-semibold text-terracotta-deep">
          Create an account
        </Link>
      </p>
    </AuthShell>
  );
}
