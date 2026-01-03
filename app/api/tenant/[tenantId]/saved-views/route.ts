// FILE: app/api/tenant/[tenantId]/saved-views/route.ts
import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { z } from "zod";
import { requireAuth } from "@/server/guards/requireAuth";
import { requireTenantMembership } from "@/server/guards/requireTenantMembership";
import type { ApiResponse } from "@/types/api";
import { toFieldErrors } from "@/schemas/common.schema";
import { createProjectSavedView, listProjectSavedViews, removeSavedView, setSavedViewPinned } from "@/server/services/savedViews.service";

const CreateSchema = z.object({
  name: z.string().min(2).max(60),
  filters: z.object({
    status: z.enum(["active", "archived"]).nullable().optional(),
    search: z.string().max(120).nullable().optional(),
  }),
  isPinned: z.boolean().optional(),
});

const PinSchema = z.object({
  viewId: z.string().min(1),
  isPinned: z.boolean(),
});

const DeleteSchema = z.object({
  viewId: z.string().min(1),
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

export async function GET(_req: Request, ctx: { params: { tenantId: string } }) {
  try {
    const user = await requireAuth();
    const membership = await requireTenantMembership();
    ensureTenantIdMatchesParam(ctx.params.tenantId, membership.tenantId);

    const views = await listProjectSavedViews({
      tenantId: membership.tenantId,
      userId: user.dbUser._id,
    });

    return json(200, { ok: true, data: views });
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
    const membership = await requireTenantMembership();
    ensureTenantIdMatchesParam(ctx.params.tenantId, membership.tenantId);

    const body = await req.json().catch(() => null);
    const parsed = CreateSchema.safeParse(body);

    if (!parsed.success) {
      return json(400, { ok: false, error: { code: "VALIDATION_ERROR", message: "Invalid input", fieldErrors: toFieldErrors(parsed.error.issues) } });
    }

    const view = await createProjectSavedView({
      tenantId: membership.tenantId,
      userId: user.dbUser._id,
      name: parsed.data.name,
      filters: {
        status: parsed.data.filters.status ?? null,
        search: parsed.data.filters.search ?? null,
      },
      isPinned: parsed.data.isPinned,
    });

    return json(201, { ok: true, data: view });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Unknown error";
    if (msg === "UNAUTHENTICATED") return json(401, { ok: false, error: { code: "UNAUTHENTICATED", message: "Sign in required" } });
    if (msg === "INVALID_TENANT_ID") return json(400, { ok: false, error: { code: "VALIDATION_ERROR", message: "Invalid tenant id" } });
    if (msg === "TENANT_MISMATCH" || msg.startsWith("FORBIDDEN_")) return json(403, { ok: false, error: { code: "FORBIDDEN", message: "Access denied" } });
    return json(500, { ok: false, error: { code: "INTERNAL_ERROR", message: "Something went wrong" } });
  }
}

export async function PATCH(req: Request, ctx: { params: { tenantId: string } }) {
  try {
    const user = await requireAuth();
    const membership = await requireTenantMembership();
    ensureTenantIdMatchesParam(ctx.params.tenantId, membership.tenantId);

    const body = await req.json().catch(() => null);
    const parsed = PinSchema.safeParse(body);

    if (!parsed.success) {
      return json(400, { ok: false, error: { code: "VALIDATION_ERROR", message: "Invalid input", fieldErrors: toFieldErrors(parsed.error.issues) } });
    }

    const viewId = mustObjectId(parsed.data.viewId, "INVALID_VIEW_ID");

    const updated = await setSavedViewPinned({
      tenantId: membership.tenantId,
      userId: user.dbUser._id,
      viewId,
      isPinned: parsed.data.isPinned,
    });

    if (!updated) return json(404, { ok: false, error: { code: "NOT_FOUND", message: "Saved view not found" } });
    return json(200, { ok: true, data: updated });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Unknown error";
    if (msg === "UNAUTHENTICATED") return json(401, { ok: false, error: { code: "UNAUTHENTICATED", message: "Sign in required" } });
    if (msg === "INVALID_TENANT_ID" || msg === "INVALID_VIEW_ID") return json(400, { ok: false, error: { code: "VALIDATION_ERROR", message: "Invalid input" } });
    if (msg === "TENANT_MISMATCH" || msg.startsWith("FORBIDDEN_")) return json(403, { ok: false, error: { code: "FORBIDDEN", message: "Access denied" } });
    return json(500, { ok: false, error: { code: "INTERNAL_ERROR", message: "Something went wrong" } });
  }
}

export async function DELETE(req: Request, ctx: { params: { tenantId: string } }) {
  try {
    const user = await requireAuth();
    const membership = await requireTenantMembership();
    ensureTenantIdMatchesParam(ctx.params.tenantId, membership.tenantId);

    const body = await req.json().catch(() => null);
    const parsed = DeleteSchema.safeParse(body);

    if (!parsed.success) {
      return json(400, { ok: false, error: { code: "VALIDATION_ERROR", message: "Invalid input", fieldErrors: toFieldErrors(parsed.error.issues) } });
    }

    const viewId = mustObjectId(parsed.data.viewId, "INVALID_VIEW_ID");

    const removed = await removeSavedView({
      tenantId: membership.tenantId,
      userId: user.dbUser._id,
      viewId,
    });

    if (!removed) return json(404, { ok: false, error: { code: "NOT_FOUND", message: "Saved view not found" } });
    return json(200, { ok: true, data: removed });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Unknown error";
    if (msg === "UNAUTHENTICATED") return json(401, { ok: false, error: { code: "UNAUTHENTICATED", message: "Sign in required" } });
    if (msg === "INVALID_TENANT_ID" || msg === "INVALID_VIEW_ID") return json(400, { ok: false, error: { code: "VALIDATION_ERROR", message: "Invalid input" } });
    if (msg === "TENANT_MISMATCH" || msg.startsWith("FORBIDDEN_")) return json(403, { ok: false, error: { code: "FORBIDDEN", message: "Access denied" } });
    return json(500, { ok: false, error: { code: "INTERNAL_ERROR", message: "Something went wrong" } });
  }
}
