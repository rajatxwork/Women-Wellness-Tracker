# Selene — Women's Wellness Tracker

A warm, editorial companion app for the wellness e-book: cycle tracking, goal-based
nutrition, a 3-day strength program, habits, tasks, and reflective analytics.
Built with Next.js (App Router), TypeScript, Tailwind CSS, and Supabase.

## Getting started

1. **Create a Supabase project** at [supabase.com](https://supabase.com).
2. **Run the schema.** Open the SQL editor in your Supabase project and run the
   contents of [`schema.sql`](./schema.sql). This creates every table, enables
   Row Level Security scoped to `auth.uid()`, and seeds the nutrition goal
   categories and movement pattern/exercise reference data extracted from the
   e-book.
3. **Configure environment variables.** Copy `.env.local.example` to `.env.local`
   and fill in your project's URL and anon key (Project Settings → API):

   ```bash
   cp .env.local.example .env.local
   ```

4. **Install dependencies and run the dev server:**

   ```bash
   npm install
   npm run dev
   ```

   Visit [http://localhost:3000](http://localhost:3000) — you'll land on the
   sign-up page.

5. **Email confirmation.** By default Supabase requires email confirmation for
   new sign-ups. Either confirm via the email Supabase sends, or turn off
   "Confirm email" under Authentication → Providers → Email in your Supabase
   dashboard for faster local testing.

## Deploying to Vercel

The repo includes a minimal `vercel.json`; Vercel auto-detects Next.js, so no
further configuration is required beyond the two Supabase environment
variables. See the step-by-step walkthrough below.

## Project structure

- `src/app/(app)/` — the authenticated app shell (dashboard, cycle, nutrition,
  workout, habits, progress), protected by `src/proxy.ts` (Next's middleware
  convention) and the layout's session check.
- `src/app/login`, `src/app/signup`, `src/app/onboarding` — auth flow.
- `src/app/actions/` — server actions for all mutations (water, habits, tasks,
  cycle, nutrition, workout logging).
- `src/lib/data/` — reference content extracted from the companion e-book:
  nutrition goal categories & foods, movement patterns & exercises, bodyweight
  progression levels, plyometric sets by age band, cardio guidance, and
  cycle-phase tips.
- `src/lib/encouragement.ts` — the app's voice: rotating, categorized copy for
  celebrations, gentle nudges, streaks, phase tips, and empty states.
- `schema.sql` — full Postgres schema with RLS policies and seed data, ready to
  run in the Supabase SQL editor.

## Design system

Warm, editorial palette (blush, terracotta, sage, cream) defined as CSS custom
properties in `src/app/globals.css`, with a cozy warm-charcoal dark mode
(toggle in the sidebar/header, persisted to `localStorage`). Headings use
Fraunces (serif), body text uses Nunito.
