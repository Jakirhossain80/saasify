// server/repositories/users.repo.ts

import { connectToDatabase } from "@/server/db";
import { User, type UserDoc } from "@/server/models/User";
import type mongoose from "mongoose";

export type UpsertUserInput = {
  clerkUserId: string;
  email: string;
  name?: string;
  imageUrl?: string;
  platformRole?: "platform_admin" | "user";
};

export async function upsertUserByClerkId(
  input: UpsertUserInput
): Promise<UserDoc> {
  await connectToDatabase();

  const update: Partial<UpsertUserInput> & { lastSignedInAt: Date } = {
    email: input.email,
    name: input.name ?? "",
    imageUrl: input.imageUrl ?? "",
    lastSignedInAt: new Date(),
  };

  if (input.platformRole) update.platformRole = input.platformRole;

  const doc = await User.findOneAndUpdate(
    { clerkUserId: input.clerkUserId },
    { $set: update, $setOnInsert: { clerkUserId: input.clerkUserId } },
    { new: true, upsert: true }
  ).exec();

  return doc;
}

export async function findUserByClerkId(
  clerkUserId: string
): Promise<UserDoc | null> {
  await connectToDatabase();
  return User.findOne({ clerkUserId }).exec();
}

export async function findUserById(
  userId: mongoose.Types.ObjectId
): Promise<UserDoc | null> {
  await connectToDatabase();
  return User.findById(userId).exec();
}
