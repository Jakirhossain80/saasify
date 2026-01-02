// FILE: server/guards/requirePlatformAdmin.ts
import { requireAuth } from "@/server/guards/requireAuth";
import type { CurrentAuthUser } from "@/server/auth/currentUser";

export async function requirePlatformAdmin(): Promise<CurrentAuthUser> {
  const user = await requireAuth();

  if (user.dbUser.platformRole !== "platform_admin") {
    throw new Error("FORBIDDEN_PLATFORM_ADMIN_ONLY");
  }

  return user;
}
