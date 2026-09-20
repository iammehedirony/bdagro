import IORedis from "ioredis";

/**
 * Shared connection used by every BullMQ Queue/Worker. BullMQ requires
 * `maxRetriesPerRequest: null` on the ioredis client — otherwise BullMQ's
 * internal blocking commands can throw instead of retrying indefinitely.
 */
export const redisConnection = new IORedis(
  process.env.REDIS_URL || "redis://127.0.0.1:6379",
  {
    maxRetriesPerRequest: null,
  }
);

redisConnection.on("error", (err: Error) => {
  console.error("[Redis] Connection error:", err.message);
});