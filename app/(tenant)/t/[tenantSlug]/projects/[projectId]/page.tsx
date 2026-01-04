// FILE: app/(tenant)/[tenantSlug]/projects/[projectId]/page.tsx
import Link from "next/link";
import { redirect } from "next/navigation";
import mongoose from "mongoose";
import { requireAuth } from "@/server/guards/requireAuth";
import { requireTenantMembership } from "@/server/guards/requireTenantMembership";
import { getProjectScoped } from "@/server/services/projects.service";
import ProjectForm from "@/components/projects/ProjectForm";
import EmptyState from "@/components/common/EmptyState";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

type PageProps = {
  params: { tenantSlug: string; projectId: string };
};

function mustObjectId(id: string): mongoose.Types.ObjectId {
  if (!mongoose.isValidObjectId(id)) {
    throw new Error("INVALID_PROJECT_ID");
  }
  return new mongoose.Types.ObjectId(id);
}

export default async function ProjectDetailsPage({ params }: PageProps) {
  await requireAuth();
  const membership = await requireTenantMembership();

  const actualSlug = membership.ctx.tenant?.slug;
  if (actualSlug && params.tenantSlug !== actualSlug) {
    redirect(`/tenant/${actualSlug}/projects/${params.projectId}`);
  }

  let projectId: mongoose.Types.ObjectId;
  try {
    projectId = mustObjectId(params.projectId);
  } catch {
    return (
      <EmptyState
        title="Invalid project"
        description="The project id is not valid."
        action={
          <Button asChild className="rounded-full">
            <Link href={`/tenant/${params.tenantSlug}/projects`}>Back to projects</Link>
          </Button>
        }
      />
    );
  }

  const project = await getProjectScoped(membership.tenantId, projectId);

  if (!project) {
    return (
      <EmptyState
        title="Project not found"
        description="This project may not exist or you may not have access to it."
        action={
          <Button asChild className="rounded-full">
            <Link href={`/tenant/${params.tenantSlug}/projects`}>Back to projects</Link>
          </Button>
        }
      />
    );
  }

  const canManage = membership.role === "tenant_admin";
  const status = (project as unknown as { status?: string }).status === "archived" ? "archived" : "active";

  return (
    <main className="space-y-6">
      <div className="flex flex-col gap-4 rounded-3xl border bg-card p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="font-poppins text-2xl font-semibold sm:text-3xl">
              {(project as unknown as { title?: string }).title ?? "Project"}
            </h1>
            <Badge variant={status === "archived" ? "secondary" : "default"}>
              {status === "archived" ? "Archived" : "Active"}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            Tenant: <span className="font-medium text-foreground">{membership.ctx.tenant?.name ?? "Workspace"}</span>
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <Button asChild variant="outline" className="rounded-full">
            <Link href={`/tenant/${params.tenantSlug}/projects`}>Back</Link>
          </Button>
          <Button asChild variant="secondary" className="rounded-full">
            <Link href="/tenant/select-tenant">Switch tenant</Link>
          </Button>
        </div>
      </div>

      <div className="rounded-3xl border bg-card p-6 sm:p-8">
        <h2 className="font-poppins text-lg font-semibold">Description</h2>
        <p className="mt-2 whitespace-pre-wrap text-sm text-muted-foreground">
          {(project as unknown as { description?: string }).description?.trim()
            ? (project as unknown as { description?: string }).description
            : "No description provided."}
        </p>
      </div>

      {canManage ? (
        <ProjectForm
          mode="edit"
          tenantId={String(membership.tenantId)}
          tenantSlug={membership.ctx.tenant?.slug ?? params.tenantSlug}
          projectId={String((project as unknown as { id?: string; _id?: string }).id ?? (project as any)._id ?? params.projectId)}
          initial={{
            title: String((project as unknown as { title?: string }).title ?? ""),
            description: String((project as unknown as { description?: string }).description ?? ""),
            status: status,
          }}
        />
      ) : (
        <div className="rounded-3xl border bg-card p-6 sm:p-8">
          <p className="text-sm text-muted-foreground">
            You have read-only access (Tenant User). Ask a Tenant Admin to edit this project.
          </p>
        </div>
      )}
    </main>
  );
}
