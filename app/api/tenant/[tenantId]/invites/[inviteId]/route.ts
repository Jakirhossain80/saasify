// FILE: app/api/tenant/[tenantId]/invites/[inviteId]/route.ts
import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { requireAuth } from "@/server/guards/requireAuth";
import { requireTenantAdmin } from "@/server/guards/requireTenantRole";
import type { ApiResponse } from "@/types/api";
import { revokeTenantInvite } from "@/server/services/invites.service";

function json<T>(status: number, body: ApiResponse<T>) {
  return NextResponse.json(body, { status });
}

function ensureTenantIdMatchesParam(paramTenantId: string, scopedTenantId: mongoose.Types.ObjectId) {
  if (!mongoose.isValidObjectId(paramTenantId)) throw new Error("INVALID_TENANT_ID");
  if (String(scopedTenantId) !== String(paramTenantId)) throw new Error("TENANT_MISMATCH");
}

function mustObjectId(id: string): mongoose.Types.ObjectId {
  if (!mongoose.isValidObjectId(id)) throw new Error("INVALID_ID");
  return new mongoose.Types.ObjectId(id);
}

export async function DELETE(_req: Request, ctx: { params: { tenantId: string; inviteId: string } }) {
  try {
    const user = await requireAuth();
    const membership = await requireTenantAdmin();
    ensureTenantIdMatchesParam(ctx.params.tenantId, membership.tenantId);

    const inviteId = mustObjectId(ctx.params.inviteId);

    const updated = await revokeTenantInvite({
      tenantId: membership.tenantId,
      inviteId,
      actorUserId: user.dbUser._id,
    });

    if (!updated) {
      return json(404, { ok: false, error: { code: "NOT_FOUND", message: "Invite not found" } });
    }

    return json(200, { ok: true, data: updated });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Unknown error";
    if (msg === "UNAUTHENTICATED") return json(401, { ok: false, error: { code: "UNAUTHENTICATED", message: "Sign in required" } });
    if (msg === "INVALID_TENANT_ID" || msg === "INVALID_ID") return json(400, { ok: false, error: { code: "VALIDATION_ERROR", message: "Invalid id" } });
    if (msg === "TENANT_MISMATCH" || msg.startsWith("FORBIDDEN_")) return json(403, { ok: false, error: { code: "FORBIDDEN", message: "Access denied" } });
    return json(500, { ok: false, error: { code: "INTERNAL_ERROR", message: "Something went wrong" } });
  }
}
