import "server-only";
import { createClient } from "@supabase/supabase-js";

// Privileged client using the service role key. Never import this into
// anything that runs in the browser: the `server-only` import above makes
// that a build error if it ever happens by accident. Only use this for
// operations the anon/authenticated key genuinely can't do under RLS, like
// deleting a user's auth.users row (which cascades to delete every table
// referencing it).
export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey) {
    throw new Error(
      "SUPABASE_SERVICE_ROLE_KEY is not set. Add it to your environment variables (Project Settings > API > service_role key in Supabase) to enable account deletion.",
    );
  }

  return createClient(url, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}
