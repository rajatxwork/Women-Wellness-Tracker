"use client";

import { useActionState } from "react";
import Link from "next/link";
import { signup } from "@/app/auth/actions";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import { AuthShell } from "@/components/auth-shell";

export default function SignupPage() {
  const [state, formAction, pending] = useActionState(signup, null);

  return (
    <AuthShell>
      <div className="mb-8 text-center">
        <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-sage/20 flex items-center justify-center">
          <span className="text-2xl">🌸</span>
        </div>
        <h1 className="font-serif-display text-3xl text-ink">Let&apos;s get you set up</h1>
        <p className="mt-2 text-ink-soft">This is your space now, no forms, just a warm welcome.</p>
      </div>

      <form action={formAction} className="card-soft space-y-4 p-6">
        <div>
          <Label htmlFor="name">Your name</Label>
          <Input id="name" name="name" type="text" required placeholder="What should we call you?" />
        </div>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" type="email" required placeholder="you@example.com" />
        </div>
        <div>
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            name="password"
            type="password"
            required
            minLength={6}
            placeholder="At least 6 characters"
          />
        </div>

        <label className="flex items-start gap-2.5 text-sm text-ink-soft">
          <input
            type="checkbox"
            name="terms_accepted"
            required
            className="mt-0.5 h-4 w-4 flex-shrink-0 rounded border-border accent-terracotta"
          />
          <span>
            I&apos;ve read and agree to the{" "}
            <Link href="/terms" target="_blank" className="font-semibold text-terracotta-deep">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link href="/privacy" target="_blank" className="font-semibold text-terracotta-deep">
              Privacy Policy
            </Link>
            .
          </span>
        </label>

        {state?.error && (
          <p className="text-sm text-terracotta-deep">{state.error}</p>
        )}

        <Button type="submit" className="w-full" disabled={pending}>
          {pending ? "Creating your space…" : "Create account"}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-ink-soft">
        Already have an account?{" "}
        <Link href="/login" className="font-semibold text-terracotta-deep">
          Sign in
        </Link>
      </p>
    </AuthShell>
  );
}
