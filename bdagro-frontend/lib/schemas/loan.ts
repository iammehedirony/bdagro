import { z } from "zod";

export const loanApplicationSchema = z.object({
  loanProduct: z.string().min(1, "ফান্ডিং প্রোডাক্ট নির্বাচন করুন"),
  requestedAmount: z.coerce.number().positive("ফান্ডিংয়ের পরিমাণ দিন"),
  durationMonths: z.coerce.number().int().positive("মেয়াদ নির্বাচন করুন"),
  projectTitle: z.string().trim().min(3, "প্রকল্পের নাম কমপক্ষে ৩ অক্ষরের হতে হবে"),
  projectDescription: z.string().trim().min(10, "উদ্দেশ্য কমপক্ষে ১০ অক্ষরের হতে হবে"),
  cropType: z.string().trim().optional(),
  landDeed: z.custom<File>((file) => typeof File !== "undefined" && file instanceof File, "জমির দলিল বা লিজ কাগজ সংযুক্ত করুন").nullable(),
  incomeProof: z.custom<File>((file) => typeof File !== "undefined" && file instanceof File).nullable(),
  terms: z.literal(true, {
    errorMap: () => ({ message: "আবেদন জমা দিতে শর্তাবলীতে সম্মত হতে হবে" }),
  }),
});

export type LoanApplicationFormValues = z.infer<typeof loanApplicationSchema>;