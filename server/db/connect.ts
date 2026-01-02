// server/db/connect.ts

import mongoose from "mongoose";

type MongooseCache = {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
};

declare global {
  // eslint-disable-next-line no-var
  var __mongooseCache: MongooseCache | undefined;
}

const globalCache: MongooseCache = globalThis.__mongooseCache ?? {
  conn: null,
  promise: null,
};

globalThis.__mongooseCache = globalCache;

function getMongoUri(): string {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error("Missing MONGODB_URI environment variable.");
  }
  return uri;
}

export async function connectToDatabase(): Promise<typeof mongoose> {
  if (globalCache.conn) return globalCache.conn;

  if (!globalCache.promise) {
    const uri = getMongoUri();

    mongoose.set("strictQuery", true);

    globalCache.promise = mongoose
      .connect(uri, {
        autoIndex: process.env.NODE_ENV !== "production",
        serverSelectionTimeoutMS: 10_000,
      })
      .then((m) => m);
  }

  globalCache.conn = await globalCache.promise;
  return globalCache.conn;
}
