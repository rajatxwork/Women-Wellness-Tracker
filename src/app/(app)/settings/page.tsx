import Link from "next/link";
import { Download, ShieldCheck } from "lucide-react";
import { getAuthedUser, getProfile } from "@/lib/supabase/get-user";
import { Card } from "@/components/ui/card";
import { PageHeading } from "@/components/page-heading";
import { DeleteAccountForm } from "@/components/delete-account-form";

export default async function SettingsPage() {
  const user = await getAuthedUser();
  if (!user) return null;

  const profile = await getProfile(user.id);

  return (
    <div className="space-y-6">
      <PageHeading
        icon={ShieldCheck}
        title="Account & privacy"
        subtitle="Your data, your call. Nothing here is ever shared with anyone else."
        accentClass="bg-sage/25 text-sage-deep"
      />

      <Card>
        <h2 className="mb-3 font-serif-display text-lg text-ink">Your account</h2>
        <dl className="space-y-1.5 text-sm">
          <div className="flex justify-between">
            <dt className="text-ink-faint">Email</dt>
            <dd className="text-ink">{user.email}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-ink-faint">Name</dt>
            <dd className="text-ink">{profile?.name ?? "Not set"}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-ink-faint">Terms accepted</dt>
            <dd className="text-ink">
              {profile?.terms_accepted_at
                ? new Date(profile.terms_accepted_at).toLocaleDateString()
                : "Not on file"}
            </dd>
          </div>
        </dl>
      </Card>

      <Card>
        <h2 className="mb-2 font-serif-display text-lg text-ink">How your data is handled</h2>
        <ul className="space-y-2 text-sm text-ink-soft">
          <li>
            Your period, symptom, and mood logs are automatically and permanently
            deleted 60 days after you log them.
          </li>
          <li>
            Workout, nutrition, and habit history is kept until you delete your
            account, so you can see your progress over time.
          </li>
          <li>Nothing you log is ever shared with other people or sold to anyone.</li>
        </ul>
        <p className="mt-3 text-xs text-ink-faint">
          Full details in the{" "}
          <Link href="/privacy" className="font-semibold text-terracotta-deep">
            Privacy Policy
          </Link>{" "}
          and{" "}
          <Link href="/terms" className="font-semibold text-terracotta-deep">
            Terms of Service
          </Link>
          .
        </p>
      </Card>

      <Card>
        <h2 className="mb-2 font-serif-display text-lg text-ink">Download your data</h2>
        <p className="mb-3 text-sm text-ink-soft">
          Get a copy of everything you&apos;ve logged, as a plain JSON file.
        </p>
        <a
          href="/account/export"
          download
          className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface-soft px-4 py-2 text-sm font-semibold text-ink transition-colors hover:border-terracotta/40"
        >
          <Download size={16} /> Download my data
        </a>
      </Card>

      <Card>
        <h2 className="mb-2 font-serif-display text-lg text-ink">Delete your account</h2>
        <p className="mb-3 text-sm text-ink-soft">
          This can&apos;t be undone. Download your data first if you want to keep a copy.
        </p>
        <DeleteAccountForm />
      </Card>
    </div>
  );
}
