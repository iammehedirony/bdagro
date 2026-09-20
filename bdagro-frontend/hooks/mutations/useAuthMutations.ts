"use client";

import { useAuth, useSession, useSignIn, useSignUp, useUser } from "@clerk/nextjs";
import { useMutation } from "@tanstack/react-query";
import { useApi } from "@/lib/useApi";
import { queryKeys } from "@/lib/query/keys";
import { selectRole, type SelectRolePayload } from "@/lib/services/auth.service";
import {
  createInvestorProfile,
  type InvestorProfilePayload,
} from "@/lib/services/investor.service";

type SignupPayload =
  | { otp: string; role: "admin"; phone?: string; profile?: never; avatar?: File | null }
  | { otp: string; role: "farmer" | "investor"; phone: string; profile?: InvestorProfilePayload; avatar?: File | null };

export function useSendSignupOtpMutation() {
  const { signUp } = useSignUp();

  return useMutation({
    mutationKey: queryKeys.auth.sendSignupOtp,
    mutationFn: async (payload: { name: string; email: string; password: string }) => {
      const result = await signUp.password({
        firstName: payload.name,
        emailAddress: payload.email,
        password: payload.password,
      });

      if (result.error) throw new Error(result.error.message);

      const verificationResult = await signUp.verifications.sendEmailCode();
      if (verificationResult.error) throw new Error(verificationResult.error.message);
      return verificationResult;
    },
  });
}

export function useSignupMutation() {
  const { signUp } = useSignUp();
  const { getToken } = useAuth();
  const { session } = useSession();
  const { user } = useUser();
  const api = useApi();

  return useMutation({
    mutationKey: queryKeys.auth.signup,
    mutationFn: async ({ otp, role, phone, profile, avatar }: SignupPayload) => {
      const verification = await signUp.verifications.verifyEmailCode({ code: otp });
      if (verification.error) throw new Error(verification.error.message);
      if (signUp.status !== "complete") throw new Error("অ্যাকাউন্ট সম্পন্ন করা যায়নি।");

      const finalized = await signUp.finalize();
      if (finalized.error) throw new Error(finalized.error.message);

      // Prepare form data for selectRole with avatar
      const formData = new FormData();
      formData.append("role", role);
      if (phone) formData.append("phone", phone);
      if (avatar) formData.append("avatar", avatar);

      const response = await selectRole(api, formData);
      if (role === "investor" && profile) await createInvestorProfile(api, profile);
      return response;
    },
    onSuccess: async () => {
      await getToken({ skipCache: true });
      await Promise.all([user?.reload(), session?.reload()]);
    },
  });
}

export function useLoginMutation() {
  const { signIn } = useSignIn();

  return useMutation({
    mutationKey: queryKeys.auth.login,
    mutationFn: async (payload: { email: string; password: string }) => {
      const result = await signIn.password({
        emailAddress: payload.email.trim(),
        password: payload.password,
      });

      if (result.error) throw new Error(result.error.message);
      if (signIn.status !== "complete") throw new Error("লগইন সম্পন্ন করা যায়নি।");

      await signIn.finalize();
      return result;
    },
  });
}
