"use client";

import { useActionState } from "react";
import { completeOnboarding } from "@/app/auth/actions";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";

export function OnboardingForm({ defaultName }: { defaultName: string }) {
  const [state, formAction, pending] = useActionState(completeOnboarding, null);

  return (
    <form action={formAction} className="card-soft space-y-5 p-6 sm:p-8">
      <div>
        <Label htmlFor="name">What should we call you?</Label>
        <Input id="name" name="name" defaultValue={defaultName} required placeholder="Your name" />
      </div>

      <div>
        <Label htmlFor="avg_cycle_length">
          Roughly how long is your cycle? (Most are 21–35 days, 28 is a fine default.)
        </Label>
        <Input
          id="avg_cycle_length"
          name="avg_cycle_length"
          type="number"
          min={15}
          max={60}
          defaultValue={28}
        />
      </div>

      <div>
        <Label htmlFor="last_period_start">
          When did your last period start? (Optional, but it helps us tailor your tips.)
        </Label>
        <Input id="last_period_start" name="last_period_start" type="date" />
      </div>

      {state?.error && <p className="text-sm text-terracotta-deep">{state.error}</p>}

      <Button type="submit" size="lg" className="w-full" disabled={pending}>
        {pending ? "Setting things up…" : "Step into your space"}
      </Button>
    </form>
  );
}
