// FILE: server/guards/requirePlatformAdmin.ts
import { redirect } from "next/navigation";
import { getCurrentAuthUserOrThrow } from "@/server/auth/currentUser";

export async function requirePlatformAdmin() {
  const user = await getCurrentAuthUserOrThrow();

  const isAdmin = user.dbUser?.role === "platform_admin";
  if (!isAdmin) redirect("/");

  return user;
}
