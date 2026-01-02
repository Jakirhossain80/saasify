// FILE: server/services/analytics.service.ts
import { connectToDatabase } from "@/server/db";
import { Tenant } from "@/server/models/Tenant";
import { Project } from "@/server/models/Project";
import { Membership } from "@/server/models/Membership";
import type mongoose from "mongoose";

export type PlatformDashboardStats = {
  totalTenants: number;
  activeTenants: number;
  totalProjects: number;
  chartData: Array<{ name: string; value: number }>;
};

export type TenantDashboardStats = {
  activeProjects: number;
  archivedProjects: number;
  membersCount: number;
  chartData: Array<{ name: string; value: number }>;
};

export async function getPlatformDashboardStats(): Promise<PlatformDashboardStats> {
  await connectToDatabase();

  const [totalTenants, activeTenants, totalProjects] = await Promise.all([
    Tenant.countDocuments({}).exec(),
    Tenant.countDocuments({ status: "active" }).exec(),
    Project.countDocuments({ deletedAt: null }).exec(),
  ]);

  return {
    totalTenants,
    activeTenants,
    totalProjects,
    chartData: [
      { name: "Tenants", value: totalTenants },
      { name: "Active Tenants", value: activeTenants },
      { name: "Projects", value: totalProjects },
    ],
  };
}

export async function getTenantDashboardStats(
  tenantId: mongoose.Types.ObjectId
): Promise<TenantDashboardStats> {
  await connectToDatabase();

  const [activeProjects, archivedProjects, membersCount] = await Promise.all([
    Project.countDocuments({ tenantId, status: "active", deletedAt: null }).exec(),
    Project.countDocuments({ tenantId, status: "archived", deletedAt: null }).exec(),
    Membership.countDocuments({ tenantId, status: { $ne: "removed" } }).exec(),
  ]);

  return {
    activeProjects,
    archivedProjects,
    membersCount,
    chartData: [
      { name: "Active", value: activeProjects },
      { name: "Archived", value: archivedProjects },
    ],
  };
}
