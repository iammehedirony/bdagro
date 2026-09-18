import { scheduleProfitDistributionChecks, profitDistributionQueue } from "./profitDistribution.queue";
import { createProfitDistributionWorker } from "./profitDistribution.worker";

let started = false;

/**
 * Boots all BullMQ repeatable schedules + workers. Idempotent — safe to
 * call once at server startup; guards against double-starting the worker
 * if this were ever invoked twice (e.g. in tests).
 */
export async function startBackgroundJobs(): Promise<void> {
  await scheduleProfitDistributionChecks();

  if (!started) {
    createProfitDistributionWorker();
    started = true;
  }

  console.log("[Jobs] Profit distribution check job scheduled and worker started.");
}

export { profitDistributionQueue };
