// FILE: app/api/platform/tenants/route.ts
import { NextResponse } from "next/server";
import { requirePlatformAdmin } from "@/server/guards/requirePlatformAdmin";
import { listTenantsForPlatform } from "@/server/services/tenants.service";
import type { ApiResponse } from "@/types/api";

function json<T>(status: number, body: ApiResponse<T>) {
  return NextResponse.json(body, { status });
}

export async function GET(req: Request) {
  try {
    await requirePlatformAdmin();

    const url = new URL(req.url);
    const limit = Number(url.searchParams.get("limit") ?? 12);
    const offset = Number(url.searchParams.get("offset") ?? 0);
    const search = url.searchParams.get("search") ?? undefined;

    const data = await listTenantsForPlatform({
      limit: Number.isFinite(limit) ? limit : 12,
      offset: Number.isFinite(offset) ? offset : 0,
      search,
    });

    return json(200, { ok: true, data });
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
