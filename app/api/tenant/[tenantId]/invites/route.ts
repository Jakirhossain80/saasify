// FILE: app/api/tenant/[tenantId]/invites/route.ts
import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { z } from "zod";
import { requireAuth } from "@/server/guards/requireAuth";
import { requireTenantAdmin } from "@/server/guards/requireTenantRole";
import { requireTenantMembership } from "@/server/guards/requireTenantMembership";
import type { ApiResponse } from "@/types/api";
import { toFieldErrors } from "@/schemas/common.schema";
import { createTenantInvite, listTenantInvites } from "@/server/services/invites.service";

const CreateInviteSchema = z.object({
  email: z.string().email(),
  role: z.enum(["tenant_admin", "member"]).default("member"),
});

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
    const status = url.searchParams.get("status") ?? undefined;
    const limit = Number(url.searchParams.get("limit") ?? 20);
    const offset = Number(url.searchParams.get("offset") ?? 0);

    const invites = await listTenantInvites({
      tenantId: membership.tenantId,
      status: (status as any) ?? undefined,
      limit: Number.isFinite(limit) ? limit : 20,
      offset: Number.isFinite(offset) ? offset : 0,
    });

    return json(200, { ok: true, data: invites });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Unknown error";
    if (msg === "UNAUTHENTICATED") return json(401, { ok: false, error: { code: "UNAUTHENTICATED", message: "Sign in required" } });
    if (msg === "INVALID_TENANT_ID") return json(400, { ok: false, error: { code: "VALIDATION_ERROR", message: "Invalid tenant id" } });
    if (msg === "TENANT_MISMATCH" || msg.startsWith("FORBIDDEN_")) return json(403, { ok: false, error: { code: "FORBIDDEN", message: "Access denied" } });
    return json(500, { ok: false, error: { code: "INTERNAL_ERROR", message: "Something went wrong" } });
  }
}

export async function POST(req: Request, ctx: { params: { tenantId: string } }) {
  try {
    const user = await requireAuth();
    const membership = await requireTenantAdmin();
    ensureTenantIdMatchesParam(ctx.params.tenantId, membership.tenantId);

    const body = await req.json().catch(() => null);
    const parsed = CreateInviteSchema.safeParse(body);

    if (!parsed.success) {
      return json(400, {
        ok: false,
        error: { code: "VALIDATION_ERROR", message: "Invalid input", fieldErrors: toFieldErrors(parsed.error.issues) },
      });
    }

    const result = await createTenantInvite({
      tenantId: membership.tenantId,
      email: parsed.data.email,
      role: parsed.data.role,
      invitedByUserId: user.dbUser._id,
    });

    // MVP: return token for testing; V2: email link with token.
    return json(201, {
      ok: true,
      data: {
        invite: result.invite,
        rawToken: result.rawToken,
      },
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Unknown error";
    if (msg === "UNAUTHENTICATED") return json(401, { ok: false, error: { code: "UNAUTHENTICATED", message: "Sign in required" } });
    if (msg === "INVALID_TENANT_ID") return json(400, { ok: false, error: { code: "VALIDATION_ERROR", message: "Invalid tenant id" } });
    if (msg === "TENANT_MISMATCH" || msg.startsWith("FORBIDDEN_")) return json(403, { ok: false, error: { code: "FORBIDDEN", message: "Access denied" } });
    return json(500, { ok: false, error: { code: "INTERNAL_ERROR", message: "Something went wrong" } });
  }
}
