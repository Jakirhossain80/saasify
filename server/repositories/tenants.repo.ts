// server/repositories/tenants.repo.ts

import { connectToDatabase } from "@/server/db";
import { Tenant, type TenantDoc } from "@/server/models/Tenant";
import type mongoose from "mongoose";

export type CreateTenantInput = {
  name: string;
  slug: string;
  createdByUserId: mongoose.Types.ObjectId;
};

export async function createTenant(input: CreateTenantInput): Promise<TenantDoc> {
  await connectToDatabase();
  const doc = await Tenant.create({
    name: input.name,
    slug: input.slug,
    createdByUserId: input.createdByUserId,
  });
  return doc;
}

export async function findTenantById(
  tenantId: mongoose.Types.ObjectId
): Promise<TenantDoc | null> {
  await connectToDatabase();
  return Tenant.findById(tenantId).exec();
}

export async function findTenantBySlug(slug: string): Promise<TenantDoc | null> {
  await connectToDatabase();
  return Tenant.findOne({ slug }).exec();
}

export async function listTenantsByCreator(
  createdByUserId: mongoose.Types.ObjectId
): Promise<TenantDoc[]> {
  await connectToDatabase();
  return Tenant.find({ createdByUserId }).sort({ createdAt: -1 }).exec();
}

export async function updateTenantStatus(
  tenantId: mongoose.Types.ObjectId,
  status: "active" | "suspended"
): Promise<TenantDoc | null> {
  await connectToDatabase();
  return Tenant.findByIdAndUpdate(tenantId, { $set: { status } }, { new: true }).exec();
}
