import { scheduleInstallmentChecks, installmentQueue } from "./installment.queue";
import { createInstallmentWorker } from "./installment.worker";

let started = false;

/**
 * Boots all BullMQ repeatable schedules + workers. Idempotent — safe to
 * call once at server startup; guards against double-starting the worker
 * if this were ever invoked twice (e.g. in tests).
 */
export async function startBackgroundJobs(): Promise<void> {
  await scheduleInstallmentChecks();

  if (!started) {
    createInstallmentWorker();
    started = true;
  }

  console.log("[Jobs] Installment check job scheduled and worker started.");
}

export { installmentQueue };
