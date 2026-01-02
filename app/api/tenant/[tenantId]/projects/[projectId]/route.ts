// FILE: app/api/tenant/[tenantId]/projects/[projectId]/route.ts
import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { requireAuth } from "@/server/guards/requireAuth";
import { requireTenantMembership } from "@/server/guards/requireTenantMembership";
import { requireTenantAdmin } from "@/server/guards/requireTenantRole";
import { UpdateProjectSchema } from "@/schemas/project.schema";
import { toFieldErrors } from "@/schemas/common.schema";
import type { ApiResponse } from "@/types/api";
import {
  getProjectScoped,
  updateTenantProject,
  softDeleteTenantProject,
} from "@/server/services/projects.service";

type Params = { tenantId: string; projectId: string };

function json<T>(status: number, body: ApiResponse<T>) {
  return NextResponse.json(body, { status });
}

function ensureTenantIdMatchesParam(paramTenantId: string, scopedTenantId: mongoose.Types.ObjectId) {
  if (!mongoose.isValidObjectId(paramTenantId)) {
    throw new Error("INVALID_TENANT_ID");
  }
  if (String(scopedTenantId) !== String(paramTenantId)) {
    throw new Error("TENANT_MISMATCH");
  }
}

function ensureValidProjectId(projectId: string) {
  if (!mongoose.isValidObjectId(projectId)) {
    throw new Error("INVALID_PROJECT_ID");
  }
  return new mongoose.Types.ObjectId(projectId);
}

export async function GET(_req: Request, ctx: { params: Params }) {
  try {
    await requireAuth();

    const membership = await requireTenantMembership();
    ensureTenantIdMatchesParam(ctx.params.tenantId, membership.tenantId);

    const projectObjectId = ensureValidProjectId(ctx.params.projectId);

    const project = await getProjectScoped(membership.tenantId, projectObjectId);
    if (!project) {
      return json(404, {
        ok: false,
        error: { code: "NOT_FOUND", message: "Project not found" },
      });
    }

    return json(200, { ok: true, data: project });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Unknown error";

    if (message === "UNAUTHENTICATED") {
      return json(401, { ok: false, error: { code: "UNAUTHENTICATED", message: "Sign in required" } });
    }

    if (message === "INVALID_TENANT_ID" || message === "INVALID_PROJECT_ID") {
      return json(400, { ok: false, error: { code: "VALIDATION_ERROR", message: "Invalid id" } });
    }

    if (message === "TENANT_MISMATCH" || message.startsWith("FORBIDDEN_")) {
      return json(403, { ok: false, error: { code: "FORBIDDEN", message: "Access denied" } });
    }

    return json(500, { ok: false, error: { code: "INTERNAL_ERROR", message: "Something went wrong" } });
  }
}

export async function PATCH(req: Request, ctx: { params: Params }) {
  try {
    const user = await requireAuth();

    const membership = await requireTenantAdmin();
    ensureTenantIdMatchesParam(ctx.params.tenantId, membership.tenantId);

    const projectObjectId = ensureValidProjectId(ctx.params.projectId);

    const body = await req.json().catch(() => null);
    const parsed = UpdateProjectSchema.safeParse(body);

    if (!parsed.success) {
      return json(400, {
        ok: false,
        error: {
          code: "VALIDATION_ERROR",
          message: "Invalid input",
          fieldErrors: toFieldErrors(parsed.error.issues),
        },
      });
    }

    const updated = await updateTenantProject({
      tenantId: membership.tenantId,
      projectId: projectObjectId,
      title: parsed.data.title,
      description: parsed.data.description,
      status: parsed.data.status,
      actorUserId: user.dbUser._id,
    });

    if (!updated) {
      return json(404, { ok: false, error: { code: "NOT_FOUND", message: "Project not found" } });
    }

    return json(200, { ok: true, data: updated });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Unknown error";

    if (message === "UNAUTHENTICATED") {
      return json(401, { ok: false, error: { code: "UNAUTHENTICATED", message: "Sign in required" } });
    }

    if (message === "INVALID_TENANT_ID" || message === "INVALID_PROJECT_ID") {
      return json(400, { ok: false, error: { code: "VALIDATION_ERROR", message: "Invalid id" } });
    }

    if (message === "TENANT_MISMATCH" || message.startsWith("FORBIDDEN_")) {
      return json(403, { ok: false, error: { code: "FORBIDDEN", message: "Access denied" } });
    }

    return json(500, { ok: false, error: { code: "INTERNAL_ERROR", message: "Something went wrong" } });
  }
}

export async function DELETE(_req: Request, ctx: { params: Params }) {
  try {
    const user = await requireAuth();

    const membership = await requireTenantAdmin();
    ensureTenantIdMatchesParam(ctx.params.tenantId, membership.tenantId);

    const projectObjectId = ensureValidProjectId(ctx.params.projectId);

    const deleted = await softDeleteTenantProject(
      membership.tenantId,
      projectObjectId,
      user.dbUser._id
    );

    if (!deleted) {
      return json(404, { ok: false, error: { code: "NOT_FOUND", message: "Project not found" } });
    }

    return json(200, { ok: true, data: deleted });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Unknown error";

    if (message === "UNAUTHENTICATED") {
      return json(401, { ok: false, error: { code: "UNAUTHENTICATED", message: "Sign in required" } });
    }

    if (message === "INVALID_TENANT_ID" || message === "INVALID_PROJECT_ID") {
      return json(400, { ok: false, error: { code: "VALIDATION_ERROR", message: "Invalid id" } });
    }

    if (message === "TENANT_MISMATCH" || message.startsWith("FORBIDDEN_")) {
      return json(403, { ok: false, error: { code: "FORBIDDEN", message: "Access denied" } });
    }

    return json(500, { ok: false, error: { code: "INTERNAL_ERROR", message: "Something went wrong" } });
  }
}
