import { Queue } from "bullmq";
import { redisConnection } from "../config/redis";

export const EMAIL_QUEUE_NAME = "email-notifications";

export const emailQueue = new Queue(EMAIL_QUEUE_NAME, { connection: redisConnection });

export type EmailJobName = 
  | "welcome"
  | "loan-approval"
  | "investment-confirmation"
  | "farmer-new-investment"
  | "payout";

export interface WelcomeEmailJob {
  userId: string;
  userName: string;
  userEmail: string;
  role: "farmer" | "investor";
}

export interface LoanApprovalEmailJob {
  farmerId: string;
  farmerName: string;
  farmerEmail: string;
  projectTitle: string;
  loanAmount: number;
}

export interface InvestmentConfirmationEmailJob {
  investorId: string;
  investorName: string;
  investorEmail: string;
  projectTitle: string;
  amount: number;
  expectedROI: number;
}

export interface FarmerNewInvestmentEmailJob {
  farmerId: string;
  farmerName: string;
  farmerEmail: string;
  projectTitle: string;
  investorName: string;
  amount: number;
}

export interface PayoutEmailJob {
  investorId: string;
  investorName: string;
  investorEmail: string;
  projectTitle: string;
  amount: number;
}

export type EmailJobData = 
  | { type: "welcome"; data: WelcomeEmailJob }
  | { type: "loan-approval"; data: LoanApprovalEmailJob }
  | { type: "investment-confirmation"; data: InvestmentConfirmationEmailJob }
  | { type: "farmer-new-investment"; data: FarmerNewInvestmentEmailJob }
  | { type: "payout"; data: PayoutEmailJob };

/**
 * Adds an email job to the queue
 */
export async function addEmailJob(jobData: EmailJobData): Promise<void> {
  await emailQueue.add(jobData.type, jobData.data, {
    attempts: 3,
    backoff: { type: "exponential", delay: 2000 },
    removeOnComplete: 100,
    removeOnFail: 50,
  });
}