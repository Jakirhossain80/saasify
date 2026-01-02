// FILE: server/guards/requireAuth.ts
import { getCurrentAuthUserOrThrow, type CurrentAuthUser } from "@/server/auth/currentUser";

export async function requireAuth(): Promise<CurrentAuthUser> {
  return getCurrentAuthUserOrThrow();
}
