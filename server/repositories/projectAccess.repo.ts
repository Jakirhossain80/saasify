// FILE: server/repositories/projectAccess.repo.ts
import type mongoose from "mongoose";
import { connectToDatabase } from "@/server/db";
import { ProjectMembership, type ProjectMembershipDoc, type ProjectAccessRole } from "@/server/models/ProjectMembership";

export async function upsertProjectMember(input: {
  tenantId: mongoose.Types.ObjectId;
  projectId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  role: ProjectAccessRole;
}): Promise<ProjectMembershipDoc> {
  await connectToDatabase();

  const doc = await ProjectMembership.findOneAndUpdate(
    { tenantId: input.tenantId, projectId: input.projectId, userId: input.userId },
    { $set: { role: input.role, status: "active" } },
    { upsert: true, new: true }
  ).exec();

  // With upsert+new, doc should exist; keep safe fallback.
  if (!doc) {
    throw new Error("PROJECT_MEMBER_UPSERT_FAILED");
  }

  return doc;
}

export async function removeProjectMember(input: {
  tenantId: mongoose.Types.ObjectId;
  projectId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
}): Promise<ProjectMembershipDoc | null> {
  await connectToDatabase();

  return ProjectMembership.findOneAndUpdate(
    { tenantId: input.tenantId, projectId: input.projectId, userId: input.userId },
    { $set: { status: "removed" } },
    { new: true }
  ).exec();
}

export async function listProjectMembers(input: {
  tenantId: mongoose.Types.ObjectId;
  projectId: mongoose.Types.ObjectId;
}): Promise<ProjectMembershipDoc[]> {
  await connectToDatabase();
  return ProjectMembership.find({ tenantId: input.tenantId, projectId: input.projectId, status: "active" })
    .sort({ createdAt: -1 })
    .exec();
}
