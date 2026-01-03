// FILE: app/api/tenant/[tenantId]/projects/[projectId]/restore/route.ts
import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { requireAuth } from "@/server/guards/requireAuth";
import { requireTenantAdmin } from "@/server/guards/requireTenantRole";
import type { ApiResponse } from "@/types/api";
import { restoreSoftDeletedTenantProject } from "@/server/services/projects.service";

function json<T>(status: number, body: ApiResponse<T>) {
  return NextResponse.json(body, { status });
}

function ensureTenantIdMatchesParam(paramTenantId: string, scopedTenantId: mongoose.Types.ObjectId) {
  if (!mongoose.isValidObjectId(paramTenantId)) throw new Error("INVALID_TENANT_ID");
  if (String(scopedTenantId) !== String(paramTenantId)) throw new Error("TENANT_MISMATCH");
}

function mustObjectId(id: string, code: string): mongoose.Types.ObjectId {
  if (!mongoose.isValidObjectId(id)) throw new Error(code);
  return new mongoose.Types.ObjectId(id);
}

export async function POST(_req: Request, ctx: { params: { tenantId: string; projectId: string } }) {
  try {
    const user = await requireAuth();
    const membership = await requireTenantAdmin();
    ensureTenantIdMatchesParam(ctx.params.tenantId, membership.tenantId);

    const projectId = mustObjectId(ctx.params.projectId, "INVALID_PROJECT_ID");

    const restored = await restoreSoftDeletedTenantProject(membership.tenantId, projectId, user.dbUser._id);
    if (!restored) return json(404, { ok: false, error: { code: "NOT_FOUND", message: "Project not found" } });

    return json(200, { ok: true, data: restored });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Unknown error";
    if (msg === "UNAUTHENTICATED") return json(401, { ok: false, error: { code: "UNAUTHENTICATED", message: "Sign in required" } });
    if (msg === "INVALID_TENANT_ID" || msg === "INVALID_PROJECT_ID") return json(400, { ok: false, error: { code: "VALIDATION_ERROR", message: "Invalid id" } });
    if (msg === "TENANT_MISMATCH" || msg.startsWith("FORBIDDEN_")) return json(403, { ok: false, error: { code: "FORBIDDEN", message: "Access denied" } });
    return json(500, { ok: false, error: { code: "INTERNAL_ERROR", message: "Something went wrong" } });
  }
}
