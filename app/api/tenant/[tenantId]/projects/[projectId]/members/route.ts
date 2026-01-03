// FILE: app/api/tenant/[tenantId]/projects/[projectId]/members/route.ts
import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { z } from "zod";
import { requireAuth } from "@/server/guards/requireAuth";
import { requireTenantAdmin } from "@/server/guards/requireTenantRole";
import type { ApiResponse } from "@/types/api";
import { toFieldErrors } from "@/schemas/common.schema";
import { assignProjectMember, getProjectMembers, unassignProjectMember } from "@/server/services/projectAccess.service";

const UpsertSchema = z.object({
  userId: z.string().min(1),
  role: z.enum(["viewer", "editor"]),
});

const RemoveSchema = z.object({
  userId: z.string().min(1),
});

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

export async function GET(_req: Request, ctx: { params: { tenantId: string; projectId: string } }) {
  try {
    await requireAuth();
    const membership = await requireTenantAdmin();
    ensureTenantIdMatchesParam(ctx.params.tenantId, membership.tenantId);

    const projectId = mustObjectId(ctx.params.projectId, "INVALID_PROJECT_ID");

    const members = await getProjectMembers({ tenantId: membership.tenantId, projectId });
    return json(200, { ok: true, data: members });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Unknown error";
    if (msg === "UNAUTHENTICATED") return json(401, { ok: false, error: { code: "UNAUTHENTICATED", message: "Sign in required" } });
    if (msg === "INVALID_TENANT_ID" || msg === "INVALID_PROJECT_ID") return json(400, { ok: false, error: { code: "VALIDATION_ERROR", message: "Invalid id" } });
    if (msg === "TENANT_MISMATCH" || msg.startsWith("FORBIDDEN_")) return json(403, { ok: false, error: { code: "FORBIDDEN", message: "Access denied" } });
    return json(500, { ok: false, error: { code: "INTERNAL_ERROR", message: "Something went wrong" } });
  }
}

export async function POST(req: Request, ctx: { params: { tenantId: string; projectId: string } }) {
  try {
    const user = await requireAuth();
    const membership = await requireTenantAdmin();
    ensureTenantIdMatchesParam(ctx.params.tenantId, membership.tenantId);

    const body = await req.json().catch(() => null);
    const parsed = UpsertSchema.safeParse(body);
    if (!parsed.success) {
      return json(400, { ok: false, error: { code: "VALIDATION_ERROR", message: "Invalid input", fieldErrors: toFieldErrors(parsed.error.issues) } });
    }

    const projectId = mustObjectId(ctx.params.projectId, "INVALID_PROJECT_ID");
    const targetUserId = mustObjectId(parsed.data.userId, "INVALID_USER_ID");

    const doc = await assignProjectMember({
      tenantId: membership.tenantId,
      projectId,
      userId: targetUserId,
      role: parsed.data.role,
      actorUserId: user.dbUser._id,
    });

    return json(200, { ok: true, data: doc });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Unknown error";
    if (msg === "UNAUTHENTICATED") return json(401, { ok: false, error: { code: "UNAUTHENTICATED", message: "Sign in required" } });
    if (msg.startsWith("INVALID_") || msg === "INVALID_TENANT_ID") return json(400, { ok: false, error: { code: "VALIDATION_ERROR", message: "Invalid input" } });
    if (msg === "TENANT_MISMATCH" || msg.startsWith("FORBIDDEN_")) return json(403, { ok: false, error: { code: "FORBIDDEN", message: "Access denied" } });
    return json(500, { ok: false, error: { code: "INTERNAL_ERROR", message: "Something went wrong" } });
  }
}

export async function DELETE(req: Request, ctx: { params: { tenantId: string; projectId: string } }) {
  try {
    const user = await requireAuth();
    const membership = await requireTenantAdmin();
    ensureTenantIdMatchesParam(ctx.params.tenantId, membership.tenantId);

    const body = await req.json().catch(() => null);
    const parsed = RemoveSchema.safeParse(body);
    if (!parsed.success) {
      return json(400, { ok: false, error: { code: "VALIDATION_ERROR", message: "Invalid input", fieldErrors: toFieldErrors(parsed.error.issues) } });
    }

    const projectId = mustObjectId(ctx.params.projectId, "INVALID_PROJECT_ID");
    const targetUserId = mustObjectId(parsed.data.userId, "INVALID_USER_ID");

    const doc = await unassignProjectMember({
      tenantId: membership.tenantId,
      projectId,
      userId: targetUserId,
      actorUserId: user.dbUser._id,
    });

    if (!doc) return json(404, { ok: false, error: { code: "NOT_FOUND", message: "Project member not found" } });
    return json(200, { ok: true, data: doc });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Unknown error";
    if (msg === "UNAUTHENTICATED") return json(401, { ok: false, error: { code: "UNAUTHENTICATED", message: "Sign in required" } });
    if (msg.startsWith("INVALID_") || msg === "INVALID_TENANT_ID") return json(400, { ok: false, error: { code: "VALIDATION_ERROR", message: "Invalid input" } });
    if (msg === "TENANT_MISMATCH" || msg.startsWith("FORBIDDEN_")) return json(403, { ok: false, error: { code: "FORBIDDEN", message: "Access denied" } });
    return json(500, { ok: false, error: { code: "INTERNAL_ERROR", message: "Something went wrong" } });
  }
}
