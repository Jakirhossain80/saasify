// FILE: app/api/tenant/[tenantId]/audit-logs/route.ts
import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { requireAuth } from "@/server/guards/requireAuth";
import { requireTenantMembership } from "@/server/guards/requireTenantMembership";
import { getTenantAuditLogs } from "@/server/services/auditLogs.service";
import type { ApiResponse } from "@/types/api";

function json<T>(status: number, body: ApiResponse<T>) {
  return NextResponse.json(body, { status });
}

function ensureTenantIdMatchesParam(paramTenantId: string, scopedTenantId: mongoose.Types.ObjectId) {
  if (!mongoose.isValidObjectId(paramTenantId)) throw new Error("INVALID_TENANT_ID");
  if (String(scopedTenantId) !== String(paramTenantId)) throw new Error("TENANT_MISMATCH");
}

export async function GET(req: Request, ctx: { params: { tenantId: string } }) {
  try {
    await requireAuth();
    const membership = await requireTenantMembership();
    ensureTenantIdMatchesParam(ctx.params.tenantId, membership.tenantId);

    const url = new URL(req.url);
    const limit = Number(url.searchParams.get("limit") ?? 20);
    const offset = Number(url.searchParams.get("offset") ?? 0);

    const logs = await getTenantAuditLogs({
      tenantId: membership.tenantId,
      limit: Number.isFinite(limit) ? limit : 20,
      offset: Number.isFinite(offset) ? offset : 0,
    });

    return json(200, { ok: true, data: logs });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Unknown error";
    if (msg === "UNAUTHENTICATED") return json(401, { ok: false, error: { code: "UNAUTHENTICATED", message: "Sign in required" } });
    if (msg === "INVALID_TENANT_ID") return json(400, { ok: false, error: { code: "VALIDATION_ERROR", message: "Invalid tenant id" } });
    if (msg === "TENANT_MISMATCH" || msg.startsWith("FORBIDDEN_")) return json(403, { ok: false, error: { code: "FORBIDDEN", message: "Access denied" } });
    return json(500, { ok: false, error: { code: "INTERNAL_ERROR", message: "Something went wrong" } });
  }
}
