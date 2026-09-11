import { Request, Response } from "express";
import mongoose from "mongoose";
import { LoanApplication } from "../models/LoanApplication";
import { LoanProduct } from "../models/LoanProduct";
import { FarmerProfile } from "../models/FarmerProfile";
import { VerificationStatus, LoanApplicationStatus } from "../utils/constants";
import { AppError } from "../middlewares/errorHandler";
import { CreateLoanApplicationInput } from "../validators/farmer.validator";
import { getPagination, buildMeta } from "../utils/pagination";

/**
 * POST /api/farmers/loan-applications
 * A farmer can only apply once their identity/land documents are Approved.
 */
export async function createApplication(req: Request, res: Response): Promise<void> {
  const body = req.body as CreateLoanApplicationInput;

  const profile = await FarmerProfile.findOne({ user: req.user!._id });
  if (!profile || profile.verificationStatus !== VerificationStatus.APPROVED) {
    throw new AppError("Complete document verification before applying for a loan", 403);
  }

  if (!mongoose.isValidObjectId(body.loanProduct)) {
    throw new AppError("Invalid loanProduct id", 400);
  }

  const loanProduct = await LoanProduct.findById(body.loanProduct);
  if (!loanProduct || !loanProduct.isActive) {
    throw new AppError("Loan product not found or no longer available", 404);
  }

  if (body.requestedAmount < loanProduct.minAmount || body.requestedAmount > loanProduct.maxAmount) {
    throw new AppError(
      `requestedAmount must be between ${loanProduct.minAmount} and ${loanProduct.maxAmount} for this product`,
      400
    );
  }

  if (body.durationMonths > loanProduct.maxDurationMonths) {
    throw new AppError(`durationMonths cannot exceed ${loanProduct.maxDurationMonths} for this product`, 400);
  }

  const application = await LoanApplication.create({
    farmer: req.user!._id,
    loanProduct: loanProduct._id,
    requestedAmount: body.requestedAmount,
    durationMonths: body.durationMonths,
    projectTitle: body.projectTitle,
    projectDescription: body.projectDescription,
    cropType: body.cropType,
    status: LoanApplicationStatus.PENDING,
  });

  // TODO once Admin routes exist: emit `loan:new_application` to the admin
  // room and create a Notification, so the review queue updates live.

  res.status(201).json({ application });
}

/**
 * GET /api/farmers/loan-applications?status=&page=&limit=
 */
export async function listMyApplications(req: Request, res: Response): Promise<void> {
  const { status } = req.query as { status?: LoanApplicationStatus };
  const pagination = getPagination(req);

  const filter: Record<string, unknown> = { farmer: req.user!._id };
  if (status) {
    if (!Object.values(LoanApplicationStatus).includes(status)) {
      throw new AppError("Invalid status filter", 400);
    }
    filter.status = status;
  }

  const [applications, total] = await Promise.all([
    LoanApplication.find(filter)
      .populate("loanProduct", "name category interestRatePercent")
      .sort({ createdAt: -1 })
      .skip(pagination.skip)
      .limit(pagination.limit),
    LoanApplication.countDocuments(filter),
  ]);

  res.json({ applications, meta: buildMeta(total, pagination) });
}

/**
 * GET /api/farmers/loan-applications/:id
 */
export async function getMyApplicationById(req: Request, res: Response): Promise<void> {
  const { id } = req.params;
  if (!mongoose.isValidObjectId(id)) {
    throw new AppError("Invalid application id", 400);
  }

  const application = await LoanApplication.findOne({ _id: id, farmer: req.user!._id }).populate(
    "loanProduct",
    "name category interestRatePercent maxDurationMonths"
  );

  if (!application) {
    throw new AppError("Loan application not found", 404);
  }

  res.json({ application });
}
