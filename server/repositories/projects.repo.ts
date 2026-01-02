// server/repositories/projects.repo.ts

import { connectToDatabase } from "@/server/db";
import { Project, type ProjectDoc, type ProjectStatus } from "@/server/models/Project";
import type mongoose from "mongoose";

export type CreateProjectInput = {
  tenantId: mongoose.Types.ObjectId;
  title: string;
  description?: string;
  createdByUserId: mongoose.Types.ObjectId;
};

export type UpdateProjectInput = {
  tenantId: mongoose.Types.ObjectId;
  projectId: mongoose.Types.ObjectId;
  title?: string;
  description?: string;
  status?: ProjectStatus;
  updatedByUserId: mongoose.Types.ObjectId;
};

export async function createProject(input: CreateProjectInput): Promise<ProjectDoc> {
  await connectToDatabase();
  const doc = await Project.create({
    tenantId: input.tenantId,
    title: input.title,
    description: input.description ?? "",
    createdByUserId: input.createdByUserId,
  });
  return doc;
}

export async function findProjectByIdScoped(
  tenantId: mongoose.Types.ObjectId,
  projectId: mongoose.Types.ObjectId
): Promise<ProjectDoc | null> {
  await connectToDatabase();
  return Project.findOne({ _id: projectId, tenantId, deletedAt: null }).exec();
}

export async function listProjectsScoped(
  tenantId: mongoose.Types.ObjectId,
  options?: { status?: ProjectStatus; search?: string; limit?: number; offset?: number }
): Promise<ProjectDoc[]> {
  await connectToDatabase();

  const limit = Math.min(Math.max(options?.limit ?? 12, 1), 100);
  const offset = Math.max(options?.offset ?? 0, 0);

  const query: Record<string, unknown> = { tenantId, deletedAt: null };

  if (options?.status) query.status = options.status;

  if (options?.search?.trim()) {
    const s = options.search.trim();
    query.$or = [
      { title: { $regex: s, $options: "i" } },
      { description: { $regex: s, $options: "i" } },
    ];
  }

  return Project.find(query)
    .sort({ createdAt: -1 })
    .skip(offset)
    .limit(limit)
    .exec();
}

export async function updateProjectScoped(
  input: UpdateProjectInput
): Promise<ProjectDoc | null> {
  await connectToDatabase();

  const $set: Record<string, unknown> = {
    updatedByUserId: input.updatedByUserId,
  };

  if (typeof input.title === "string") $set.title = input.title;
  if (typeof input.description === "string") $set.description = input.description;
  if (input.status) $set.status = input.status;

  return Project.findOneAndUpdate(
    { _id: input.projectId, tenantId: input.tenantId, deletedAt: null },
    { $set },
    { new: true }
  ).exec();
}

export async function softDeleteProjectScoped(
  tenantId: mongoose.Types.ObjectId,
  projectId: mongoose.Types.ObjectId,
  updatedByUserId: mongoose.Types.ObjectId
): Promise<ProjectDoc | null> {
  await connectToDatabase();
  return Project.findOneAndUpdate(
    { _id: projectId, tenantId, deletedAt: null },
    { $set: { deletedAt: new Date(), updatedByUserId } },
    { new: true }
  ).exec();
}
