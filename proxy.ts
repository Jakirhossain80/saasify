// FILE: proxy.ts
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isProtectedRoute = createRouteMatcher([
  // Protect platform + tenant areas (adjust as you need)
  "/dashboard(.*)",
  "/tenants(.*)",
  "/t/(.*)", // if your tenant routes are under /t/[tenantSlug]/...
]);

export default clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) {
    await auth.protect(); // ✅ correct for Clerk middleware
  }
});

export const config = {
  matcher: [
    // Match all routes except Next internals and static files
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
