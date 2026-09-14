import { Request, Response } from "express";
import { FarmerProfile } from "../models/FarmerProfile";
import { VerificationStatus } from "../utils/constants";
import { AppError } from "../middlewares/errorHandler";
import { uploadToCloudinary } from "../middlewares/upload";
import { SubmitFarmerProfileInput } from "../validators/farmer.validator";
import { clerkClient, getAuth } from "@clerk/express";

type UploadedFiles = { [fieldname: string]: Express.Multer.File[] } | undefined;

/**
 * GET /api/farmers/profile/me
 */
export async function getMyProfile(req: Request, res: Response): Promise<void> {
  const profile = await FarmerProfile.findOne({ user: req.user!._id });
  if (!profile) {
    throw new AppError("No farmer profile submitted yet", 404);
  }
  res.json({ profile });
}

/**
 * PUT /api/farmers/profile
 * Creates the profile on first submission, or resubmits it (e.g. after a
 * rejection). Once `verificationStatus` is APPROVED, edits are blocked —
 * changing verified identity/land documents needs an Admin-mediated flow,
 * not a silent self-edit.
 */
export async function submitProfile(req: Request, res: Response): Promise<void> {
  const body = req.body as SubmitFarmerProfileInput;
  const files = req.files as UploadedFiles;
  const { userId } = getAuth(req);

  if (!userId) {
    throw new AppError("Authentication required", 401);
  }

  const nidFrontFile = files?.nidFront?.[0];
  const nidBackFile = files?.nidBack?.[0];

  const existing = await FarmerProfile.findOne({ user: req.user!._id });

  if (existing && existing.verificationStatus === VerificationStatus.APPROVED) {
    throw new AppError("Profile is already verified and can no longer be self-edited. Contact support.", 409);
  }

  if (!existing && (!nidFrontFile || !nidBackFile)) {
    throw new AppError("Both nidFrontFile and nidBackFile are required for first submission", 400);
  }

  const [nidFrontUpload, nidBackUpload] = await Promise.all([
    nidFrontFile ? uploadToCloudinary(nidFrontFile, req.user!._id.toString()) : undefined,
    nidBackFile ? uploadToCloudinary(nidBackFile, req.user!._id.toString()) : undefined,
  ]);

  await clerkClient.users.updateUserMetadata(userId, {
      publicMetadata: {
        nidStatus: "submitted"
      },
    });

  const update = {
    nidNumber: body.nidNumber,
    nidName: body.nidName,
    address: {
      district: body.address.district,
      upazila: body.address.upazila,
      village: body.address.village,
      fullAddress: body.address.fullAddress,
    },
    dob: body.dob,
    nidImageUrl: [
      nidFrontUpload?.secure_url ?? existing?.nidImageUrl[0],
      nidBackUpload?.secure_url ?? existing?.nidImageUrl[1],
    ],
    verificationStatus: VerificationStatus.PENDING,
    verifiedBy: null,
    verifiedAt: null,
    rejectionReason: null,
  };

  const profile = await FarmerProfile.findOneAndUpdate({ user: req.user!._id }, update, {
    new: true,
    upsert: true,
    setDefaultsOnInsert: true,
    runValidators: true,
  });

  // TODO once Admin routes exist: notify admins (Notification + Socket.io
  // `verification:new_submission`) that a new/updated profile needs review.

  res.status(existing ? 200 : 201).json({ profile });
}
