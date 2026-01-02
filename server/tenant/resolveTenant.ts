// FILE: server/tenant/resolveTenant.ts
import mongoose from "mongoose";
import { cookies } from "next/headers";
import { connectToDatabase } from "@/server/db";
import { Tenant } from "@/server/models/Tenant";
import { Membership } from "@/server/models/Membership";
import { TENANT_COOKIE_NAME, type TenantContext } from "@/server/tenant/tenant-context";

type ResolveTenantOptions = {
  /**
   * If provided, we verify the user is a member of the selected tenant and return role.
   * Pass your internal MongoDB userId (not Clerk userId).
   */
  userId?: mongoose.Types.ObjectId | null;

  /**
   * Where to redirect when tenant is missing/invalid.
   * Default: /tenant/select-tenant
   */
  selectTenantPath?: string;
};

function safeSelectPath(path?: string): string {
  const p = path?.trim();
  return p && p.startsWith("/") ? p : "/tenant/select-tenant";
}

export async function resolveTenantContext(
  options: ResolveTenantOptions = {}
): Promise<TenantContext> {
  const selectTenantPath = safeSelectPath(options.selectTenantPath);

  const rawTenantId = cookies().get(TENANT_COOKIE_NAME)?.value?.trim() ?? "";

  if (!rawTenantId) {
    return {
      ok: false,
      status: "missing_tenant",
      tenantId: null,
      tenant: null,
      role: null,
      redirectTo: selectTenantPath,
      message: "No tenant selected.",
    };
  }

  if (!mongoose.isValidObjectId(rawTenantId)) {
    return {
      ok: false,
      status: "invalid_tenant",
      tenantId: null,
      tenant: null,
      role: null,
      redirectTo: selectTenantPath,
      message: "Invalid tenant id in cookie.",
    };
  }

  const tenantId = new mongoose.Types.ObjectId(rawTenantId);

  await connectToDatabase();

  const tenant = await Tenant.findById(tenantId).exec();
  if (!tenant) {
    return {
      ok: false,
      status: "tenant_not_found",
      tenantId,
      tenant: null,
      role: null,
      redirectTo: selectTenantPath,
      message: "Tenant not found.",
    };
  }

  if (tenant.status === "suspended") {
    return {
      ok: false,
      status: "tenant_suspended",
      tenantId,
      tenant,
      role: null,
      redirectTo: selectTenantPath,
      message: "Tenant is suspended.",
    };
  }

  const userId = options.userId ?? null;
  if (!userId) {
    // Tenant resolved (no membership verification requested)
    return {
      ok: true,
      status: "ok",
      tenantId,
      tenant,
      role: null,
    };
  }

  const membership = await Membership.findOne({
    tenantId,
    userId,
    status: { $ne: "removed" },
  })
    .select({ role: 1 })
    .exec();

  if (!membership?.role) {
    return {
      ok: false,
      status: "not_a_member",
      tenantId,
      tenant,
      role: null,
      redirectTo: selectTenantPath,
      message: "User is not a member of this tenant.",
    };
  }

  return {
    ok: true,
    status: "ok",
    tenantId,
    tenant,
    role: membership.role,
  };
}
