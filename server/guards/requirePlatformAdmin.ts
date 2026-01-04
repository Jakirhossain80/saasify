// FILE: server/guards/requirePlatformAdmin.ts
import { redirect } from "next/navigation";
import { getCurrentAuthUserOrThrow } from "@/server/auth/currentUser";

export async function requirePlatformAdmin() {
  try {
    const user = await getCurrentAuthUserOrThrow();

    // TODO: replace this with your real admin check
    const isAdmin = user.dbUser?.role === "platform_admin";

    if (!isAdmin) {
      redirect("/");
    }

    return user;
  } catch (e) {
    redirect("/sign-in");
  }
}
