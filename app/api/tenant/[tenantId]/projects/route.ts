// FILE: app/api/tenant/[tenantId]/projects/route.ts
import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { requireAuth } from "@/server/guards/requireAuth";
import { requireTenantMembership } from "@/server/guards/requireTenantMembership";
import { requireTenantAdmin } from "@/server/guards/requireTenantRole";
import {
  CreateProjectSchema,
  ListProjectsQuerySchema,
} from "@/schemas/project.schema";
import { toFieldErrors } from "@/schemas/common.schema";
import type { ApiResponse } from "@/types/api";
import { createTenantProject, listTenantProjects } from "@/server/services/projects.service";

type Params = { tenantId: string };

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

export async function GET(req: Request, ctx: { params: Params }) {
  try {
    await requireAuth();

    const membership = await requireTenantMembership();
    ensureTenantIdMatchesParam(ctx.params.tenantId, membership.tenantId);

    const url = new URL(req.url);
    const parsed = ListProjectsQuerySchema.safeParse({
      limit: url.searchParams.get("limit"),
      offset: url.searchParams.get("offset"),
      search: url.searchParams.get("search"),
      status: url.searchParams.get("status"),
    });

    if (!parsed.success) {
      return json(400, {
        ok: false,
        error: {
          code: "VALIDATION_ERROR",
          message: "Invalid query parameters",
          fieldErrors: toFieldErrors(parsed.error.issues),
        },
      });
    }

    const data = await listTenantProjects(membership.tenantId, parsed.data);

    return json(200, { ok: true, data });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Unknown error";

    if (message === "UNAUTHENTICATED") {
      return json(401, { ok: false, error: { code: "UNAUTHENTICATED", message: "Sign in required" } });
    }

    if (message === "INVALID_TENANT_ID") {
      return json(400, { ok: false, error: { code: "VALIDATION_ERROR", message: "Invalid tenant id" } });
    }

    if (message === "TENANT_MISMATCH" || message.startsWith("FORBIDDEN_")) {
      return json(403, { ok: false, error: { code: "FORBIDDEN", message: "Access denied" } });
    }

    return json(500, {
      ok: false,
      error: { code: "INTERNAL_ERROR", message: "Something went wrong" },
    });
  }
}

export async function POST(req: Request, ctx: { params: Params }) {
  try {
    const user = await requireAuth();

    const membership = await requireTenantAdmin();
    ensureTenantIdMatchesParam(ctx.params.tenantId, membership.tenantId);

    const body = await req.json().catch(() => null);
    const parsed = CreateProjectSchema.safeParse(body);

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

    const project = await createTenantProject({
      tenantId: membership.tenantId,
      title: parsed.data.title,
      description: parsed.data.description ?? "",
      actorUserId: user.dbUser._id,
    });

    return json(201, { ok: true, data: project });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Unknown error";

    if (message === "UNAUTHENTICATED") {
      return json(401, { ok: false, error: { code: "UNAUTHENTICATED", message: "Sign in required" } });
    }

    if (message === "INVALID_TENANT_ID") {
      return json(400, { ok: false, error: { code: "VALIDATION_ERROR", message: "Invalid tenant id" } });
    }

    if (message === "TENANT_MISMATCH" || message.startsWith("FORBIDDEN_")) {
      return json(403, { ok: false, error: { code: "FORBIDDEN", message: "Access denied" } });
    }

    return json(500, {
      ok: false,
      error: { code: "INTERNAL_ERROR", message: "Something went wrong" },
    });
  }
}
