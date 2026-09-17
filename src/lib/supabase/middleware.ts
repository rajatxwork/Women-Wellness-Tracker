import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

// Paths a signed-out visitor may reach without being bounced to /login.
const ALLOWED_SIGNED_OUT = [
  "/login",
  "/signup",
  "/forgot-password",
  "/reset-password",
  "/auth",
  "/terms",
  "/privacy",
];

// Of those, the ones that make no sense for an already-signed-in user, so we
// send them on to the dashboard instead. /reset-password is deliberately
// excluded: the recovery link signs the user in on purpose so they can set a
// new password, and /auth/confirm needs to run its own redirect logic.
const REDIRECT_IF_SIGNED_IN = ["/login", "/signup", "/forgot-password"];

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    return supabaseResponse;
  }

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) =>
          request.cookies.set(name, value),
        );
        supabaseResponse = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          supabaseResponse.cookies.set(name, value, options),
        );
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const isAllowedSignedOut = ALLOWED_SIGNED_OUT.some((path) =>
    request.nextUrl.pathname.startsWith(path),
  );
  const isRedirectIfSignedIn = REDIRECT_IF_SIGNED_IN.some((path) =>
    request.nextUrl.pathname.startsWith(path),
  );

  if (!user && !isAllowedSignedOut) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  if (user && isRedirectIfSignedIn) {
    const url = request.nextUrl.clone();
    url.pathname = "/";
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}
