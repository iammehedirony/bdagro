import { Worker, Job } from "bullmq";
import { redisConnection } from "../config/redis";
import { ProfitDistribution } from "../models/ProfitDistribution";
import { NotificationType, ProfitDistributionStatus } from "../utils/constants";
import { notifyUser } from "../services/notification.service";
import { PROFIT_DISTRIBUTION_QUEUE_NAME } from "./profitDistribution.queue";

const REMINDER_WINDOW_DAYS = 3;

interface CheckResult {
  markedOverdue: number;
  remindersSent: number;
}

async function processProfitDistributionChecks(): Promise<CheckResult> {
  const now = new Date();

  // 1) Flip anything past its due date from PENDING -> OVERDUE, notify once.
  const overdueDistributions = await ProfitDistribution.find({
    status: ProfitDistributionStatus.PENDING,
    dueDate: { $lt: now },
  });

  for (const distribution of overdueDistributions) {
    distribution.status = ProfitDistributionStatus.OVERDUE;
    await distribution.save();
    await notifyUser(distribution.farmer, {
      title: "Profit distribution overdue",
      message: `Profit distribution #${distribution.distributionNumber} (amount ${distribution.amount}) is now overdue.`,
      type: NotificationType.PROFIT_DISTRIBUTION,
      meta: { profitDistributionId: distribution._id },
    });
  }

  // 2) Remind farmers whose profit distribution is due within the next few days.
  // NOTE: this re-notifies once per day the job runs while the distribution
  // stays DUE and within the window — fine for now, but a production
  // hardening pass should add a `lastReminderAt` field on ProfitDistribution to
  // dedupe (e.g. only remind once per 24h).
  const reminderWindowEnd = new Date(now.getTime() + REMINDER_WINDOW_DAYS * 24 * 60 * 60 * 1000);
  const upcomingDistributions = await ProfitDistribution.find({
    status: ProfitDistributionStatus.PENDING,
    dueDate: { $gte: now, $lte: reminderWindowEnd },
  });

  for (const distribution of upcomingDistributions) {
    await notifyUser(distribution.farmer, {
      title: "Profit distribution due soon",
      message: `Profit distribution #${distribution.distributionNumber} (amount ${distribution.amount}) is due on ${distribution.dueDate.toDateString()}.`,
      type: NotificationType.PROFIT_DISTRIBUTION,
      meta: { profitDistributionId: distribution._id },
    });
  }

  return { markedOverdue: overdueDistributions.length, remindersSent: upcomingDistributions.length };
}

/** Creates (and starts listening on) the profit-distribution-checks worker. */
export function createProfitDistributionWorker(): Worker {
  const worker = new Worker(
    PROFIT_DISTRIBUTION_QUEUE_NAME,
    async (_job: Job) => {
      const result = await processProfitDistributionChecks();
      console.log(
        `[ProfitDistributionWorker] Marked ${result.markedOverdue} overdue, sent ${result.remindersSent} reminder(s).`
      );
      return result;
    },
    { connection: redisConnection }
  );

  worker.on("failed", (job, err) => {
    console.error(`[ProfitDistributionWorker] Job ${job?.id} failed:`, err.message);
  });

  return worker;
}
