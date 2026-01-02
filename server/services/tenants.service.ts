// server/services/tenants.service.ts

import type mongoose from "mongoose";
import type { TenantDoc } from "@/server/models/Tenant";
import {
  createTenant,
  findTenantById,
  findTenantBySlug,
  listTenantsByCreator,
  updateTenantStatus,
  type CreateTenantInput,
} from "@/server/repositories/tenants.repo";

export async function createTenantWorkspace(input: CreateTenantInput): Promise<TenantDoc> {
  return createTenant(input);
}

export async function getTenantById(
  tenantId: mongoose.Types.ObjectId
): Promise<TenantDoc | null> {
  return findTenantById(tenantId);
}

export async function getTenantBySlug(slug: string): Promise<TenantDoc | null> {
  return findTenantBySlug(slug);
}

export async function getTenantsCreatedByUser(
  createdByUserId: mongoose.Types.ObjectId
): Promise<TenantDoc[]> {
  return listTenantsByCreator(createdByUserId);
}

export async function setTenantStatus(
  tenantId: mongoose.Types.ObjectId,
  status: "active" | "suspended"
): Promise<TenantDoc | null> {
  return updateTenantStatus(tenantId, status);
}
