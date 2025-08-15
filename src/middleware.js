import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request) {
  const { pathname } = request.nextUrl;

  const session = await getToken({
    req: request,
    secret: process.env.AUTH_SECRET,
  });

  // 1. Redirect if user is logged in and visits auth pages
  if (session && ["/signin", "/signup"].includes(pathname)) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // 2. Redirect if user is not logged in and accessing protected pages
  const publicPaths = ["/signin", "/signup", "/"];
  const isPublicPath = publicPaths.includes(pathname);

  if (!session && !isPublicPath) {
    return NextResponse.redirect(new URL("/signin", request.url));
  }

  // 3. Role-based checks
  if (session) {
    const userRole = session.role;
    console.log("User role:", userRole);

    if (pathname.startsWith("/admin") && userRole !== "ADMIN") {
      console.log("Access denied to admin route.");
      return NextResponse.redirect(new URL("/", request.url));
    }

    if (pathname.startsWith("/user") && userRole !== "USER") {
      console.log("Access denied to user route.");
      return NextResponse.redirect(new URL("/", request.url));
    }

    if (pathname === "/" && userRole === "ADMIN") {
      console.log("Redirecting admin from home to admin dashboard.");
      return NextResponse.redirect(new URL("/admin", request.url));
    }
  }

  console.log("✅ Access allowed. Proceeding...");
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/user/:path*",
    "/signin",
    "/signup",
    "/",
    "/dashboard",
    "/profile-settings",
    "/api/user/:path*",
    "/api/admin/:path*",
  ],
};
