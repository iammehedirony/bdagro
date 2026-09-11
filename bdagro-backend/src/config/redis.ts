import IORedis from "ioredis";

/**
 * Shared connection used by every BullMQ Queue/Worker. BullMQ requires
 * `maxRetriesPerRequest: null` on the ioredis client — otherwise BullMQ's
 * internal blocking commands can throw instead of retrying indefinitely.
 */
export const redisConnection = new IORedis({
  host: process.env.REDIS_HOST || "127.0.0.1",
  port: Number(process.env.REDIS_PORT || 6379),
  password: process.env.REDIS_PASSWORD || undefined,
  maxRetriesPerRequest: null,
});

redisConnection.on("error", (err: Error) => {
  console.error("[Redis] Connection error:", err.message);
});
