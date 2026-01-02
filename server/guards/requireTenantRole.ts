// FILE: server/guards/requireTenantRole.ts
import type { TenantRole } from "@/server/models/Membership";
import { requireTenantMembership, type TenantMembership } from "@/server/guards/requireTenantMembership";

export type RequiredTenantRole = "tenant_admin" | "tenant_user";

function roleRank(role: TenantRole): number {
  // Higher = more privilege
  if (role === "tenant_admin") return 2;
  return 1; // tenant_user
}

export async function requireTenantRole(
  required: RequiredTenantRole
): Promise<TenantMembership> {
  const membership = await requireTenantMembership();

  const ok = roleRank(membership.role) >= roleRank(required);
  if (!ok) {
    throw new Error("FORBIDDEN_TENANT_ROLE_INSUFFICIENT");
  }

  return membership;
}

export async function requireTenantAdmin(): Promise<TenantMembership> {
  return requireTenantRole("tenant_admin");
}
