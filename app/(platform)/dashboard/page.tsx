// FILE: app/(platform)/dashboard/page.tsx
import Link from "next/link";
import { requirePlatformAdmin } from "@/server/guards/requirePlatformAdmin";
import { getPlatformDashboardStats } from "@/server/services/analytics.service";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import PlatformTotalsChart from "@/components/charts/PlatformTotalsChart";

export default async function PlatformDashboardPage() {
  await requirePlatformAdmin();

  const stats = await getPlatformDashboardStats();

  return (
    <main className="space-y-6">
      <div className="flex flex-col gap-4 rounded-3xl border bg-card p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
        <div className="space-y-1">
          <p className="text-sm text-muted-foreground">Platform Admin</p>
          <h1 className="font-poppins text-2xl font-semibold sm:text-3xl">
            Platform Dashboard
          </h1>
          <p className="text-sm text-muted-foreground">
            High-level totals across all tenants.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <Button asChild variant="outline" className="rounded-full">
            <Link href="/platform">Platform Home</Link>
          </Button>
          <Button asChild variant="secondary" className="rounded-full">
            <Link href="/t/select-tenant">Tenant Workspace</Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="rounded-3xl border bg-card p-6">
          <p className="text-sm text-muted-foreground">Tenants</p>
          <p className="mt-2 font-poppins text-3xl font-semibold">
            {stats.totalTenants}
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            Total tenants created in the platform.
          </p>
        </Card>

        <Card className="rounded-3xl border bg-card p-6">
          <p className="text-sm text-muted-foreground">Active Tenants</p>
          <p className="mt-2 font-poppins text-3xl font-semibold">
            {stats.activeTenants}
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            Active tenants (not suspended).
          </p>
        </Card>

        <Card className="rounded-3xl border bg-card p-6">
          <p className="text-sm text-muted-foreground">Total Projects</p>
          <p className="mt-2 font-poppins text-3xl font-semibold">
            {stats.totalProjects}
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            All projects across all tenants.
          </p>
        </Card>
      </div>

      <Card className="rounded-3xl border bg-card p-6 sm:p-8">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="font-poppins text-lg font-semibold">
              Tenants vs Projects
            </h2>
            <p className="text-sm text-muted-foreground">
              Simple overview chart (avoid overbuilding early).
            </p>
          </div>
        </div>

        <div className="mt-6 h-[280px] w-full">
          <PlatformTotalsChart data={stats.chartData} />
        </div>
      </Card>
    </main>
  );
}
