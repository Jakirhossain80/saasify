// FILE: server/tenant/tenant-context.ts
import type mongoose from "mongoose";
import type { TenantDoc } from "@/server/models/Tenant";
import type { TenantRole } from "@/server/models/Membership";

export type TenantContextStatus =
  | "ok"
  | "missing_tenant"
  | "invalid_tenant"
  | "tenant_not_found"
  | "tenant_suspended"
  | "not_a_member";

export type TenantContext = {
  ok: boolean;
  status: TenantContextStatus;

  tenantId: mongoose.Types.ObjectId | null;
  tenant: TenantDoc | null;

  // Present when user identity is provided and membership is verified
  role: TenantRole | null;

  // Useful for redirecting UI in middleware/server components
  redirectTo?: string;

  // Safe debugging message
  message?: string;
};

export const TENANT_COOKIE_NAME = "saasify_tenant";
