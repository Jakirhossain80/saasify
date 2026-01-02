// FILE: app/(tenant)/[tenantSlug]/dashboard/page.tsx
import Link from "next/link";
import { redirect } from "next/navigation";
import { requireAuth } from "@/server/guards/requireAuth";
import { requireTenantMembership } from "@/server/guards/requireTenantMembership";
import { getTenantDashboardStats } from "@/server/services/analytics.service";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import TenantProjectsChart from "@/components/charts/TenantProjectsChart";

type PageProps = {
  params: { tenantSlug: string };
};

export default async function TenantDashboardPage({ params }: PageProps) {
  await requireAuth();
  const membership = await requireTenantMembership();

  const actualSlug = membership.ctx.tenant?.slug;
  if (actualSlug && params.tenantSlug !== actualSlug) {
    redirect(`/tenant/${actualSlug}/dashboard`);
  }

  const stats = await getTenantDashboardStats(membership.tenantId);

  const canManage = membership.role === "tenant_admin";

  return (
    <main className="space-y-6">
      <div className="flex flex-col gap-4 rounded-3xl border bg-card p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
        <div className="space-y-1">
          <p className="text-sm text-muted-foreground">
            Tenant:{" "}
            <span className="font-medium text-foreground">
              {membership.ctx.tenant?.name ?? "Workspace"}
            </span>
          </p>
          <h1 className="font-poppins text-2xl font-semibold sm:text-3xl">
            Tenant Dashboard
          </h1>
          <p className="text-sm text-muted-foreground">
            Projects and membership overview for this tenant.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <Button asChild variant="outline" className="rounded-full">
            <Link href={`/tenant/${params.tenantSlug}/projects`}>Projects</Link>
          </Button>
          <Button asChild variant="secondary" className="rounded-full">
            <Link href="/tenant/select-tenant">Switch tenant</Link>
          </Button>
          <span className="inline-flex items-center rounded-full border px-3 py-1 text-xs text-muted-foreground">
            {canManage ? "Tenant Admin" : "Tenant User"}
          </span>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="rounded-3xl border bg-card p-6">
          <p className="text-sm text-muted-foreground">Projects (Active)</p>
          <p className="mt-2 font-poppins text-3xl font-semibold">
            {stats.activeProjects}
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            Active projects inside this tenant.
          </p>
        </Card>

        <Card className="rounded-3xl border bg-card p-6">
          <p className="text-sm text-muted-foreground">Projects (Archived)</p>
          <p className="mt-2 font-poppins text-3xl font-semibold">
            {stats.archivedProjects}
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            Archived projects inside this tenant.
          </p>
        </Card>

        <Card className="rounded-3xl border bg-card p-6">
          <p className="text-sm text-muted-foreground">Members</p>
          <p className="mt-2 font-poppins text-3xl font-semibold">
            {stats.membersCount}
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            Active members in this tenant.
          </p>
        </Card>
      </div>

      <Card className="rounded-3xl border bg-card p-6 sm:p-8">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="font-poppins text-lg font-semibold">
              Projects status breakdown
            </h2>
            <p className="text-sm text-muted-foreground">
              A simple chart for active vs archived projects.
            </p>
          </div>
        </div>

        <div className="mt-6 h-[280px] w-full">
          <TenantProjectsChart data={stats.chartData} />
        </div>
      </Card>
    </main>
  );
}
