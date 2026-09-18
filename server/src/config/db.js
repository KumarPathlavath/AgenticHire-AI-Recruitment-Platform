import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import { env } from "./env.js";

let mongod = null;

export async function connectDB() {
  try {
    // Attempt connecting to the configured URI first with a 3 second timeout
    await mongoose.connect(env.MONGODB_URI, {
      serverSelectionTimeoutMS: 3000,
    });
    console.log(`[DB] Connected to MongoDB at: ${env.MONGODB_URI}`);
  } catch (err) {
    console.warn(`[DB] Could not connect to external MongoDB (${err.message}). Starting in-memory MongoDB Server...`);
    try {
      mongod = await MongoMemoryServer.create();
      const uri = mongod.getUri();
      await mongoose.connect(uri);
      console.log(`[DB] Connected to MongoMemoryServer at: ${uri}`);
    } catch (memErr) {
      console.error("[DB] Failed to initialize in-memory MongoDB:", memErr);
      throw memErr;
    }
  }
}

export async function disconnectDB() {
  await mongoose.disconnect();
  if (mongod) {
    await mongod.stop();
  }
}
