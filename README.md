# Selene: Women's Wellness Tracker

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
   and fill in your project's URL, anon key, and service role key (all under
   Project Settings → API):

   ```bash
   cp .env.local.example .env.local
   ```

   The service role key powers account deletion (`src/lib/supabase/admin.ts`).
   Keep it secret, it bypasses Row Level Security, and never expose it with a
   `NEXT_PUBLIC_` prefix or from client code.

4. **Install dependencies and run the dev server:**

   ```bash
   npm install
   npm run dev
   ```

   Visit [http://localhost:3000](http://localhost:3000), you'll land on the
   sign-up page.

5. **Email confirmation.** By default Supabase requires email confirmation for
   new sign-ups. Either confirm via the email Supabase sends, or turn off
   "Confirm email" under Authentication → Providers → Email in your Supabase
   dashboard for faster local testing.
6. **Password reset email template.** For "Forgot your password?" to work,
   open Authentication → Email Templates → Reset Password in your Supabase
   dashboard and change the link in the template from `{{ .ConfirmationURL }}`
   to:

   ```
   {{ .SiteURL }}/auth/confirm?token_hash={{ .TokenHash }}&type=recovery&next=/reset-password
   ```

   This routes the reset link through the app's own `/auth/confirm` handler
   instead of Supabase's default hosted redirect. Also add your production
   URL under Authentication → URL Configuration → Redirect URLs (and set
   `NEXT_PUBLIC_SITE_URL` in your environment variables once you have a
   deployed URL, so reset emails link to the right place instead of
   `localhost`).
7. **Enable pg_cron for data retention.** Period, symptom, and mood data is
   automatically deleted 60 days after it's logged (see `schema.sql`, the
   "DATA RETENTION" section near the bottom). This needs the `pg_cron`
   extension enabled, either running as part of `schema.sql`, or if that
   statement errors on permissions, via Database → Extensions → search
   "pg_cron" → Enable in the Supabase dashboard, then re-run just that section
   of `schema.sql`.

**A note on the legal pages.** `/terms` and `/privacy` are real, considered
drafts, not filler text, but they aren't a substitute for an actual lawyer.
Given this app handles period and health data specifically, get them reviewed
before real users sign up. Several US states (Washington's My Health My Data
Act, for one) have specific, active legal requirements around reproductive
health data.

## Deploying to Vercel

The repo includes a minimal `vercel.json`; Vercel auto-detects Next.js, so no
further configuration is required beyond the three Supabase environment
variables (URL, anon key, service role key). See the step-by-step walkthrough
below.

## Project structure

- `src/app/(app)/`, the authenticated app shell (dashboard, cycle, nutrition,
  workout, habits, progress), protected by `src/proxy.ts` (Next's middleware
  convention) and the layout's session check.
- `src/app/login`, `src/app/signup`, `src/app/onboarding`, auth flow.
- `src/app/actions/`, server actions for all mutations (water, habits, tasks,
  cycle, nutrition, workout logging).
- `src/lib/data/`, reference content extracted from the companion e-book:
  nutrition goal categories & foods, movement patterns & exercises, bodyweight
  progression levels, plyometric sets by age band, cardio guidance, and
  cycle-phase tips.
- `src/lib/encouragement.ts`, the app's voice: rotating, categorized copy for
  celebrations, gentle nudges, streaks, phase tips, and empty states.
- `schema.sql`, full Postgres schema with RLS policies and seed data, ready to
  run in the Supabase SQL editor.

## Design system

Warm, editorial palette (blush, terracotta, sage, cream) defined as CSS custom
properties in `src/app/globals.css`, with a cozy warm-charcoal dark mode
(toggle in the sidebar/header, persisted to `localStorage`). Headings use
Fraunces (serif), body text uses Nunito.
