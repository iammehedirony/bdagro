import { Request, Response } from "express";
import mongoose from "mongoose";
import { FarmerProfile } from "../models/FarmerProfile";
import { VerificationStatus } from "../utils/constants";
import { AppError } from "../middlewares/errorHandler";
import { getPagination, buildMeta } from "../utils/pagination";
import { notifyUser } from "../services/notification.service";
import { RejectInput } from "../validators/admin.validator";
import { clerkClient, getAuth } from "@clerk/express";

/**
 * GET /api/admin/verifications?status=&page=&limit=
 * Defaults to the "Pending Verifications" review queue when no status
 * filter is given, matching the PRD's named admin screen.
 */
export async function listVerifications(req: Request, res: Response): Promise<void> {
  const { status } = req.query as { status?: VerificationStatus };
  const pagination = getPagination(req);

  const filter: Record<string, unknown> = {
    verificationStatus: status ?? VerificationStatus.PENDING,
  };
  if (status && !Object.values(VerificationStatus).includes(status)) {
    throw new AppError("Invalid status filter", 400);
  }

  const [profiles, total] = await Promise.all([
    FarmerProfile.find(filter)
      .populate("user", "name email phone")
      .sort({ createdAt: 1 }) // oldest submissions reviewed first
      .skip(pagination.skip)
      .limit(pagination.limit),
    FarmerProfile.countDocuments(filter),
  ]);

  res.json({ profiles, meta: buildMeta(total, pagination) });
}

/**
 * GET /api/admin/verifications/:id
 */
export async function getVerificationById(req: Request, res: Response): Promise<void> {
  const { id } = req.params;
  if (!mongoose.isValidObjectId(id)) {
    throw new AppError("Invalid profile id", 400);
  }

  const profile = await FarmerProfile.findById(id).populate("user", "name email phone");
  if (!profile) {
    throw new AppError("Farmer profile not found", 404);
  }

  res.json({ profile });
}

/**
 * POST /api/admin/verifications/:id/approve
 */
export async function approveVerification(req: Request, res: Response): Promise<void> {
  const { id } = req.params;
  const {userId} = getAuth(req);
  if (!mongoose.isValidObjectId(id)) {
    throw new AppError("Invalid profile id", 400);
  }

  if (!userId) {
    throw new AppError("Authentication required", 401);
  }

  const profile = await FarmerProfile.findById(id);
  if (!profile) {
    throw new AppError("Farmer profile not found", 404);
  }
  if (profile.verificationStatus === VerificationStatus.APPROVED) {
    throw new AppError("Profile is already approved", 409);
  }

  await clerkClient.users.updateUserMetadata(userId, {
  publicMetadata: {
    nidStatus: "approved",
  },
});

  profile.verificationStatus = VerificationStatus.APPROVED;
  profile.verifiedBy = req.user!._id;
  profile.verifiedAt = new Date();
  profile.rejectionReason = null;
  await profile.save();

  await notifyUser(profile.user, {
    title: "Document verification approved",
    message: "Your NID and land document have been verified. You can now apply for a loan.",
    type: "verification",
  });

  res.json({ profile });
}

/**
 * POST /api/admin/verifications/:id/reject
 */
export async function rejectVerification(req: Request, res: Response): Promise<void> {
  const { id } = req.params;
  if (!mongoose.isValidObjectId(id)) {
    throw new AppError("Invalid profile id", 400);
  }

  const { rejectionReason } = req.body as RejectInput;

  const profile = await FarmerProfile.findById(id);
  if (!profile) {
    throw new AppError("Farmer profile not found", 404);
  }
  if (profile.verificationStatus === VerificationStatus.APPROVED) {
    throw new AppError("An already-approved profile cannot be rejected directly", 409);
  }

  profile.verificationStatus = VerificationStatus.REJECTED;
  profile.verifiedBy = req.user!._id;
  profile.verifiedAt = new Date();
  profile.rejectionReason = rejectionReason;
  await profile.save();

  await notifyUser(profile.user, {
    title: "Document verification rejected",
    message: `Your submission was rejected: ${rejectionReason}`,
    type: "verification",
  });

  res.json({ profile });
}
