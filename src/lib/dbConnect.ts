import mongoose from "mongoose";

const MONGO_URI = process.env.MONGO_URI as string;

if (!MONGO_URI) {
  throw new Error("❌ MONGO_URI not defined in environment variables");
}

type MongooseCache = {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
};

let cached = (global as any).mongoose as MongooseCache;

if (!cached) {
  cached = (global as any).mongoose = {
    conn: null,
    promise: null,
  };
}

async function dbConnect(): Promise<typeof mongoose> {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    mongoose.set("bufferCommands", false);

    cached.promise = mongoose.connect(MONGO_URI, {
      dbName: "mystrymessage",
    });
  }

  cached.conn = await cached.promise;
  console.log("DB Connected Successfully");

  return cached.conn;
}

export default dbConnect;