"use client";

import React, { useEffect, useState } from "react";
import {
    useForm,
    FormProvider,
    useFormContext,
    Controller,
    type FieldError as RHFFieldError,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ShieldCheck, CheckCircle2, Clock, Loader2 } from "lucide-react";
import { useUser } from "@clerk/nextjs";
import Field from "../ui/Field";
import UploadBox from "../ui/UploadBox";
import StatusChip from "../ui/StatusChip";
import OtpInput from "../ui/OtpInput";
import {
    farmerAccountSchema,
    farmerNidSchema,
    type FarmerAccountFormValues,
    type FarmerNidFormValues,
} from "../../lib/schemas/auth";
import { StepSidebar } from "./StepSidebar";
import { FieldError } from "../ui/FieldError";
import { LockedPreview } from "./LockedPreview";
import LoadingPage from "@/app/loading";
import {
    useSendSignupOtpMutation,
    useSignupMutation,
} from "@/hooks/mutations/useAuthMutations";
import { useFarmerNidMutation } from "@/hooks/mutations/useProfileMutations";

function AccountStep() {
    const {
        register,
        control,
        trigger,
        getValues,
        watch,
        setValue,
        formState: { errors, isSubmitting },
    } = useFormContext<FarmerAccountFormValues>();

    const [clerkError, setClerkError] = useState("");
    const [countdown, setCountdown] = useState<number | null>(null);
    const [avatarFile, setAvatarFile] = useState<File | null>(null);
    const sendOtpMutation = useSendSignupOtpMutation();

    // কাউন্টডাউন টাইমার হ্যান্ডেল করার জন্য useEffect
    useEffect(() => {
        if (countdown === null) return;

        const timer = setInterval(() => {
            setCountdown((prev) =>
                prev !== null && prev > 1 ? prev - 1 : null,
            );
        }, 1000);

        return () => clearInterval(timer);
    }, [countdown]);

    const handleSendOTP = async () => {
        const isValid = await trigger([
            "name",
            "email",
            "password",
            "terms",
            "phone",
        ]);
        if (!isValid) return;

        const data = getValues();

        try {
            await sendOtpMutation.mutateAsync(data);
            setCountdown(5);
        } catch {
            setClerkError("OTP পাঠাতে সমস্যা হয়েছে।");
        }
    };

    const handleAvatarChange = (file: File | null) => {
        setAvatarFile(file);
        setValue("avatar", file, { shouldValidate: false });
    };

    return (
        <>
            <div className="border border-stone-200">
                <div className="px-8">
                    <div className="flex items-center gap-2 text-emerald-800">
                        <ShieldCheck className="w-4 h-4" />
                        <span className="text-xs">ধাপ ১ / ২</span>
                    </div>
                    <h2 className="mt-2 text-xl text-stone-900">
                        অ্যাকাউন্ট তৈরি করুন
                    </h2>
                    <p className="mt-2 text-sm text-stone-500 leading-relaxed max-w-md">
                        আপনার নাম ও ফোন নম্বর দিয়ে অ্যাকাউন্ট খুলুন। ফোন নম্বর
                        OTP দিয়ে যাচাই করা হবে।
                    </p>
                </div>

                <div className="p-8 space-y-5">
                    {(clerkError || sendOtpMutation.error) && (
                        <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded">
                            {clerkError || sendOtpMutation.error?.message}
                        </div>
                    )}

                    {/* পূর্ণ নাম (Custom Field Component) */}
                    <div>
                        <Field
                            label="পূর্ণ নাম"
                            placeholder="আপনার নাম লিখুন"
                            readOnly={isSubmitting || sendOtpMutation.isPending}
                            {...register("name")}
                        />
                        <FieldError error={errors.name} />
                    </div>

                    {/* প্রোফাইল ছবি */}
                    <div>
                        <label className="text-sm text-stone-700 block mb-1.5">
                            প্রোফাইল ছবি (ঐচ্ছিক)
                        </label>
                        <UploadBox
                            label="প্রোফাইল ছবি আপলোড করুন"
                            hint="JPG, PNG, WEBP · সর্বোচ্চ ৫MB"
                            file={avatarFile}
                            onChange={handleAvatarChange}
                            accept="image/*"
                        />
                    </div>

                    {/* ফোন নম্বর (Custom Field Component) */}
                    <div>
                        <Field
                            label="ফোন নম্বর"
                            placeholder="০১৭XXXXXXXX"
                            readOnly={isSubmitting || sendOtpMutation.isPending}
                            {...register("phone")}
                        />
                        <FieldError error={errors.phone} />
                    </div>
                    {/* ইমেইল (Custom Field Component) */}
                    <div>
                        <Field
                            label="ইমেইল"
                            placeholder="আপনার ইমেইল দিন"
                            readOnly={isSubmitting || sendOtpMutation.isPending}
                            {...register("email")}
                            suffix={
                                <button
                                    type="button"
                                    onClick={handleSendOTP}
                                    disabled={
                                        isSubmitting ||
                                        sendOtpMutation.isPending ||
                                        countdown !== null
                                    }
                                    className="px-4 py-2.5 text-xs text-emerald-800 border-l border-stone-300 hover:bg-stone-50 whitespace-nowrap disabled:opacity-50"
                                >
                                    {sendOtpMutation.isPending ? (
                                        <Loader2 className="w-3 h-3 animate-spin inline" />
                                    ) : countdown !== null ? (
                                        `otp sent! (${countdown}s)`
                                    ) : (
                                        "OTP পাঠান"
                                    )}
                                </button>
                            }
                        />
                        <FieldError error={errors.email} />
                    </div>

                    {/* OTP কোড (Custom OtpInput Component with Controller) */}
                    <div>
                        <label className="text-sm text-neutral-700 block mb-1.5">
                            OTP কোড
                        </label>
                        <Controller
                            name="otp"
                            control={control}
                            render={({ field: { value, onChange } }) => (
                                <OtpInput
                                    value={value}
                                    onChange={onChange}
                                    disabled={
                                        isSubmitting ||
                                        sendOtpMutation.isPending
                                    }
                                />
                            )}
                        />
                        <FieldError
                            error={
                                errors.otp
                                    ? ({
                                          message:
                                              errors.otp.message ||
                                              "অনুগ্রহ করে ৬-ডিজিটের সম্পূর্ণ OTP কোডটি লিখুন",
                                      } as RHFFieldError)
                                    : undefined
                            }
                        />
                        <div className="mt-2 text-xs text-stone-400">
                            ফোনে পাঠানো ৬-ডিজিট কোডটি লিখুন ·{" "}
                        </div>
                    </div>

                    {/* পাসওয়ার্ড (Custom Field Component) */}
                    <div>
                        <Field
                            label="পাসওয়ার্ড"
                            type="password"
                            placeholder="কমপক্ষে ৮ ক্যারেক্টার"
                            readOnly={isSubmitting || sendOtpMutation.isPending}
                            {...register("password")}
                        />
                        <FieldError error={errors.password} />
                    </div>

                    <div id="clerk-captcha" />

                    {/* Terms Checkbox */}
                    <div>
                        <label className="flex items-start gap-2 text-xs text-stone-500">
                            <input
                                type="checkbox"
                                className="accent-emerald-800 mt-0.5"
                                {...register("terms")}
                                disabled={
                                    isSubmitting || sendOtpMutation.isPending
                                }
                            />
                            <span>
                                আমি Bdagroonline-এর ব্যবহারের শর্তাবলী ও
                                গোপনীয়তা নীতিতে সম্মত
                            </span>
                        </label>
                        <FieldError
                            error={
                                errors.terms
                                    ? ({
                                          ...errors.terms,
                                          message:
                                              "এগিয়ে যেতে আপনাকে শর্তাবলী ও গোপনীয়তা নীতিতে সম্মত হতে হবে।",
                                      } as RHFFieldError)
                                    : undefined
                            }
                        />
                    </div>
                </div>

                <div className="p-8 pt-0 flex items-center justify-end">
                    <button
                        type="submit"
                        disabled={isSubmitting || sendOtpMutation.isPending}
                        className="bg-emerald-900 text-white px-6 py-3 text-sm hover:bg-emerald-800 disabled:opacity-70"
                    >
                        {isSubmitting ? (
                            <Loader2 className="animate-spin w-4 h-4" />
                        ) : (
                            "পরবর্তী ধাপ: NID ভেরিফিকেশন"
                        )}
                    </button>
                </div>
            </div>

            <LockedPreview nextStep={2} />
        </>
    );
}

function NidStep() {
    const {
        register,
        control,
        formState: { errors, isSubmitting },
    } = useFormContext<FarmerNidFormValues>();

    return (
        <>
            <div className="border border-stone-200">
                <div className="p-8 border-b border-stone-200">
                    <div className="flex items-center gap-2 text-emerald-800">
                        <ShieldCheck className="w-4 h-4" />
                        <span className="text-xs">ধাপ ২ / ২</span>
                    </div>
                    <h2 className="mt-2 text-xl text-stone-900">
                        জাতীয় পরিচয়পত্র (NID) ভেরিফিকেশন
                    </h2>
                    <p className="mt-2 text-sm text-stone-500 leading-relaxed max-w-md">
                        বিনিয়োগকারীদের আস্থা নিশ্চিত করতে প্রতিটি কৃষকের পরিচয়
                        যাচাই করা হয়। তথ্য শুধু ভেরিফিকেশনের জন্য ব্যবহৃত হবে।
                    </p>
                </div>

                <div className="p-8 space-y-6">
                    <div className="grid sm:grid-cols-2 gap-5">
                        <div>
                            <Field
                                label="NID নম্বর"
                                placeholder="১০ / ১৭ ডিজিট"
                                readOnly={isSubmitting}
                                {...register("nidNumber")}
                            />
                            <FieldError error={errors.nidNumber} />
                        </div>
                        <div>
                            <Field
                                label="পূর্ণ নাম (NID অনুযায়ী)"
                                placeholder="নাম লিখুন"
                                readOnly={isSubmitting}
                                {...register("nidName")}
                            />
                            <FieldError error={errors.nidName} />
                        </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-5">
                        <div>
                            <Field
                                label="জন্ম তারিখ"
                                placeholder="dd/mm/yyyy"
                                readOnly={isSubmitting}
                                {...register("dob")}
                            />
                            <FieldError error={errors.dob} />
                        </div>
                        {/* district */}
                        <div>
                            <Field
                                label="জেলা"
                                placeholder="জেলা লিখুন"
                                readOnly={isSubmitting}
                                {...register("address.district")}
                            />
                            <FieldError error={errors.address?.district} />
                        </div>
                        {/* upazila */}
                        <div>
                            <Field
                                label="উপজেলা"
                                placeholder="উপজেলা লিখুন"
                                readOnly={isSubmitting}
                                {...register("address.upazila")}
                            />
                            <FieldError error={errors.address?.upazila} />
                        </div>
                        {/* village */}
                        <div>
                            <Field
                                label="গ্রাম"
                                placeholder="গ্রাম লিখুন"
                                readOnly={isSubmitting}
                                {...register("address.village")}
                            />
                            <FieldError error={errors.address?.village} />
                        </div>
                        {/* fullAddress */}
                        <div>
                            <Field
                                label="পূর্ণ ঠিকানা"
                                placeholder="পূর্ণ ঠিকানা লিখুন"
                                readOnly={isSubmitting}
                                {...register("address.fullAddress")}
                            />
                            <FieldError error={errors.address?.fullAddress} />
                        </div>
                    </div>

                    <div>
                        <div className="text-sm text-stone-700 mb-2">
                            NID কার্ডের ছবি
                        </div>
                        <div className="grid sm:grid-cols-2 gap-4">
                            <div>
                                <Controller
                                    name="nidFront"
                                    control={control}
                                    render={({
                                        field: { value, onChange },
                                    }) => (
                                        <UploadBox
                                            label="সামনের অংশ"
                                            hint="JPG, PNG · সর্বোচ্চ ৫MB"
                                            file={value ?? null}
                                            onChange={onChange}
                                        />
                                    )}
                                />
                                <FieldError error={errors.nidFront} />
                            </div>
                            <div>
                                <Controller
                                    name="nidBack"
                                    control={control}
                                    render={({
                                        field: { value, onChange },
                                    }) => (
                                        <UploadBox
                                            label="পেছনের অংশ"
                                            hint="JPG, PNG · সর্বোচ্চ ৫MB"
                                            file={value ?? null}
                                            onChange={onChange}
                                        />
                                    )}
                                />
                                <FieldError error={errors.nidBack} />
                            </div>
                        </div>
                    </div>
                    <div className="flex items-start gap-2 text-xs text-stone-400 pt-1">
                        <Clock className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                        <span>
                            যাচাইয়ে সাধারণত ২৪ ঘণ্টার মধ্যে সময় লাগে।
                            অনুমোদনের পর প্রকল্প পোস্ট করার সুবিধা চালু হবে।
                        </span>
                    </div>
                </div>

                <div className="p-8 pt-0 flex items-center justify-between">
                    <button
                        type="submit"
                        className="bg-emerald-900 text-white px-6 py-3 text-sm hover:bg-emerald-800 w-full flex items-center justify-center"
                    >
                        {isSubmitting ? (
                            <Loader2 className="animate-spin w-4 h-4" />
                        ) : (
                            "NID যাচাইয়ের জন্য জমা দিন"
                        )}
                    </button>
                </div>
            </div>
        </>
    );
}

function DoneScreen() {
    return (
        <div className="border border-stone-200 p-10 flex flex-col items-center text-center gap-3">
            <div className="w-12 h-12 rounded-full bg-emerald-900 flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-xl text-stone-900">
                আপনার তথ্য যাচাইয়ের জন্য জমা দেওয়া হয়েছে
            </h2>
            <p className="text-sm text-stone-500 max-w-sm">
                NID ভেরিফিকেশন সম্পন্ন হওয়ার পর আপনি প্রকল্প পোস্ট করতে পারবেন।
            </p>
        </div>
    );
}

export default function FarmerSignupFlow() {
    const { isLoaded, user } = useUser();
    const signupMutation = useSignupMutation();
    const nidMutation = useFarmerNidMutation();
    const nidStatus = user?.publicMetadata?.nidStatus as string;
    let currentStep = 1;
    if (nidStatus === "unsubmitted") {
        currentStep = 2;
    } else if (nidStatus === "pending" || nidStatus === "submitted") {
        currentStep = 3;
    }

    const accountMethods = useForm<FarmerAccountFormValues>({
        resolver: zodResolver(farmerAccountSchema),
        mode: "onBlur",
        defaultValues: {
            name: "",
            email: "",
            phone: "",
            otp: ["", "", "", "", "", ""],
            password: "",
            avatar: null,
        },
    });

    const nidMethods = useForm<FarmerNidFormValues>({
        resolver: zodResolver(farmerNidSchema),
        mode: "onSubmit",
        defaultValues: {
            nidNumber: "",
            nidName: "",
            dob: "",
            address: {
                district: "",
                upazila: "",
                village: "",
                fullAddress: "",
            },
            nidFront: null,
            nidBack: null,
        },
    });

    const onSubmitAccount = async (data: FarmerAccountFormValues) => {
        try {
            await signupMutation.mutateAsync({
                otp: data.otp.join(""),
                role: "farmer",
                phone: data.phone,
                avatar: data.avatar ?? null,
            });
            await user?.reload();
        } catch {
            console.error("অ্যাকাউন্ট তৈরি করা যায়নি।");
        }
    };

    const onSubmitNid = async (data: FarmerNidFormValues) => {
        try {
            await nidMutation.mutateAsync(data);
            await user?.reload();
        } catch {
            console.error("NID তথ্য জমা দেওয়া যায়নি।");
        }
    };

    const isPending = nidStatus === "submitted";

    if (!isLoaded) return <LoadingPage />;

    return (
        <div className="bg-white min-h-screen">
            <div className="max-w-5xl mx-auto px-6 py-14">
                <h1 className="text-3xl text-stone-900">কৃষক হিসেবে যোগ দিন</h1>
                <p className="mt-2 text-stone-500 text-sm max-w-lg">
                    প্রথমে অ্যাকাউন্ট তৈরি করুন, তারপর NID যাচাই সম্পন্ন করুন।
                </p>

                <div className="mt-12 grid md:grid-cols-[220px_1fr] gap-12">
                    <StepSidebar step={currentStep} />

                    <div>
                        {isPending ? (
                            <DoneScreen />
                        ) : (
                            <>
                                {currentStep === 1 && (
                                    <FormProvider {...accountMethods}>
                                        <form
                                            onSubmit={accountMethods.handleSubmit(
                                                onSubmitAccount,
                                            )}
                                            noValidate
                                        >
                                            <AccountStep />
                                        </form>
                                    </FormProvider>
                                )}

                                {currentStep === 2 && (
                                    <FormProvider {...nidMethods}>
                                        {nidMutation.error && (
                                            <div className="mb-4 p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded">
                                                {nidMutation.error.message}
                                            </div>
                                        )}
                                        <form
                                            onSubmit={nidMethods.handleSubmit(
                                                onSubmitNid,
                                            )}
                                            noValidate
                                        >
                                            <NidStep />
                                        </form>
                                    </FormProvider>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
