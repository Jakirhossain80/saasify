// FILE: server/auth/currentUser.ts
import { auth, currentUser } from "@clerk/nextjs/server";
import type mongoose from "mongoose";
import {
  ensureUserFromClerk,
  getUserByClerkId,
} from "@/server/services/users.service";
import type { UserDoc } from "@/server/models/User";

export type CurrentAuthUser = {
  clerkUserId: string;
  email: string;
  name: string;
  imageUrl: string;
  dbUser: UserDoc & { _id: mongoose.Types.ObjectId };
};

function buildName(first?: string | null, last?: string | null): string {
  const f = first?.trim() ?? "";
  const l = last?.trim() ?? "";
  return [f, l].filter(Boolean).join(" ").trim();
}

export async function getCurrentAuthUserOrNull(): Promise<CurrentAuthUser | null> {
  const { userId: clerkUserId } = auth();
  if (!clerkUserId) return null;

  const cu = await currentUser();
  const email = cu?.emailAddresses?.[0]?.emailAddress?.trim() ?? "";
  if (!email) return null;

  const name = buildName(cu?.firstName, cu?.lastName);
  const imageUrl = cu?.imageUrl ?? "";

  // Webhook OR first-login upsert
  await ensureUserFromClerk({
    clerkUserId,
    email,
    name,
    imageUrl,
  });

  const dbUser = await getUserByClerkId(clerkUserId);
  if (!dbUser?._id) return null;

  return {
    clerkUserId,
    email,
    name,
    imageUrl,
    dbUser: dbUser as UserDoc & { _id: mongoose.Types.ObjectId },
  };
}

export async function getCurrentAuthUserOrThrow(): Promise<CurrentAuthUser> {
  const user = await getCurrentAuthUserOrNull();
  if (!user) {
    // ✅ Keep auth utility pure: throw and let guards/pages decide redirects
    throw new Error("UNAUTHENTICATED");
  }
  return user;
}
