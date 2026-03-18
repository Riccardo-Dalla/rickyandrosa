import { NextResponse, type NextRequest } from "next/server";

const COOKIE_NAME = "rr-locale";

export function middleware(request: NextRequest) {
  const response = NextResponse.next();

  if (request.cookies.has(COOKIE_NAME)) return response;

  const acceptLang = request.headers.get("accept-language") ?? "";
  const preferred = acceptLang
    .split(",")
    .map((part) => part.split(";")[0].trim().toLowerCase());

  const locale = preferred.some((l) => l.startsWith("it")) ? "it" : "en";

  response.cookies.set(COOKIE_NAME, locale, {
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
    sameSite: "lax",
  });

  return response;
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
