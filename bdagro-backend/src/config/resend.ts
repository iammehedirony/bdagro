import { Resend } from "resend";
import dotenv from 'dotenv';

dotenv.config(); // ২. এটি রান হওয়ার আগেই resend.ts কল হয়ে গেছে!

export const resend = new Resend(process.env.RESEND_API_KEY);

export const EMAIL_FROM = process.env.EMAIL_FROM || "Bdagro <noreply@bdagro.com>";