// server/models/Tenant.ts

import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";

export type TenantStatus = "active" | "suspended";

const tenantSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, index: true, trim: true },

    status: {
      type: String,
      enum: ["active", "suspended"],
      default: "active",
      index: true,
    },

    createdByUserId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    // Optional future: subdomain resolution, branding
    metadata: {
      type: Schema.Types.Mixed,
      default: {},
    },
  },
  { timestamps: true }
);

// Tenant list queries usually filter by status + createdAt
tenantSchema.index({ status: 1, createdAt: -1 });

tenantSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: (_doc, ret: Record<string, unknown>) => {
    delete ret._id;
  },
});

export type TenantDoc = InferSchemaType<typeof tenantSchema> & {
  _id: mongoose.Types.ObjectId;
};

export type TenantModel = Model<TenantDoc>;

export const Tenant =
  (mongoose.models.Tenant as TenantModel | undefined) ||
  mongoose.model<TenantDoc>("Tenant", tenantSchema);
