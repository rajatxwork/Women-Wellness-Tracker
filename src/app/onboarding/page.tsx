import { redirect } from "next/navigation";
import { getAuthedUser } from "@/lib/supabase/get-user";
import { AuthShell } from "@/components/auth-shell";
import { OnboardingForm } from "./onboarding-form";

export default async function OnboardingPage() {
  const user = await getAuthedUser();

  if (!user) redirect("/login");

  const defaultName = (user.user_metadata?.name as string | undefined) ?? "";

  return (
    <AuthShell maxWidth="max-w-md">
      <div className="mb-8 text-center">
        <h1 className="font-serif-display text-3xl text-ink">
          Welcome in{defaultName ? `, ${defaultName}` : ""}
        </h1>
        <p className="mt-2 text-ink-soft">
          A couple of quick things so we can meet you where you are. Nothing here is
          permanent, you can change it any time.
        </p>
      </div>
      <OnboardingForm defaultName={defaultName} />
    </AuthShell>
  );
}
