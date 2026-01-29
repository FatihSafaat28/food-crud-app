// proxy.ts

import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;

  // Define public routes that don't require authentication
  const publicRoutes = ["/"];
  const isPublicRoute = publicRoutes.includes(nextUrl.pathname);

  // Define auth routes (signin, register)
  const authRoutes = ["/","/dashboard"];
  const isAuthRoute = authRoutes.includes(nextUrl.pathname);

  // If user is logged in and tries to access auth routes, redirect to dashboard
  if (isLoggedIn && isAuthRoute) {
    return NextResponse.redirect(new URL("/dashboard/menu", nextUrl));
  }

  // If user is not logged in and tries to access protected routes, redirect to signin
  if (!isLoggedIn && !isPublicRoute) {
    return NextResponse.redirect(new URL("/", nextUrl));
  }

  // Allow the request to proceed
  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
