import { z } from "zod";

export const loanApplicationSchema = z.object({
  loanProduct: z.string().min(1, "ফান্ডিং প্রোডাক্ট নির্বাচন করুন"),
  requestedAmount: z.coerce.number().positive("ফান্ডিংয়ের পরিমাণ দিন"),
  durationMonths: z.coerce.number().int().positive("মেয়াদ নির্বাচন করুন"),
  projectTitle: z.string().trim().min(3, "প্রকল্পের নাম কমপক্ষে ৩ অক্ষরের হতে হবে"),
  projectDescription: z.string().trim().min(10, "উদ্দেশ্য কমপক্ষে ১০ অক্ষরের হতে হবে"),
  location: z.string().trim().min(2, "এলাকা কমপক্ষে ২ অক্ষরের হতে হবে"),
  cropType: z.string().trim().optional(),
  landArea: z.coerce.number().positive("জমির পরিমাণ দিন"),
  expectedHarvestDate: z.string().min(1, "ফসল কাটার তারিখ নির্বাচন করুন"),
  farmImage: z.custom<File>((file) => typeof File !== "undefined" && file instanceof File, "খামারের ছবি দিন").nullable().superRefine((file, context) => {
    if (!file) context.addIssue({ code: z.ZodIssueCode.custom, message: "খামারের ছবি দিন" });
  }),
  landDeed: z.custom<File>((file) => typeof File !== "undefined" && file instanceof File, "জমির দলিল বা লিজ কাগজ সংযুক্ত করুন").nullable(),
  incomeProof: z.custom<File>((file) => typeof File !== "undefined" && file instanceof File).nullable(),
  terms: z.literal(true, {
    errorMap: () => ({ message: "আবেদন জমা দিতে শর্তাবলীতে সম্মত হতে হবে" }),
  }),
});

export type LoanApplicationFormValues = z.infer<typeof loanApplicationSchema>;