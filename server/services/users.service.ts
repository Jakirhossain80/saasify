// server/services/users.service.ts

import type mongoose from "mongoose";
import {
  findUserByClerkId,
  findUserById,
  upsertUserByClerkId,
  type UpsertUserInput,
} from "@/server/repositories/users.repo";
import type { UserDoc } from "@/server/models/User";

export async function ensureUserFromClerk(input: UpsertUserInput): Promise<UserDoc> {
  return upsertUserByClerkId(input);
}

export async function getUserByClerkId(clerkUserId: string): Promise<UserDoc | null> {
  return findUserByClerkId(clerkUserId);
}

export async function getUserById(userId: mongoose.Types.ObjectId): Promise<UserDoc | null> {
  return findUserById(userId);
}
