import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { OnboardingForm } from "./onboarding-form";

export default async function OnboardingPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const defaultName = (user.user_metadata?.name as string | undefined) ?? "";

  return (
    <div className="flex min-h-screen items-center justify-center bg-cream px-4 py-12">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="font-serif-display text-3xl text-ink">
            Welcome in{defaultName ? `, ${defaultName}` : ""}
          </h1>
          <p className="mt-2 text-ink-soft">
            A couple of quick things so we can meet you where you are — nothing here is
            permanent, you can change it any time.
          </p>
        </div>
        <OnboardingForm defaultName={defaultName} />
      </div>
    </div>
  );
}
