// server/models/User.ts

import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";

export type UserRolePlatform = "platform_admin" | "user";

const userSchema = new Schema(
  {
    clerkUserId: {
      type: String,
      required: true,
      unique: true,
      index: true,
      trim: true,
    },
    email: { type: String, required: true, index: true, trim: true },
    name: { type: String, trim: true, default: "" },
    imageUrl: { type: String, trim: true, default: "" },

    platformRole: {
      type: String,
      enum: ["platform_admin", "user"],
      default: "user",
      index: true,
    },

    lastSignedInAt: { type: Date, default: null },
  },
  { timestamps: true }
);

userSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: (_doc, ret: Record<string, unknown>) => {
    delete ret._id;
  },
});

export type UserDoc = InferSchemaType<typeof userSchema> & {
  _id: mongoose.Types.ObjectId;
};

export type UserModel = Model<UserDoc>;

export const User =
  (mongoose.models.User as UserModel | undefined) ||
  mongoose.model<UserDoc>("User", userSchema);
