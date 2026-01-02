// server/services/memberships.service.ts

import type mongoose from "mongoose";
import type { MembershipDoc, TenantRole } from "@/server/models/Membership";
import {
  createMembership,
  findMembership,
  listMembershipsForTenant,
  listMembershipsForUser,
  removeMembership,
  updateMembershipRole,
  type CreateMembershipInput,
} from "@/server/repositories/memberships.repo";

export async function addMemberToTenant(input: CreateMembershipInput): Promise<MembershipDoc> {
  return createMembership(input);
}

export async function getMembership(
  tenantId: mongoose.Types.ObjectId,
  userId: mongoose.Types.ObjectId
): Promise<MembershipDoc | null> {
  return findMembership(tenantId, userId);
}

export async function getTenantMembers(
  tenantId: mongoose.Types.ObjectId
): Promise<MembershipDoc[]> {
  return listMembershipsForTenant(tenantId);
}

export async function getUserMemberships(
  userId: mongoose.Types.ObjectId
): Promise<MembershipDoc[]> {
  return listMembershipsForUser(userId);
}

export async function changeMemberRole(
  tenantId: mongoose.Types.ObjectId,
  userId: mongoose.Types.ObjectId,
  role: TenantRole
): Promise<MembershipDoc | null> {
  return updateMembershipRole(tenantId, userId, role);
}

export async function removeMember(
  tenantId: mongoose.Types.ObjectId,
  userId: mongoose.Types.ObjectId
): Promise<MembershipDoc | null> {
  return removeMembership(tenantId, userId);
}
