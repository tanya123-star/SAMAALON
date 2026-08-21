import { auth } from "@/lib/auth";

export default auth((req) => {
  const { nextUrl } = req;
  const isAdminRoute = nextUrl.pathname.startsWith("/admin");
  const isLoggedIn = !!req.auth;
  const role = (req.auth?.user as unknown as { role?: string })?.role;

  if (isAdminRoute && !isLoggedIn) {
    return Response.redirect(new URL("/api/auth/signin", nextUrl));
  }
  if (isAdminRoute && role !== "ADMIN") {
    return new Response("Forbidden: Admin only", { status: 403 });
  }
});

export const config = {
  matcher: ["/admin/:path*"],
};
