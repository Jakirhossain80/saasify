// FILE: app/api/platform/tenants/[tenantId]/route.ts
import { NextResponse } from "next/server";
import { z } from "zod";
import { requirePlatformAdmin } from "@/server/guards/requirePlatformAdmin";
import { setTenantStatus } from "@/server/services/tenants.service";
import { toFieldErrors } from "@/schemas/common.schema";
import type { ApiResponse } from "@/types/api";

const PatchSchema = z.object({
  status: z.enum(["active", "suspended"]),
});

function json<T>(status: number, body: ApiResponse<T>) {
  return NextResponse.json(body, { status });
}

export async function PATCH(req: Request, ctx: { params: { tenantId: string } }) {
  try {
    await requirePlatformAdmin();

    const body = await req.json().catch(() => null);
    const parsed = PatchSchema.safeParse(body);

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

    const updated = await setTenantStatus(ctx.params.tenantId, parsed.data.status);
    if (!updated) {
      return json(404, { ok: false, error: { code: "NOT_FOUND", message: "Tenant not found" } });
    }

    return json(200, { ok: true, data: updated });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Unknown error";

    if (message === "UNAUTHENTICATED") {
      return json(401, { ok: false, error: { code: "UNAUTHENTICATED", message: "Sign in required" } });
    }

    if (message.startsWith("FORBIDDEN_")) {
      return json(403, { ok: false, error: { code: "FORBIDDEN", message: "Access denied" } });
    }

    return json(500, { ok: false, error: { code: "INTERNAL_ERROR", message: "Something went wrong" } });
  }
}
