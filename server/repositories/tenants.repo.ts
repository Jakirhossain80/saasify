// FILE: server/repositories/tenants.repo.ts
import { connectToDatabase } from "@/server/db";
import { Tenant, type TenantDoc } from "@/server/models/Tenant";

export type ListTenantsRepoOptions = {
  limit?: number;
  offset?: number;
  search?: string;
};

export async function listTenants(
  options: ListTenantsRepoOptions = {}
): Promise<{ items: TenantDoc[]; total: number; active: number; suspended: number; limit: number; offset: number }> {
  await connectToDatabase();

  const limit = Math.min(Math.max(options.limit ?? 12, 1), 100);
  const offset = Math.max(options.offset ?? 0, 0);

  const query: Record<string, unknown> = {};

  const search = options.search?.trim();
  if (search) {
    query.$or = [
      { name: { $regex: search, $options: "i" } },
      { slug: { $regex: search, $options: "i" } },
    ];
  }

  const [items, total, active, suspended] = await Promise.all([
    Tenant.find(query).sort({ createdAt: -1 }).skip(offset).limit(limit).exec(),
    Tenant.countDocuments(query).exec(),
    Tenant.countDocuments({ ...query, status: "active" }).exec(),
    Tenant.countDocuments({ ...query, status: "suspended" }).exec(),
  ]);

  return { items, total, active, suspended, limit, offset };
}

export async function updateTenantStatus(
  tenantId: string,
  status: "active" | "suspended"
): Promise<TenantDoc | null> {
  await connectToDatabase();
  return Tenant.findByIdAndUpdate(
    tenantId,
    { $set: { status } },
    { new: true }
  ).exec();
}
