"use client";

import { useState, useEffect } from "react";
import { Lock, Loader2 } from "lucide-react";
import Field from "@/components/ui/Field";
import { useClerk, useUser } from "@clerk/nextjs";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAdminProfileQuery } from "@/hooks/queries/useAdminQueries";
import { useUpdateAdminProfileMutation } from "@/hooks/mutations/useAdminMutations";
import { updateCustomPassword } from "@/actions/resetUserPass";

const profileSchema = z.object({
  name: z.string().min(2, { message: "নাম কমপক্ষে ২ অক্ষরের হতে হবে" }),
});

const passwordSchema = z.object({
  currentPassword: z.string().min(8, { message: "বর্তমান পাসওয়ার্ড আবশ্যক" }),
  newPassword: z.string().min(8, { message: "পাসওয়ার্ড কমপক্ষে ৮ ক্যারেক্টারের হতে হবে" }),
});

type ProfileFormValues = z.infer<typeof profileSchema>;
type PasswordFormValues = z.infer<typeof passwordSchema>;

export default function AdminSettingsPage() {
  const { signOut } = useClerk();
  const { user: clerkUser } = useUser();
  const { data, isLoading } = useAdminProfileQuery();
  const { mutate: updateProfile, isPending: isUpdatingProfile } = useUpdateAdminProfileMutation();

  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");
  const [profileSuccess, setProfileSuccess] = useState("");

  const {
    register: registerProfile,
    handleSubmit: handleProfileSubmit,
    reset: resetProfile,
    formState: { errors: profileErrors },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
  });

  const {
    register: registerPassword,
    handleSubmit: handlePasswordSubmit,
    reset: resetPassword,
    formState: { errors: passwordErrors, isSubmitting: isUpdatingPassword },
  } = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema),
  });

  useEffect(() => {
    if (data?.user) {
      resetProfile({
        name: data.user.name,
      });
    }
  }, [data, resetProfile]);

  const onProfileSubmit = (values: ProfileFormValues) => {
    setProfileSuccess("");
    updateProfile(values, {
      onSuccess: () => {
        setProfileSuccess("প্রোফাইল আপডেট হয়েছে!");
        setTimeout(() => setProfileSuccess(""), 3000);
      },
      onError: () => {
        // Handle error globally via api client or leave as is since there is no toast
      }
    });
  };

  const onPasswordSubmit = async (values: PasswordFormValues) => {
    setPasswordError("");
    setPasswordSuccess("");

    try {
      const result = await updateCustomPassword(
        values.currentPassword,
        values.newPassword
      );

      if (result.error) {
        setPasswordError(result.error);
      } else if (result.success) {
        setPasswordSuccess("পাসওয়ার্ড সফলভাবে আপডেট হয়েছে!");
        resetPassword();
        setTimeout(() => setPasswordSuccess(""), 3000);
      }
    } catch (err) {
      setPasswordError("সার্ভারের সাথে যোগাযোগে সমস্যা হয়েছে।");
    }
  };


  if (isLoading) {
    return (
      <div className="flex-1 min-w-0 p-4 lg:p-0 flex justify-center mt-10 lg:mt-20">
        <Loader2 className="w-8 h-8 animate-spin text-neutral-400" />
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen">
      <div className="p-4 lg:p-0 max-w-3xl space-y-8 lg:space-y-10">
        {/* PROFILE */}
        <div>
          <h2 className="text-xl text-neutral-900 mb-4">অ্যাডমিন প্রোফাইল</h2>
          <form onSubmit={handleProfileSubmit(onProfileSubmit)} className="space-y-4">
            <div className="border border-neutral-200 p-4 lg:p-6 grid sm:grid-cols-2 gap-4 lg:gap-5">
              <div>
                <Field label="পূর্ণ নাম" {...registerProfile("name")} />
                {profileErrors.name && (
                  <p className="text-red-500 text-xs mt-1">{profileErrors.name.message}</p>
                )}
              </div>
              <div>
                <Field label="ইমেইল" defaultValue={clerkUser?.emailAddresses?.[0]?.emailAddress || ""} readOnly />
              </div>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <button
                type="submit"
                disabled={isUpdatingProfile}
                className="bg-primary-900 text-white px-4 lg:px-6 py-3 text-sm hover:bg-primary-800 disabled:opacity-50 flex items-center justify-center"
              >
                {isUpdatingProfile ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                পরিবর্তন সংরক্ষণ করুন
              </button>
              {profileSuccess && <p className="text-emerald-600 text-sm font-medium">{profileSuccess}</p>}
            </div>
          </form>
        </div>

        {/* PASSWORD */}
        <div>
          <h2 className="text-xl text-neutral-900 mb-4">পাসওয়ার্ড পরিবর্তন</h2>
          <form onSubmit={handlePasswordSubmit(onPasswordSubmit)} className="space-y-4">
            <div className="border border-neutral-200 p-4 lg:p-6 grid sm:grid-cols-2 gap-4 lg:gap-5">
              <div>
                <Field
                  label="বর্তমান পাসওয়ার্ড"
                  type="password"
                  placeholder="••••••••"
                  {...registerPassword("currentPassword")}
                />
                {passwordErrors.currentPassword && (
                  <p className="text-red-500 text-xs mt-1">{passwordErrors.currentPassword.message}</p>
                )}
              </div>
              <div>
                <Field
                  label="নতুন পাসওয়ার্ড"
                  type="password"
                  placeholder="••••••••"
                  {...registerPassword("newPassword")}
                />
                {passwordErrors.newPassword && (
                  <p className="text-red-500 text-xs mt-1">{passwordErrors.newPassword.message}</p>
                )}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <button
                type="submit"
                disabled={isUpdatingPassword}
                className="bg-neutral-900 text-white px-4 lg:px-6 py-3 text-sm hover:bg-neutral-800 disabled:opacity-50 flex items-center justify-center"
              >
                {isUpdatingPassword ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                পাসওয়ার্ড আপডেট করুন
              </button>

              {passwordError && <p className="text-red-500 text-sm font-medium">{passwordError}</p>}
              {passwordSuccess && <p className="text-emerald-600 text-sm font-medium">{passwordSuccess}</p>}

              <button
                type="button"
                onClick={() => signOut()}
                className="text-sm text-neutral-500 hover:text-neutral-800 flex items-center gap-1.5 sm:ml-auto"
              >
                <Lock className="w-3.5 h-3.5" />
                লগ আউট করুন
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}