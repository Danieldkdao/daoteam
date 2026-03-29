import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { auth } from "./lib/auth/auth";

const authedRoutes = ["/sign-in", "/sign-up"];

export const proxy = async (request: NextRequest) => {
  const url = request.nextUrl.clone();
  const pathname = url.pathname;
  const session = await auth.api.getSession({ headers: request.headers });
  if (!authedRoutes.includes(pathname) && !session)
    return NextResponse.redirect(new URL("/sign-in", request.url));
  if (
    pathname !== "/onboarding" &&
    session &&
    session.user.onboardingPhase !== "completed"
  )
    return NextResponse.redirect(new URL("/onboarding", request.url));
  if (
    [...authedRoutes, "/onboarding"].includes(pathname) &&
    session &&
    session.user.onboardingPhase === "completed"
  )
    return NextResponse.redirect(new URL("/workspace", request.url));

  return NextResponse.next();
};

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|icon.svg|robots.txt|sitemap.xml|manifest.json|manifest.webmanifest|apple-icon.png|.*\\.[^/]+$).*)",
  ],
};
