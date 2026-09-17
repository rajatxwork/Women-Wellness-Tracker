import { LegalLayout, LegalSection } from "@/components/legal-layout";

export default function PrivacyPage() {
  return (
    <LegalLayout title="Privacy Policy" updated="September 17, 2026">
      <p>
        Selene exists to help you track your cycle, nutrition, movement, and habits.
        Some of what you log here, especially your period, symptoms, and mood, is
        genuinely sensitive. This page explains, in plain language, what we do with
        it. The short version: your data is yours, we don&apos;t sell it or share it,
        and you can delete it whenever you want.
      </p>

      <LegalSection heading="What we collect">
        <p>
          Your email address and password (handled by our authentication provider,
          Supabase, we never see your raw password). Whatever you choose to log:
          period dates, symptoms, mood and energy ratings, meals, water intake,
          workouts, habits, tasks, and any notes you write.
        </p>
      </LegalSection>

      <LegalSection heading="We do not share or sell your data">
        <p>
          We do not sell your data, to advertisers or anyone else. We do not share
          it with third parties for marketing. We do not run advertising trackers
          or analytics that profile you. Your logs, notes, and symptom entries are
          visible only to you, there is no admin dashboard, shared view, or public
          link that exposes your data to anyone else, ever.
        </p>
        <p>
          The only circumstance where we&apos;d disclose account information is if
          legally compelled to by a valid court order, and even then, only to the
          extent the law requires and only what that order specifically covers.
        </p>
      </LegalSection>

      <LegalSection heading="How long we keep your data">
        <p>
          Your most sensitive data, period dates, symptom logs, and mood entries,
          is automatically and permanently deleted 60 days after you log it. You
          don&apos;t need to do anything for this to happen, it&apos;s automatic.
        </p>
        <p>
          Less sensitive data, like workout history, habits, and nutrition logs, is
          kept until you delete your account, since there&apos;s real value in
          seeing your progress over months or years and it doesn&apos;t carry the
          same risk if it were ever exposed.
        </p>
      </LegalSection>

      <LegalSection heading="Your rights and controls">
        <p>You can, at any time, from your account settings:</p>
        <ul className="ml-4 list-disc space-y-1">
          <li>Download a copy of everything you&apos;ve logged</li>
          <li>Permanently delete your account and every piece of data tied to it</li>
        </ul>
        <p>
          Account deletion is immediate and irreversible. We don&apos;t keep a
          backup copy around after you delete your account.
        </p>
      </LegalSection>

      <LegalSection heading="Security">
        <p>
          Your data is protected by row-level security at the database level, which
          means the database itself enforces that you can only ever read or write
          your own data, not just the application code. Passwords are handled
          entirely by our authentication provider and are never stored in plain
          text.
        </p>
      </LegalSection>

      <LegalSection heading="Not medical advice">
        <p>
          Nutrition targets, cycle-phase guidance, and anything the calculator
          suggests are general, educational information, not a personalized
          medical recommendation. Talk to a doctor or registered dietitian for
          anything that matters medically.
        </p>
      </LegalSection>

      <LegalSection heading="Changes to this policy">
        <p>
          If this policy changes in a way that matters, we&apos;ll do our best to
          let you know before it takes effect.
        </p>
      </LegalSection>

      <LegalSection heading="Questions">
        <p>
          Reach out to the app&apos;s support contact listed at sign-up if you have
          questions about your data.
        </p>
      </LegalSection>
    </LegalLayout>
  );
}
