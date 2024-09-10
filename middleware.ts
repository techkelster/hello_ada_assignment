import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
  // Check if the user has a valid JWT token
  const token = await getToken({ req, secret: process.env.JWT_SECRET });

  // Define the protected routes you want to restrict
  const protectedRoutes = ["/tasks"];

  // If user is not authenticated and tries to access a protected route
  if (
    !token &&
    protectedRoutes.some((route) => req.nextUrl.pathname.startsWith(route))
  ) {
    // Redirect the user to the login page
    return NextResponse.redirect(new URL("/tasks", req.url));
  }

  // If the user is authenticated, allow them to proceed
  return NextResponse.next();
}

export const config = {
  matcher: ["/tasks"], // Add the paths you want to protect here
};
