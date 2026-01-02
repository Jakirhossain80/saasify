// server/models/Membership.ts

import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";

export type TenantRole = "tenant_admin" | "tenant_user";
export type MembershipStatus = "active" | "invited" | "removed";

const membershipSchema = new Schema(
  {
    tenantId: {
      type: Schema.Types.ObjectId,
      ref: "Tenant",
      required: true,
      index: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    role: {
      type: String,
      enum: ["tenant_admin", "tenant_user"],
      required: true,
      index: true,
    },

    status: {
      type: String,
      enum: ["active", "invited", "removed"],
      default: "active",
      index: true,
    },
  },
  { timestamps: true }
);

// Prevent duplicates: same user cannot have multiple memberships for same tenant
membershipSchema.index({ tenantId: 1, userId: 1 }, { unique: true });

// Tenant admin listing / member listing patterns
membershipSchema.index({ tenantId: 1, status: 1, createdAt: -1 });
membershipSchema.index({ userId: 1, status: 1, createdAt: -1 });

membershipSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: (_doc, ret: Record<string, unknown>) => {
    delete ret._id;
  },
});

export type MembershipDoc = InferSchemaType<typeof membershipSchema> & {
  _id: mongoose.Types.ObjectId;
};

export type MembershipModel = Model<MembershipDoc>;

export const Membership =
  (mongoose.models.Membership as MembershipModel | undefined) ||
  mongoose.model<MembershipDoc>("Membership", membershipSchema);
