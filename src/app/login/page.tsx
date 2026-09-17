"use client";

import { useActionState } from "react";
import Link from "next/link";
import { login } from "@/app/auth/actions";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";

export default function LoginPage() {
  const [state, formAction, pending] = useActionState(login, null);

  return (
    <div className="flex min-h-screen items-center justify-center bg-cream px-4 py-12">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-terracotta/15 flex items-center justify-center">
            <span className="text-2xl">🌿</span>
          </div>
          <h1 className="font-serif-display text-3xl text-ink">Welcome back</h1>
          <p className="mt-2 text-ink-soft">Good to see you again.</p>
        </div>

        <form action={formAction} className="card-soft space-y-4 p-6">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" required placeholder="you@example.com" />
          </div>
          <div>
            <Label htmlFor="password">Password</Label>
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
      </div>
    </div>
  );
}
