// FILE: server/repositories/memberships.repo.ts
import { connectToDatabase } from "@/server/db";
import {
  Membership,
  type MembershipDoc,
  type TenantRole,
  type MembershipStatus,
} from "@/server/models/Membership";
import type mongoose from "mongoose";

export type CreateMembershipInput = {
  tenantId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  role: TenantRole;
  status?: MembershipStatus;
};

export async function createMembership(
  input: CreateMembershipInput
): Promise<MembershipDoc> {
  await connectToDatabase();
  const doc = await Membership.create({
    tenantId: input.tenantId,
    userId: input.userId,
    role: input.role,
    status: input.status ?? "active",
  });
  return doc;
}

export async function findMembership(
  tenantId: mongoose.Types.ObjectId,
  userId: mongoose.Types.ObjectId
): Promise<MembershipDoc | null> {
  await connectToDatabase();
  return Membership.findOne({
    tenantId,
    userId,
    status: { $ne: "removed" },
  }).exec();
}

export async function listMembershipsForTenant(
  tenantId: mongoose.Types.ObjectId
): Promise<MembershipDoc[]> {
  await connectToDatabase();
  return Membership.find({
    tenantId,
    status: { $ne: "removed" },
  })
    .sort({ createdAt: -1 })
    .exec();
}

export async function listMembershipsForUser(
  userId: mongoose.Types.ObjectId
): Promise<MembershipDoc[]> {
  await connectToDatabase();
  return Membership.find({
    userId,
    status: { $ne: "removed" },
  })
    .sort({ createdAt: -1 })
    .exec();
}

export async function updateMembershipRole(
  tenantId: mongoose.Types.ObjectId,
  userId: mongoose.Types.ObjectId,
  role: TenantRole
): Promise<MembershipDoc | null> {
  await connectToDatabase();
  return Membership.findOneAndUpdate(
    { tenantId, userId, status: { $ne: "removed" } },
    { $set: { role } },
    { new: true }
  ).exec();
}

export async function removeMembership(
  tenantId: mongoose.Types.ObjectId,
  userId: mongoose.Types.ObjectId
): Promise<MembershipDoc | null> {
  await connectToDatabase();
  return Membership.findOneAndUpdate(
    { tenantId, userId },
    { $set: { status: "removed" } },
    { new: true }
  ).exec();
}
