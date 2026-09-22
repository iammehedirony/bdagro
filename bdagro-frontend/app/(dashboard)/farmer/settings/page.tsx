"use client";

import { useState, useEffect } from "react";
import { ShieldCheck, Loader2, Lock } from "lucide-react";
import Field from "@/components/ui/Field";
import { useClerk, useUser } from "@clerk/nextjs";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useFarmerProfileQuery } from "@/hooks/queries/useFarmerQueries";
import { useUpdateFarmerProfileMutation } from "@/hooks/mutations/useFarmerMutations";
import { updateCustomPassword } from "@/actions/resetUserPass";

const profileSchema = z.object({
    name: z.string().min(2, { message: "নাম কমপক্ষে ২ অক্ষরের হতে হবে" }),
    phone: z.string().trim().optional(),
    address: z.string().trim().optional(),
});

const passwordSchema = z.object({
    currentPassword: z
        .string()
        .min(8, { message: "বর্তমান পাসওয়ার্ড আবশ্যক" }),
    newPassword: z
        .string()
        .min(8, { message: "পাসওয়ার্ড কমপক্ষে ৮ ক্যারেক্টারের হতে হবে" }),
});

type ProfileFormValues = z.infer<typeof profileSchema>;
type PasswordFormValues = z.infer<typeof passwordSchema>;

export default function FarmerSettingsPage() {
    const { signOut } = useClerk();
    const { user: clerkUser } = useUser();
    const { data, isLoading } = useFarmerProfileQuery();
    const { mutate: updateProfile, isPending: isUpdatingProfile } =
        useUpdateFarmerProfileMutation();

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
                phone: data.user.phone ?? "",
                address: data.profile?.address?.fullAddress ?? "",
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
                // Error handled globally
            },
        });
    };

    const onPasswordSubmit = async (values: PasswordFormValues) => {
        setPasswordError("");
        setPasswordSuccess("");

        try {
            const result = await updateCustomPassword(
                values.currentPassword,
                values.newPassword,
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

    const profile = data?.profile;
    const user = data?.user;

    const getVerificationStatus = () => {
        if (!profile)
            return {
                status: "pending" as const,
                label: "অপেক্ষমাণ",
                color: "amber",
            };
        switch (profile.verificationStatus) {
            case "approved":
                return {
                    status: "approved" as const,
                    label: "যাচাইকৃত",
                    color: "emerald",
                };
            case "rejected":
                return {
                    status: "rejected" as const,
                    label: "বাতিল",
                    color: "red",
                };
            case "pending":
            default:
                return {
                    status: "pending" as const,
                    label: "অপেক্ষমাণ",
                    color: "amber",
                };
        }
    };

    const verification = getVerificationStatus();
    const verificationColors = {
        approved: {
            bg: "bg-emerald-50",
            border: "border-emerald-600",
            text: "text-emerald-700",
            badge: "bg-emerald-50 border-emerald-600 text-emerald-800",
        },
        rejected: {
            bg: "bg-red-50",
            border: "border-red-600",
            text: "text-red-700",
            badge: "bg-red-50 border-red-600 text-red-800",
        },
        pending: {
            bg: "bg-amber-50",
            border: "border-amber-600",
            text: "text-amber-700",
            badge: "bg-amber-50 border-amber-600 text-amber-800",
        },
    };
    const vColors = verificationColors[verification.status];

    const maskNid = (nid: string) => {
        if (nid.length < 8) return nid;
        return `${nid.slice(0, 4)} XXXX XXXX`;
    };

    const formatDate = (dateStr?: string | null) => {
        if (!dateStr) return "-";
        try {
            const date = new Date(dateStr);
            return date.toLocaleDateString("bn-BD", {
                year: "numeric",
                month: "long",
                day: "numeric",
            });
        } catch {
            return "-";
        }
    };

    return (
        <div className="bg-white min-h-screen flex">
            {/* MAIN */}
            <div className="flex-1 min-w-0">
                <div className="p-4 lg:p-0 max-w-2xl space-y-8 lg:space-y-10">
                    {/* PROFILE */}
                    <div>
                        <h2 className="text-xl text-stone-900 mb-4">
                            প্রোফাইল তথ্য
                        </h2>
                        <form
                            onSubmit={handleProfileSubmit(onProfileSubmit)}
                            className="space-y-4"
                        >
                            <div className="border border-stone-200 p-6 grid sm:grid-cols-2 gap-5">
                                <div>
                                    <Field
                                        label="পূর্ণ নাম"
                                        {...registerProfile("name")}
                                    />
                                    {profileErrors.name && (
                                        <p className="text-red-500 text-xs mt-1">
                                            {profileErrors.name.message}
                                        </p>
                                    )}
                                </div>
                                <div>
                                    <Field
                                        label="ফোন নম্বর"
                                        {...registerProfile("phone")}
                                        placeholder="০১৭XXXXXXXX"
                                    />
                                    {profileErrors.phone && (
                                        <p className="text-red-500 text-xs mt-1">
                                            {profileErrors.phone.message}
                                        </p>
                                    )}
                                </div>
                                <div>
                                    <Field
                                        label="ইমেইল"
                                        defaultValue={
                                            clerkUser?.emailAddresses?.[0]
                                                ?.emailAddress ||
                                            user?.email ||
                                            ""
                                        }
                                        readOnly
                                    />
                                </div>
                                <div>
                                    <Field
                                        label="ঠিকানা"
                                        {...registerProfile("address")}
                                        placeholder="জেলা, উপজেলা, গ্রাম"
                                    />
                                    {profileErrors.address && (
                                        <p className="text-red-500 text-xs mt-1">
                                            {profileErrors.address.message}
                                        </p>
                                    )}
                                </div>
                            </div>
                            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                                <button
                                    type="submit"
                                    disabled={isUpdatingProfile}
                                    className="bg-emerald-900 text-white px-6 py-3 text-sm hover:bg-emerald-800 disabled:opacity-50 flex items-center justify-center"
                                >
                                    {isUpdatingProfile ? (
                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    ) : null}
                                    পরিবর্তন সংরক্ষণ করুন
                                </button>
                                {profileSuccess && (
                                    <p className="text-emerald-600 text-sm font-medium">
                                        {profileSuccess}
                                    </p>
                                )}
                            </div>
                        </form>
                    </div>

                    {/* NID VERIFICATION */}
                    <div>
                        <h2 className="text-xl text-stone-900 mb-4">
                            NID ভেরিফিকেশন
                        </h2>
                        <div
                            className={`border ${vColors.border} p-4 lg:p-6 flex flex-row items-center gap-3 lg:gap-4 w-full`}
                        >
                            {/* Icon */}
                            <div
                                className={`w-10 h-10 lg:w-11 lg:h-11 ${vColors.bg} ${vColors.border} rounded-full flex items-center justify-center shrink-0`}
                            >
                                <ShieldCheck
                                    className={`w-5 h-5 ${vColors.text}`}
                                />
                            </div>

                            {/* Text Content */}
                            <div className="flex-1 min-w-0 text-left">
                                <div className="text-sm font-medium text-stone-800">
                                    {verification.label}
                                </div>
                                <div className="text-xs text-stone-500 mt-1 whitespace-normal">
                                    NID নম্বর:{" "}
                                    {profile ? maskNid(profile.nidNumber) : "—"}
                                    <span className="block sm:inline sm:ml-1">
                                        <span className="hidden sm:inline">
                                            ·{" "}
                                        </span>
                                        ভেরিফাইড{" "}
                                        {formatDate(profile?.verifiedAt)}
                                    </span>
                                </div>
                            </div>

                            {/* Status Badge */}
                            <div className="shrink-0 self-start sm:self-center">
                                <span
                                    className={`text-xs ${vColors.badge} px-2 py-1 rounded inline-block`}
                                >
                                    {verification.label}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* PASSWORD */}
                    <div>
                        <h2 className="text-xl text-stone-900 mb-4">
                            পাসওয়ার্ড পরিবর্তন
                        </h2>
                        <form
                            onSubmit={handlePasswordSubmit(onPasswordSubmit)}
                            className="space-y-4"
                        >
                            <div className="border border-stone-200 p-6 grid sm:grid-cols-2 gap-5">
                                <div>
                                    <Field
                                        label="বর্তমান পাসওয়ার্ড"
                                        type="password"
                                        placeholder="••••••••"
                                        {...registerPassword("currentPassword")}
                                    />
                                    {passwordErrors.currentPassword && (
                                        <p className="text-red-500 text-xs mt-1">
                                            {
                                                passwordErrors.currentPassword
                                                    .message
                                            }
                                        </p>
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
                                        <p className="text-red-500 text-xs mt-1">
                                            {passwordErrors.newPassword.message}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                                <button
                                    type="submit"
                                    disabled={isUpdatingPassword}
                                    className="bg-neutral-900 text-white px-6 py-3 text-sm hover:bg-neutral-800 disabled:opacity-50 flex items-center justify-center"
                                >
                                    {isUpdatingPassword ? (
                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    ) : null}
                                    পাসওয়ার্ড আপডেট করুন
                                </button>

                                {passwordError && (
                                    <p className="text-red-500 text-sm font-medium">
                                        {passwordError}
                                    </p>
                                )}
                                {passwordSuccess && (
                                    <p className="text-emerald-600 text-sm font-medium">
                                        {passwordSuccess}
                                    </p>
                                )}

                                <button
                                    type="button"
                                    onClick={() => signOut()}
                                    className="text-sm text-stone-500 hover:text-stone-800 flex items-center gap-1.5 sm:ml-auto"
                                >
                                    <Lock className="w-3.5 h-3.5" />
                                    লগ আউট করুন
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
