import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isPlatformRoute = createRouteMatcher(["/platform(.*)"]);
const isTenantRoute = createRouteMatcher(["/tenant(.*)"]);

export default clerkMiddleware((auth, req) => {
  // Require user to be signed in for these sections
  if (isPlatformRoute(req) || isTenantRoute(req)) {
    auth().protect();
  }
});

export const config = {
  matcher: ["/((?!_next|.*\\..*).*)"],
};

