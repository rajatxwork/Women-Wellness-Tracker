import { redirect } from "next/navigation";
import { getAuthedUser, getProfile } from "@/lib/supabase/get-user";
import { BottomNav, Sidebar, MobileHeader } from "@/components/nav";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getAuthedUser();
  if (!user) redirect("/login");

  const profile = await getProfile(user.id);
  if (!profile?.onboarded) redirect("/onboarding");

  const userName = profile?.name || "there";

  return (
    <div className="flex min-h-screen bg-cream">
      <Sidebar userName={userName} />
      <div className="flex min-h-screen flex-1 flex-col">
        <MobileHeader userName={userName} />
        <main className="flex-1 pb-24 md:pb-10">
          <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 md:px-8 md:py-10">
            {children}
          </div>
        </main>
      </div>
      <BottomNav />
    </div>
  );
}
