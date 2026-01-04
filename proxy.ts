// FILE: middleware.ts
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isProtectedRoute = createRouteMatcher(["/platform(.*)", "/tenant(.*)"]);
const isTenantRoute = createRouteMatcher(["/tenant(.*)"]);
const isTenantSelectionRoute = createRouteMatcher(["/tenant/select-tenant(.*)"]);

const TENANT_COOKIE = "saasify_tenant";

export default clerkMiddleware((auth, req) => {
  if (isProtectedRoute(req)) auth().protect();

  // MVP tenant context source: cookie-based selected tenant
  if (isTenantRoute(req) && !isTenantSelectionRoute(req)) {
    const tenantId = req.cookies.get(TENANT_COOKIE)?.value?.trim();
    if (!tenantId) {
      const url = new URL("/tenant/select-tenant", req.url);
      url.searchParams.set("next", req.nextUrl.pathname + req.nextUrl.search);
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/((?!_next|.*\\.(?:css|js|json|png|jpg|jpeg|gif|svg|webp|ico|txt|xml|map)$).*)",
    "/(api|trpc)(.*)",
  ],
};
