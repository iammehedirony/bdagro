import { Queue } from "bullmq";
import { redisConnection } from "../config/redis";

export const INSTALLMENT_QUEUE_NAME = "installment-checks";
const SCHEDULER_ID = "check-installments";

export const installmentQueue = new Queue(INSTALLMENT_QUEUE_NAME, { connection: redisConnection });

/**
 * Schedules the recurring installment check (due-soon reminders +
 * overdue marking) via BullMQ's Job Scheduler API (the `{ repeat }`
 * option on `.add()` was removed in BullMQ v6). `upsertJobScheduler` is
 * idempotent by `SCHEDULER_ID` — safe to call on every server boot.
 */
export async function scheduleInstallmentChecks(): Promise<void> {
  await installmentQueue.upsertJobScheduler(
    SCHEDULER_ID,
    { pattern: "0 6 * * *" }, // every day at 06:00 server time
    { name: SCHEDULER_ID, data: {} }
  );
}
