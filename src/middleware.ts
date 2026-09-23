import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

export async function middleware(request: NextRequest) {
  const { searchParams, pathname } = request.nextUrl;
  const code = searchParams.get("code");
  const token_hash = searchParams.get("token_hash");

  // If Supabase redirected to root / with code or token_hash, route to callback
  if ((code || token_hash) && pathname === "/") {
    const callbackUrl = new URL("/auth/callback", request.url);
    searchParams.forEach((value, key) => {
      callbackUrl.searchParams.set(key, value);
    });
    if (!callbackUrl.searchParams.has("next")) {
      callbackUrl.searchParams.set("next", "/#app");
    }
    return NextResponse.redirect(callbackUrl);
  }

  return await updateSession(request);
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.svg, full-logo.svg, mobile-logo.svg, etc. (static assets)
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
