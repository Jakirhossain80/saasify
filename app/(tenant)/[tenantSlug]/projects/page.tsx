// FILE: app/(tenant)/[tenantSlug]/projects/page.tsx
import Link from "next/link";
import { redirect } from "next/navigation";
import mongoose from "mongoose";
import { requireAuth } from "@/server/guards/requireAuth";
import { requireTenantMembership } from "@/server/guards/requireTenantMembership";
import { listTenantProjects } from "@/server/services/projects.service";
import { ListProjectsQuerySchema } from "@/schemas/project.schema";
import ProjectsTable, { type ProjectRow } from "@/components/projects/ProjectsTable";
import ProjectForm from "@/components/projects/ProjectForm";
import EmptyState from "@/components/common/EmptyState";
import SearchInput from "@/components/common/SearchInput";
import Pagination from "@/components/common/Pagination";
import { Button } from "@/components/ui/button";

type PageProps = {
  params: { tenantSlug: string };
  searchParams: Record<string, string | string[] | undefined>;
};

function pickFirst(v: string | string[] | undefined): string | undefined {
  return Array.isArray(v) ? v[0] : v;
}

function toProjectRow(doc: unknown): ProjectRow {
  // Projects from Mongoose docs become plain objects via JSON stringify in RSC.
  // We only rely on stable fields; id may exist as `id` or `_id`.
  const d = doc as Record<string, unknown>;
  const id = (d.id ?? d._id ?? "") as string;
  return {
    id: String(id),
    title: String(d.title ?? ""),
    description: String(d.description ?? ""),
    status: (d.status === "archived" ? "archived" : "active") as "active" | "archived",
    createdAt: String(d.createdAt ?? ""),
    updatedAt: String(d.updatedAt ?? ""),
  };
}

export default async function TenantProjectsPage({ params, searchParams }: PageProps) {
  const user = await requireAuth();
  const membership = await requireTenantMembership();

  // Ensure tenantSlug matches the selected tenant from tenant context
  const actualSlug = membership.ctx.tenant?.slug;
  if (actualSlug && params.tenantSlug !== actualSlug) {
    const url = new URL(`/tenant/${actualSlug}/projects`, "http://local");
    const sp = new URLSearchParams();
    for (const [k, v] of Object.entries(searchParams)) {
      const val = pickFirst(v);
      if (val) sp.set(k, val);
    }
    url.search = sp.toString();
    redirect(url.pathname + (url.search ? `?${url.searchParams.toString()}` : ""));
  }

  const parsed = ListProjectsQuerySchema.safeParse({
    limit: pickFirst(searchParams.limit),
    offset: pickFirst(searchParams.offset),
    search: pickFirst(searchParams.search),
    status: pickFirst(searchParams.status),
  });

  const query = parsed.success ? parsed.data : { limit: 12, offset: 0, search: undefined, status: undefined };

  const projects = await listTenantProjects(membership.tenantId, query);
  const rows = projects.map((p) => toProjectRow(p));

  const canManage = membership.role === "tenant_admin";

  return (
    <main className="space-y-6">
      <div className="flex flex-col gap-4 rounded-3xl border bg-card p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
        <div className="space-y-1">
          <p className="text-sm text-muted-foreground">
            Tenant: <span className="font-medium text-foreground">{membership.ctx.tenant?.name ?? "Workspace"}</span>
          </p>
          <h1 className="font-poppins text-2xl font-semibold sm:text-3xl">Projects</h1>
          <p className="text-sm text-muted-foreground">
            Tenant-scoped projects with search and pagination.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <Button asChild variant="outline" className="rounded-full">
            <Link href="/tenant">Back to Tenant</Link>
          </Button>
          <Button asChild variant="secondary" className="rounded-full">
            <Link href="/tenant/select-tenant">Switch tenant</Link>
          </Button>
        </div>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <SearchInput placeholder="Search projects..." />
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span className="hidden sm:inline">Signed in as</span>
          <span className="font-medium text-foreground">{user.email}</span>
          <span className="rounded-full border px-2 py-0.5 text-[11px]">
            {canManage ? "Tenant Admin" : "Tenant User"}
          </span>
        </div>
      </div>

      {canManage ? (
        <ProjectForm
          mode="create"
          tenantId={String(membership.tenantId)}
          tenantSlug={membership.ctx.tenant?.slug ?? params.tenantSlug}
        />
      ) : null}

      {rows.length === 0 ? (
        <EmptyState
          title="No projects yet"
          description={
            canManage
              ? "Create your first project to get started."
              : "No projects are visible in this tenant yet."
          }
          action={
            canManage ? (
              <Button asChild className="rounded-full">
                <Link href="#create-project">Create project</Link>
              </Button>
            ) : undefined
          }
        />
      ) : (
        <ProjectsTable
          tenantId={String(membership.tenantId)}
          tenantSlug={membership.ctx.tenant?.slug ?? params.tenantSlug}
          rows={rows}
          canManage={canManage}
        />
      )}

      <Pagination limit={query.limit} offset={query.offset} itemCount={rows.length} />
    </main>
  );
}
