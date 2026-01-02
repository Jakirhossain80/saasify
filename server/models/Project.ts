// server/models/Project.ts

import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";

export type ProjectStatus = "active" | "archived";

const projectSchema = new Schema(
  {
    tenantId: {
      type: Schema.Types.ObjectId,
      ref: "Tenant",
      required: true,
      index: true,
    },

    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true, default: "" },

    status: {
      type: String,
      enum: ["active", "archived"],
      default: "active",
      index: true,
    },

    // Soft-delete toggle (optional later). Keep field now for forward-compat.
    deletedAt: { type: Date, default: null, index: true },

    createdByUserId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    updatedByUserId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
      index: true,
    },
  },
  { timestamps: true }
);

// “tenantId scoping impossible to forget” queries
projectSchema.index({ tenantId: 1, createdAt: -1 });
projectSchema.index({ tenantId: 1, status: 1, createdAt: -1 });
projectSchema.index({ tenantId: 1, status: 1, title: 1 });

projectSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: (_doc, ret: Record<string, unknown>) => {
    delete ret._id;
  },
});

export type ProjectDoc = InferSchemaType<typeof projectSchema> & {
  _id: mongoose.Types.ObjectId;
};

export type ProjectModel = Model<ProjectDoc>;

export const Project =
  (mongoose.models.Project as ProjectModel | undefined) ||
  mongoose.model<ProjectDoc>("Project", projectSchema);
