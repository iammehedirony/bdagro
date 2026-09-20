import { z } from "zod";

// ==========================================
// 1. Zod Schema: Account Creation (Step 1)
// ==========================================
export const farmerAccountSchema = z.object({
  name: z.string().min(2, { message: "নাম কমপক্ষে ২ অক্ষরের হতে হবে" }),
  email: z.string().email({ message: "সঠিক ইমেইল ঠিকানা দিন" }),
  phone: z.string().regex(/^[0-9]{10}$/, { message: "সঠিক ১০ ডিজিটের ফোন নম্বর দিন" }),
  otp: z.array(z.string().min(1, { message: "OTP-এর প্রতিটি ঘর পূরণ করতে হবে" })).length(6, {
    message: "৬-ডিজিটের সঠিক OTP দিন",
  }),
  password: z.string().min(8, { message: "পাসওয়ার্ড কমপক্ষে ৮ ক্যারেক্টারের হতে হবে" }),
  terms: z.literal(true, {
    errorMap: () => ({ message: "এগিয়ে যেতে আপনাকে শর্তাবলী ও গোপনীয়তা নীতিতে সম্মত হতে হবে।" }),
  }),
  avatar: z.any().optional(),
});

export type FarmerAccountFormValues = z.infer<typeof farmerAccountSchema>;



// ==========================================
// 2. Zod Schema: NID Verification (Step 2)
// ==========================================
export const farmerNidSchema = z.object({
  nidNumber: z.string().regex(/^(\d{10}|\d{13}|\d{17})$/, {
    message: "সঠিক ১০, ১৩ বা ১৭ ডিজিটের NID নম্বর দিন",
  }),
  nidName: z.string().min(2, { message: "NID অনুযায়ী আপনার সঠিক নাম দিন" }),
  dob: z.string().regex(/^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[012])\/(19|20)\d\d$/, {
    message: "সঠিক জন্ম তারিখ দিন (DD/MM/YYYY)",
  }),
  address: z.object({
    district: z.string().min(2, { message: "জেলা কমপক্ষে ২ অক্ষরের হতে হবে" }),
    upazila: z.string().min(2, { message: "উপজেলা কমপক্ষে ২ অক্ষরের হতে হবে" }),
    village: z.string().min(2, { message: "গ্রাম কমপক্ষে ২ অক্ষরের হতে হবে" }),
    fullAddress: z.string().min(5, { message: "পূর্ণ ঠিকানা কমপক্ষে ৫ অক্ষরের হতে হবে" }),
  }).strict(),
  
  // File Uploads
  nidFront: z.any().refine((file) => file !== null && file !== undefined, {
    message: "NID-এর সামনের অংশের ছবি দিন",
  }),
  nidBack: z.any().refine((file) => file !== null && file !== undefined, {
    message: "NID-এর পেছনের অংশের ছবি দিন",
  }),
});

export type FarmerNidFormValues = z.infer<typeof farmerNidSchema>;


export const investorSignupSchema = z.object({
  name: z.string().min(2, { message: "নাম কমপক্ষে ২ অক্ষরের হতে হবে" }),
  email: z.string().email({ message: "সঠিক ইমেইল দিন" }),
  phone: z.string().regex(/^[0-9]{10}$/, { message: "সঠিক ১০ ডিজিটের ফোন নম্বর দিন" }),
  otp: z.array(z.string().min(1, { message: "OTP-এর প্রতিটি ঘর পূরণ করতে হবে" })).length(6, {
    message: "৬-ডিজিটের সঠিক OTP দিন",
  }),
  password: z.string().trim().min(8, { message: "পাসওয়ার্ড কমপক্ষে ৮ ক্যারেক্টারের হতে হবে" }),
  interests: z.array(z.string()).min(1, { message: "কমপক্ষে একটি ক্ষেত্র নির্বাচন করুন" }),
  riskTolerance: z.string().min(1, { message: "ঝুঁকি সহনশীলতা নির্বাচন করুন" }),
  monthlyPlan: z.string().min(1, { message: "মাসিক বিনিয়োগ পরিকল্পনা নির্বাচন করুন" }),
  terms: z.literal(true, {
    errorMap: () => ({ message: "এগিয়ে যেতে আপনাকে শর্তাবলী ও গোপনীয়তা নীতিতে সম্মত হতে হবে।" }),
  }),
  avatar: z.any().optional(),
});

export type InvestorSignupFormValues = z.infer<typeof investorSignupSchema>;

export const adminSignupSchema = z.object({
  name: z.string().min(2, { message: "নাম কমপক্ষে ২ অক্ষরের হতে হবে" }),
  email: z.string().email({ message: "সঠিক ইমেইল দিন" }),
  otp: z.array(z.string().min(1, { message: "OTP-এর প্রতিটি ঘর পূরণ করতে হবে" })).length(6, {
    message: "৬-ডিজিটের সঠিক OTP দিন",
  }),
  password: z.string().trim().min(8, { message: "পাসওয়ার্ড কমপক্ষে ৮ ক্যারেক্টারের হতে হবে" }),
  avatar: z.any().optional(),
});

export type AdminSignupFormValues = z.infer<typeof adminSignupSchema>;



export const loginSchema = z.object({
  email: z.string().min(1, { message: "ইমেইল আবশ্যক" }).email({ message: "সঠিক ইমেইল প্রদান করুন" }),
  password: z.string().min(1, { message: "পাসওয়ার্ড আবশ্যক" }),
});

export type LoginSchema = z.infer<typeof loginSchema>;