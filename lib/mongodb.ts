import mongoose from "mongoose";

type Cache = { conn: typeof mongoose | null; promise: Promise<typeof mongoose> | null };

const globalForMongo = globalThis as unknown as { muktidakMongo?: Cache };
const cached: Cache = globalForMongo.muktidakMongo ?? (globalForMongo.muktidakMongo = { conn: null, promise: null });

async function connectToDatabase() {
  if (cached.conn) return cached.conn;
  if (!cached.promise) {
    const uri = process.env.MONGODB_URI;
    if (!uri) throw new Error("MONGODB_URI is not set in .env");
    cached.promise = mongoose
      .connect(uri, { bufferCommands: false, dbName: process.env.MONGODB_DB || "muktidak" })
      .catch((error) => {
        cached.promise = null;
        throw error;
      });
  }
  cached.conn = await cached.promise;
  return cached.conn;
}

export default connectToDatabase;
