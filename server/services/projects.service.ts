// server/services/projects.service.ts

import type mongoose from "mongoose";
import type { ProjectDoc, ProjectStatus } from "@/server/models/Project";
import {
  createProject,
  findProjectByIdScoped,
  listProjectsScoped,
  softDeleteProjectScoped,
  updateProjectScoped,
  type CreateProjectInput,
} from "@/server/repositories/projects.repo";

export async function createTenantProject(input: CreateProjectInput): Promise<ProjectDoc> {
  return createProject(input);
}

export async function getProjectScoped(
  tenantId: mongoose.Types.ObjectId,
  projectId: mongoose.Types.ObjectId
): Promise<ProjectDoc | null> {
  return findProjectByIdScoped(tenantId, projectId);
}

export async function listTenantProjects(
  tenantId: mongoose.Types.ObjectId,
  opts?: { status?: ProjectStatus; search?: string; limit?: number; offset?: number }
): Promise<ProjectDoc[]> {
  return listProjectsScoped(tenantId, opts);
}

export async function updateTenantProject(
  input: {
    tenantId: mongoose.Types.ObjectId;
    projectId: mongoose.Types.ObjectId;
    title?: string;
    description?: string;
    status?: ProjectStatus;
    updatedByUserId: mongoose.Types.ObjectId;
  }
): Promise<ProjectDoc | null> {
  return updateProjectScoped({
    tenantId: input.tenantId,
    projectId: input.projectId,
    title: input.title,
    description: input.description,
    status: input.status,
    updatedByUserId: input.updatedByUserId,
  });
}

export async function deleteTenantProject(
  tenantId: mongoose.Types.ObjectId,
  projectId: mongoose.Types.ObjectId,
  updatedByUserId: mongoose.Types.ObjectId
): Promise<ProjectDoc | null> {
  return softDeleteProjectScoped(tenantId, projectId, updatedByUserId);
}
