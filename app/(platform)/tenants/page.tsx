// FILE: app/(platform)/tenants/page.tsx
import { requirePlatformAdmin } from "@/server/guards/requirePlatformAdmin";
import { listTenantsForPlatform } from "@/server/services/tenants.service";
import TenantsTable, { type TenantRow } from "@/components/platform/TenantsTable";
import { Card } from "@/components/ui/card";

type PageProps = {
  searchParams: Record<string, string | string[] | undefined>;
};

function pickFirst(v: string | string[] | undefined): string | undefined {
  return Array.isArray(v) ? v[0] : v;
}

export default async function PlatformTenantsPage({ searchParams }: PageProps) {
  await requirePlatformAdmin();

  const limit = Number(pickFirst(searchParams.limit) ?? 12);
  const offset = Number(pickFirst(searchParams.offset) ?? 0);
  const search = pickFirst(searchParams.search);

  const data = await listTenantsForPlatform({
    limit: Number.isFinite(limit) ? limit : 12,
    offset: Number.isFinite(offset) ? offset : 0,
    search,
  });

  const rows: TenantRow[] = data.items.map((t) => ({
    id: String((t as any)?.id ?? (t as any)?._id ?? ""),
    name: String((t as any)?.name ?? ""),
    slug: String((t as any)?.slug ?? ""),
    status: ((t as any)?.status === "suspended" ? "suspended" : "active") as "active" | "suspended",
    createdAt: String((t as any)?.createdAt ?? ""),
  }));

  return (
    <main className="space-y-6">
      <div className="rounded-3xl border bg-card p-6 sm:p-8">
        <p className="text-sm text-muted-foreground">Platform Admin</p>
        <h1 className="mt-2 font-poppins text-2xl font-semibold sm:text-3xl">
          Tenants
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Approve/activate or suspend tenants. Suspended tenants should be blocked from tenant routes.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="rounded-3xl border bg-card p-6">
          <p className="text-sm text-muted-foreground">Total Tenants</p>
          <p className="mt-2 font-poppins text-3xl font-semibold">{data.total}</p>
        </Card>

        <Card className="rounded-3xl border bg-card p-6">
          <p className="text-sm text-muted-foreground">Active</p>
          <p className="mt-2 font-poppins text-3xl font-semibold">{data.active}</p>
        </Card>

        <Card className="rounded-3xl border bg-card p-6">
          <p className="text-sm text-muted-foreground">Suspended</p>
          <p className="mt-2 font-poppins text-3xl font-semibold">{data.suspended}</p>
        </Card>
      </div>

      <TenantsTable
        rows={rows}
        total={data.total}
        limit={data.limit}
        offset={data.offset}
      />
    </main>
  );
}
