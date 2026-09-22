"use client";

import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Info, Loader2, AlertCircle, CheckCircle, Upload, ImageIcon, X } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import Field from "@/components/ui/Field";
import { FieldError } from "@/components/ui/FieldError";
import { useFarmerProjectEditQuery, useUpdateFarmerProjectMutation } from "@/hooks/queries/useFarmerProjectDetailsQueries";
import type { FarmerApplicationDetails } from "@/lib/services/farmer.service";

const editProjectSchema = z.object({
  projectTitle: z.string().min(3, "প্রকল্পের শিরোনাম কমপক্ষে ৩ অক্ষরের হতে হবে"),
  projectDescription: z.string().min(10, "প্রকল্পের বিবরণ কমপক্ষে ১০ অক্ষরের হতে হবে"),
  location: z.string().min(2, "ঠিকানা কমপক্ষে ২ অক্ষরের হতে হবে"),
  cropType: z.string().optional(),
  requestedAmount: z.coerce.number().positive("লোনের পরিমাণ বড় ব্যবহার করতে হবে"),
  durationMonths: z.coerce.number().int().positive("মেয়াদ مثبت সংখ্যা হতে হবে"),
  landArea: z.coerce.number().positive("জমির পরিমাণ বড় ব্যবহার করতে হবে"),
  expectedHarvestDate: z.string().min(1, "ফসল কাটার তারিখ নির্বাচন করুন"),
  farmImage: z.string().url("সঠিক URL দিন").nullable().optional(),
});

type EditProjectFormValues = z.infer<typeof editProjectSchema>;

function formatDateForInput(dateString: string): string {
  const date = new Date(dateString);
  return date.toISOString().split("T")[0];
}

function statusClasses(status: FarmerApplicationDetails["status"]) {
  if (status === "Approved") return "border-emerald-600 bg-emerald-50 text-emerald-800";
  if (status === "Rejected") return "border-red-600 bg-red-50 text-red-800";
  if (status === "Processing") return "border-blue-600 bg-blue-50 text-blue-800";
  return "border-amber-600 bg-amber-50 text-amber-800";
}

export default function FarmerEditProjectPage() {
  const params = useParams<{ id: string }>();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  const router = useRouter();

  const editQuery = useFarmerProjectEditQuery(id);
  const application = editQuery.data;
  const updateMutation = useUpdateFarmerProjectMutation();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<EditProjectFormValues>({
    resolver: zodResolver(editProjectSchema),
    mode: "onBlur",
    defaultValues: {
      projectTitle: "",
      projectDescription: "",
      location: "",
      cropType: "",
      requestedAmount: 0,
      durationMonths: 0,
      landArea: 0,
      expectedHarvestDate: "",
      farmImage: null,
    },
  });

  // Pre-fill form when data loads
  if (application && !editQuery.isLoading) {
    const appData = application as FarmerApplicationDetails & {
      landArea?: number;
      expectedHarvestDate?: string;
      farmImage?: string | null;
    };
    Object.entries({
      projectTitle: appData.projectTitle,
      projectDescription: appData.projectDescription,
      location: appData.location,
      cropType: appData.cropType || "",
      requestedAmount: appData.requestedAmount,
      durationMonths: appData.durationMonths,
      landArea: appData.landArea || 0,
      expectedHarvestDate: appData.expectedHarvestDate
        ? formatDateForInput(appData.expectedHarvestDate)
        : "",
      farmImage: appData.farmImage || null,
    }).forEach(([key, value]) => {
      setValue(key as keyof EditProjectFormValues, value, { shouldValidate: false });
    });
  }

  const onSubmit = async (data: EditProjectFormValues) => {
    try {
      await updateMutation.mutateAsync({ id, data });
      router.push(`/farmer/projects/${id}`);
    } catch {
      // Error is handled by mutation and displayed below
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      alert("শুধুমাত্র ছবি ফাইল আপলোড করুন।");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert("ছবির আকার ৫MB-এর কম হতে হবে।");
      return;
    }

    // Create object URL for preview
    const objectUrl = URL.createObjectURL(file);
    setValue("farmImage", objectUrl, { shouldValidate: true });

    // TODO: In production, upload to Cloudinary/S3 and set the returned URL
    // For now, we use the object URL which works for preview but won't persist across refreshes
    // You would integrate with your upload API here
  };

  const handleRemoveImage = () => {
    setValue("farmImage", null, { shouldValidate: true });
  };

  if (editQuery.isLoading) {
    return (
      <div className="bg-white min-h-screen flex">
        <div className="flex-1 min-w-0 p-4 lg:p-0 max-w-3xl mx-auto">
          <div className="flex items-center justify-center h-48 lg:h-64">
            <Loader2 className="h-8 w-8 animate-spin text-emerald-800" />
          </div>
        </div>
      </div>
    );
  }

  if (editQuery.isError || !application) {
    return (
      <div className="bg-white min-h-screen flex">
        <div className="flex-1 min-w-0 p-4 lg:p-0 max-w-3xl mx-auto">
          <div className="border border-red-200 bg-red-50 p-6 text-sm text-red-700">
            প্রজেক্টের তথ্য লোড করা যায়নি।
            <button className="ml-3 underline" onClick={() => editQuery.refetch()}>
              আবার চেষ্টা করুন
            </button>
          </div>
        </div>
      </div>
    );
  }

  const isEditable = application.status === "Pending" || application.status === "Rejected";
  const isApproved = application.status === "Approved";

  return (
    <div className="bg-white min-h-screen flex">
      <div className="flex-1 min-w-0">
        <div className="p-4 lg:p-0 max-w-3xl">
          {/* HEADER */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4 lg:mb-6">
            <div>
              <h1 className="text-2xl lg:text-3xl text-stone-900">প্রকল্প এডিট করুন</h1>
              <p className="mt-2 text-stone-500 text-sm">
                {isEditable
                  ? "পরিবর্তন সংরক্ষণ করার পর এটি আবার অ্যাডমিন যাচাইয়ের জন্য পাঠানো হবে।"
                  : "অনুমোদিত প্রকল্প সম্পাদনা করা সম্ভব নয়।"}
              </p>
            </div>
            <span className={`text-xs border px-2.5 py-1 shrink-0 ${statusClasses(application.status)}`}>
              {application.status}
            </span>
          </div>

          {/* STATUS INFO */}
          <div className="mb-6 flex items-start gap-2 border border-blue-200 bg-blue-50 px-4 py-3">
            <Info className="w-4 h-4 text-blue-700 mt-0.5 shrink-0" />
            <p className="text-xs text-blue-800 leading-relaxed">
              {isApproved
                ? "এই প্রজেক্টটি অনুমোদিত (Approved) হয়েছে। অনুমোদিত প্রজেক্ট সম্পাদনা করা যাবে না।"
                : application.status === "Rejected"
                ? "আপনার আবেদনটি বাতিল (Rejected) হয়েছিল। আপনি এখন তথ্যগুলো পরিবর্তন করে আবার জমা দিতে পারবেন। যাচাই করার পর এটি আবার Pending হবে।"
                : "আপনার আবেদনটি বর্তমানে অপেক্ষমাণ (Pending) রয়েছে। আপনি চাইলে এখন তথ্যগুলো পরিবর্তন করতে পারবেন।"}
            </p>
          </div>

          {/* ERROR DISPLAY */}
          {updateMutation.isError && (
            <div className="mb-6 border border-red-200 bg-red-50 p-4 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
              <p className="text-sm text-red-700">
                {updateMutation.error instanceof Error
                  ? updateMutation.error.message
                  : "প্রকল্প আপডেট করতে সমস্যা হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।"}
              </p>
            </div>
          )}

          {/* SUCCESS TOAST */}
          {updateMutation.isSuccess && (
            <div className="mb-6 border border-emerald-200 bg-emerald-50 p-4 flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <p className="text-sm text-emerald-800">
                প্রজেক্ট সফলভাবে আপডেট করা হয়েছে। রিডাইরেক্ট করা হচ্ছে...
              </p>
            </div>
          )}

          <form className="mt-6 space-y-8" onSubmit={handleSubmit(onSubmit)}>
            {/* COVER IMAGE */}
            <div>
              <label className="text-sm text-stone-700 mb-2 block">
                প্রকল্পের কভার ছবি
              </label>
              <div className="relative">
                {application?.farmImage ? (
                  <div className="relative w-full h-40 lg:h-48 rounded-md overflow-hidden bg-stone-100">
                    <Image
                      src={application.farmImage}
                      alt="প্রকল্পের কভার ছবি"
                      fill
                      className="object-cover"
                      sizes="100vw"
                    />
                    {isEditable && (
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center group">
                        <label className="hidden group-hover:flex items-center gap-2 text-white text-sm px-3 lg:px-4 py-2 bg-emerald-900/90 rounded-lg cursor-pointer hover:bg-emerald-800 transition-colors">
                          <Upload className="w-4 h-4" />
                          ছবি পরিবর্তন করুন
                          <input
                            type="file"
                            accept="image/*"
                            className="sr-only"
                            onChange={handleImageUpload}
                            disabled={updateMutation.isPending}
                          />
                        </label>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="relative w-full h-40 lg:h-48 rounded-md border-2 border-dashed border-stone-300 bg-stone-50 flex items-center justify-center group">
                    <div className="flex flex-col items-center gap-2 text-stone-400">
                      <ImageIcon className="w-8 lg:w-10 h-8 lg:h-10" strokeWidth={1.5} />
                      <span className="text-sm">কভার ছবি নেই</span>
                      {isEditable && (
                        <label className="text-emerald-900 hover:text-emerald-700 text-sm font-medium cursor-pointer px-3 lg:px-4 py-2 border border-emerald-300 bg-white rounded-lg transition-colors">
                          ছবি আপলোড করুন
                          <input
                            type="file"
                            accept="image/*"
                            className="sr-only"
                            onChange={handleImageUpload}
                            disabled={updateMutation.isPending}
                          />
                        </label>
                      )}
                    </div>
                  </div>
                )}
                {application?.farmImage && isEditable && (
                  <button
                    type="button"
                    className="absolute top-2 right-2 p-1.5 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors"
                    onClick={handleRemoveImage}
                    title="ছবি সরান"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
              <input type="hidden" {...register("farmImage")} />
              <FieldError error={errors.farmImage} />
              <p className="mt-1 text-xs text-stone-400">
                {isEditable ? "ফার্ম বা ফসলের ছবি আপলোড করুন। এটি ঐচ্ছিক।" : "এই প্রজেক্টের জন্য কভার ছবি নেই।"}
              </p>
            </div>

            {/* BASIC INFO */}
            <div className="space-y-5">
              <div>
                <Field
                  label="প্রকল্পের শিরোনাম *"
                  placeholder="প্রকল্পের নাম লিখুন"
                  readOnly={!isEditable || updateMutation.isPending}
                  {...register("projectTitle")}
                />
                <FieldError error={errors.projectTitle} />
              </div>

              <div>
                <label className="text-sm text-stone-700 block mb-1.5">প্রকল্পের বিবরণ *</label>
                <textarea
                  rows={4}
                  placeholder="প্রকল্প সম্পর্কে বিস্তারিত লিখুন..."
                  readOnly={!isEditable || updateMutation.isPending}
                  className="w-full border border-stone-300 px-3 py-2.5 text-sm outline-none focus:border-emerald-700 resize-none disabled:bg-stone-50 disabled:cursor-not-allowed"
                  {...register("projectDescription")}
                />
                <FieldError error={errors.projectDescription} />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-5">
                <div>
                  <Field
                    label="ফসল / প্রকল্পের ধরন"
                    placeholder="যেমন: বোরো ধান"
                    readOnly={!isEditable || updateMutation.isPending}
                    {...register("cropType")}
                  />
                  <FieldError error={errors.cropType} />
                </div>
                <div>
                  <Field
                    label="খামারের ঠিকানা *"
                    placeholder="জেলা, উপজেলা, গ্রাম"
                    readOnly={!isEditable || updateMutation.isPending}
                    {...register("location")}
                  />
                  <FieldError error={errors.location} />
                </div>
              </div>
            </div>

            {/* FARM DETAILS & FUNDING */}
            <div>
              <h2 className="text-lg text-stone-900 mb-4">খামার ও ফান্ডের বিবরণ</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-5">
                <div>
                  <Field
                    label="জমির পরিমাণ (বিঘা/শতাংশ) *"
                    placeholder="যেমন: ৩"
                    type="number"
                    step="0.01"
                    min="0.01"
                    readOnly={!isEditable || updateMutation.isPending}
                    {...register("landArea")}
                  />
                  <FieldError error={errors.landArea} />
                </div>
                <div>
                  <Field
                    label="মেয়াদ (মাস) *"
                    placeholder="যেমন: ৬"
                    type="number"
                    min="1"
                    readOnly={!isEditable || updateMutation.isPending}
                    {...register("durationMonths")}
                  />
                  <FieldError error={errors.durationMonths} />
                </div>
                <div>
                  <Field
                    label="প্রত্যাশিত ফসল কাটার তারিখ *"
                    type="date"
                    readOnly={!isEditable || updateMutation.isPending}
                    {...register("expectedHarvestDate")}
                  />
                  <FieldError error={errors.expectedHarvestDate} />
                </div>
                <div>
                  <Field
                    label="প্রস্তাবিত লোনের পরিমাণ (৳) *"
                    placeholder="যেমন: 500000"
                    type="number"
                    min="1"
                    step="1000"
                    readOnly={!isEditable || updateMutation.isPending}
                    {...register("requestedAmount")}
                  />
                  <FieldError error={errors.requestedAmount} />
                </div>
              </div>
            </div>

            {/* ACTIONS */}
            <div className="pt-4 lg:pt-6 border-t border-stone-200 flex flex-col sm:flex-row sm:items-center gap-3">
              {isEditable ? (
                <>
                  <button
                    type="submit"
                    disabled={updateMutation.isPending || isSubmitting}
                    className="bg-emerald-900 text-white px-4 lg:px-6 py-3 text-sm hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-60 transition-colors flex items-center justify-center gap-2"
                  >
                    {updateMutation.isPending ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        সংরক্ষণ করা হচ্ছে...
                      </>
                    ) : (
                      "পরিবর্তন সংরক্ষণ করুন"
                    )}
                  </button>
                  <Link
                    href={`/farmer/projects/${id}`}
                    className="text-sm text-stone-500 hover:text-stone-800 transition-colors"
                  >
                    বাতিল করুন
                  </Link>
                </>
              ) : (
                <Link
                  href={`/farmer/projects/${id}`}
                  className="w-full sm:w-auto bg-stone-200 text-stone-700 px-4 lg:px-6 py-3 text-sm hover:bg-stone-300 transition-colors text-center"
                >
                  প্রজেক্ট দেখুন
                </Link>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}