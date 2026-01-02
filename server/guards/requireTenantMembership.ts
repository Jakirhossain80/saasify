// FILE: server/guards/requireTenantMembership.ts
import type mongoose from "mongoose";
import { requireAuth } from "@/server/guards/requireAuth";
import { resolveTenantContext } from "@/server/tenant/resolveTenant";
import type { TenantContext } from "@/server/tenant/tenant-context";
import type { TenantRole } from "@/server/models/Membership";

export type TenantMembership = {
  tenantId: mongoose.Types.ObjectId;
  role: TenantRole;
  ctx: TenantContext;
};

export async function requireTenantMembership(): Promise<TenantMembership> {
  const user = await requireAuth();

  const ctx = await resolveTenantContext({
    userId: user.dbUser._id,
    selectTenantPath: "/tenant/select-tenant",
  });

  if (!ctx.ok || !ctx.tenantId || !ctx.tenant) {
    // Hard-deny by default. UI can redirect using ctx.redirectTo if desired.
    const reason = ctx.status ?? "unknown";
    throw new Error(`FORBIDDEN_TENANT_CONTEXT_${reason}`);
  }

  if (!ctx.role) {
    throw new Error("FORBIDDEN_TENANT_MEMBERSHIP_REQUIRED");
  }

  return {
    tenantId: ctx.tenantId,
    role: ctx.role,
    ctx,
  };
}
