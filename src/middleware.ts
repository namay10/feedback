import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
export { default } from "next-auth/middleware";

export async function middleware(req: NextRequest) {
  // Extract token using getToken from next-auth
  const token = await getToken({ req });

  const url = req.nextUrl;

  // If token exists and user is trying to access public routes, redirect them to the dashboard
  if (
    token &&
    (url.pathname.startsWith("/sign-in") ||
      url.pathname.startsWith("/sign-up") ||
      url.pathname.startsWith("/verify") ||
      url.pathname.startsWith("/home"))
  ) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  // If no token and user tries to access protected routes like "/dashboard", redirect to sign-in page
  if (!token && url.pathname.startsWith("/dashboard")) {
    return NextResponse.redirect(new URL("/sign-in", req.url));
  }

  // Allow all other requests to pass through
  return NextResponse.next();
}

// Define the routes that the middleware should match
export const config = {
  matcher: ["/sign-in", "/sign-up", "/", "/dashboard/:path*", "/verify/:path*"],
};
