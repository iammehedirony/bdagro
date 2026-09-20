import { Resend } from "resend";

let resendInstance: Resend | null = null;

export function getResend(): Resend {
  if (!resendInstance) {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      throw new Error("RESEND_API_KEY environment variable is not set. Please configure it to send emails.");
    }
    resendInstance = new Resend(apiKey);
  }
  return resendInstance;
}

export const EMAIL_FROM = process.env.EMAIL_FROM || "onboarding@resend.dev";