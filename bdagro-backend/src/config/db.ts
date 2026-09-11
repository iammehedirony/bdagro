import mongoose from "mongoose";

/**
 * Connects to MongoDB using Mongoose.
 * Retries are handled by mongoose's built-in reconnection behavior.
 */
export async function connectDB(): Promise<void> {
  try {
    const uri = process.env.MONGODB_URI;
    if (!uri) {
      throw new Error("MONGODB_URI is not defined in environment variables");
    }

    mongoose.set("strictQuery", true);

    const conn = await mongoose.connect(uri);

    console.log(`[MongoDB] Connected: ${conn.connection.host}/${conn.connection.name}`);

    mongoose.connection.on("error", (err: Error) => {
      console.error("[MongoDB] Connection error:", err.message);
    });

    mongoose.connection.on("disconnected", () => {
      console.warn("[MongoDB] Disconnected. Reconnection is handled by the driver.");
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(`[MongoDB] Failed to connect: ${message}`);
    process.exit(1);
  }
}
