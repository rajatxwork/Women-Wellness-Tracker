import { cache } from "react";
import { createClient } from "@/lib/supabase/server";
import type { Profile } from "@/lib/types";

// The middleware already validates the session on every request. Layouts and
// pages in the same request tree would otherwise each make their own round
// trip to Supabase's auth server to re-validate it (auth.getUser() hits the
// network, unlike the local-only getSession()). React's cache() dedupes
// these calls to a single network request per page load.
export const getAuthedUser = cache(async () => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
});

export const getProfile = cache(async (userId: string) => {
  const supabase = await createClient();
  const { data } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .maybeSingle();
  return data as Profile | null;
});
