import { Worker, Job } from "bullmq";
import { redisConnection } from "../config/redis";
import { Installment } from "../models/Installment";
import { InstallmentStatus } from "../utils/constants";
import { notifyUser } from "../services/notification.service";
import { INSTALLMENT_QUEUE_NAME } from "./installment.queue";

const REMINDER_WINDOW_DAYS = 3;

interface CheckResult {
  markedOverdue: number;
  remindersSent: number;
}

async function processInstallmentChecks(): Promise<CheckResult> {
  const now = new Date();

  // 1) Flip anything past its due date from DUE -> OVERDUE, notify once.
  const overdueInstallments = await Installment.find({
    status: InstallmentStatus.DUE,
    dueDate: { $lt: now },
  });

  for (const installment of overdueInstallments) {
    installment.status = InstallmentStatus.OVERDUE;
    await installment.save();
    await notifyUser(installment.farmer, {
      title: "Installment overdue",
      message: `Installment #${installment.installmentNumber} (amount ${installment.amount}) is now overdue.`,
      type: "installment_overdue",
      meta: { installmentId: installment._id },
    });
  }

  // 2) Remind farmers whose installment is due within the next few days.
  // NOTE: this re-notifies once per day the job runs while the installment
  // stays DUE and within the window — fine for now, but a production
  // hardening pass should add a `lastReminderAt` field on Installment to
  // dedupe (e.g. only remind once per 24h).
  const reminderWindowEnd = new Date(now.getTime() + REMINDER_WINDOW_DAYS * 24 * 60 * 60 * 1000);
  const upcomingInstallments = await Installment.find({
    status: InstallmentStatus.DUE,
    dueDate: { $gte: now, $lte: reminderWindowEnd },
  });

  for (const installment of upcomingInstallments) {
    await notifyUser(installment.farmer, {
      title: "Installment due soon",
      message: `Installment #${installment.installmentNumber} (amount ${installment.amount}) is due on ${installment.dueDate.toDateString()}.`,
      type: "installment_reminder",
      meta: { installmentId: installment._id },
    });
  }

  return { markedOverdue: overdueInstallments.length, remindersSent: upcomingInstallments.length };
}

/** Creates (and starts listening on) the installment-checks worker. */
export function createInstallmentWorker(): Worker {
  const worker = new Worker(
    INSTALLMENT_QUEUE_NAME,
    async (_job: Job) => {
      const result = await processInstallmentChecks();
      console.log(
        `[InstallmentWorker] Marked ${result.markedOverdue} overdue, sent ${result.remindersSent} reminder(s).`
      );
      return result;
    },
    { connection: redisConnection }
  );

  worker.on("failed", (job, err) => {
    console.error(`[InstallmentWorker] Job ${job?.id} failed:`, err.message);
  });

  return worker;
}
