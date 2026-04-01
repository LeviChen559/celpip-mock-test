import { updateSession } from "@/lib/supabase/middleware";
import createIntlMiddleware from "next-intl/middleware";
import { routing } from "@/i18n/routing";
import { type NextRequest } from "next/server";

const intlMiddleware = createIntlMiddleware(routing);

export default async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip intl middleware for API routes and static files
  if (
    pathname.startsWith("/api") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/_vercel") ||
    pathname === "/favicon.ico" ||
    /\.(.+)$/.test(pathname)
  ) {
    return await updateSession(request);
  }

  // Run next-intl middleware (handles locale detection + redirect)
  const intlResponse = intlMiddleware(request);

  // Apply supabase session cookies on top of the intl response
  // We still need to update the session for auth to work
  const sessionResponse = await updateSession(request);

  // Copy supabase cookies to the intl response
  sessionResponse.cookies.getAll().forEach((cookie) => {
    intlResponse.cookies.set(cookie.name, cookie.value);
  });

  return intlResponse;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
