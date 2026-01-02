// FILE: middleware.ts
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isProtectedRoute = createRouteMatcher(["/platform(.*)", "/tenant(.*)"]);

export default clerkMiddleware((auth, req) => {
  if (isProtectedRoute(req)) auth().protect();
});

export const config = {
  matcher: [
    // Run middleware on all app routes except Next internals and static files
    "/((?!_next|.*\\.(?:css|js|json|png|jpg|jpeg|gif|svg|webp|ico|txt|xml|map)$).*)",
    "/(api|trpc)(.*)",
  ],
};
