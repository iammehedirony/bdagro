import { Queue } from "bullmq";
import { redisConnection } from "../config/redis";

export const PROFIT_DISTRIBUTION_QUEUE_NAME = "profit-distribution-checks";
const SCHEDULER_ID = "check-profit-distributions";

export const profitDistributionQueue = new Queue(PROFIT_DISTRIBUTION_QUEUE_NAME, { connection: redisConnection });

/**
 * Schedules the recurring profit distribution check (due-soon reminders +
 * overdue marking) via BullMQ's Job Scheduler API (the `{ repeat }`
 * option on `.add()` was removed in BullMQ v6). `upsertJobScheduler` is
 * idempotent by `SCHEDULER_ID` — safe to call on every server boot.
 */
export async function scheduleProfitDistributionChecks(): Promise<void> {
  await profitDistributionQueue.upsertJobScheduler(
    SCHEDULER_ID,
    { pattern: "0 6 * * *" }, // every day at 06:00 server time
    { name: SCHEDULER_ID, data: {} }
  );
}
