import { Worker, Job } from "bullmq";
import { redisConnection } from "../config/redis";
import { resend, EMAIL_FROM } from "../config/resend";
import { EMAIL_QUEUE_NAME } from "./email.queue";
import {
  welcomeEmail,
  loanApprovalEmail,
  investmentConfirmationEmail,
  farmerNewInvestmentEmail,
  payoutEmail,
} from "../emails/templates";

async function processEmailJob(job: Job): Promise<{ success: boolean; messageId?: string; error?: string }> {
  const { type, data } = job.data as { type: string; data: any };

  try {
    let html: string;
    let subject: string;
    let to: string;

    switch (type) {
      case "welcome": {
        html = welcomeEmail(data);
        subject = "Bdagro-এ স্বাগতম! আপনার অ্যাকাউন্ট তৈরি হয়েছে";
        to = data.userEmail;
        break;
      }
      case "loan-approval": {
        html = loanApprovalEmail(data);
        subject = `লোন অনুমোদিত: ${data.projectTitle}`;
        to = data.farmerEmail;
        break;
      }
      case "investment-confirmation": {
        html = investmentConfirmationEmail(data);
        subject = `বিনিয়োগ সফল: ${data.projectTitle}`;
        to = data.investorEmail;
        break;
      }
      case "farmer-new-investment": {
        html = farmerNewInvestmentEmail(data);
        subject = `নতুন বিনিয়োগ: ${data.projectTitle}`;
        to = data.farmerEmail;
        break;
      }
      case "payout": {
        html = payoutEmail(data);
        subject = `রিটার্ন পেয়েছেন: ${data.projectTitle}`;
        to = data.investorEmail;
        break;
      }
      default:
        throw new Error(`Unknown email job type: ${type}`);
    }

    const result = await resend.emails.send({
      from: EMAIL_FROM,
      to,
      subject,
      html,
    });

    if (result.error) {
      throw new Error(`Resend error: ${result.error.message}`);
    }

    console.log(`[EmailWorker] Sent ${type} email to ${to}, messageId: ${result.data?.id}`);
    return { success: true, messageId: result.data?.id };
  } catch (error: any) {
    console.error(`[EmailWorker] Failed to send ${type} email:`, error.message);
    return { success: false, error: error.message };
  }
}

/** Creates (and starts listening on) the email notifications worker. */
export function createEmailWorker(): Worker {
  const worker = new Worker(
    EMAIL_QUEUE_NAME,
    async (job: Job) => {
      return processEmailJob(job);
    },
    { 
      connection: redisConnection,
      concurrency: 5,
    }
  );

  worker.on("completed", (job) => {
    console.log(`[EmailWorker] Job ${job.id} completed`);
  });

  worker.on("failed", (job, err) => {
    console.error(`[EmailWorker] Job ${job?.id} failed:`, err.message);
  });

  return worker;
}