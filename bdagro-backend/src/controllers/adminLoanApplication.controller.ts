import { Request, Response } from "express";
import mongoose, { HydratedDocument } from "mongoose";
import { LoanApplication, ILoanApplication } from "../models/LoanApplication";
import { Project } from "../models/Project";
import { LoanApplicationStatus } from "../utils/constants";
import { AppError } from "../middlewares/errorHandler";
import { getPagination, buildMeta } from "../utils/pagination";
import { notifyUser } from "../services/notification.service";
import { getIo } from "../realtime/io";
import { ApproveLoanApplicationInput, RejectInput } from "../validators/admin.validator";

/**
 * GET /api/admin/loan-applications?status=&page=&limit=
 */
export async function listLoanApplications(req: Request, res: Response): Promise<void> {
  const { status } = req.query as { status?: LoanApplicationStatus };
  const pagination = getPagination(req);

  const filter: Record<string, unknown> = {};
  if (status) {
    if (!Object.values(LoanApplicationStatus).includes(status)) {
      throw new AppError("Invalid status filter", 400);
    }
    filter.status = status;
  }

  const [applications, total] = await Promise.all([
    LoanApplication.find(filter)
      .populate("farmer", "name email phone")
      .populate("loanProduct", "name category")
      .sort({ createdAt: 1 })
      .skip(pagination.skip)
      .limit(pagination.limit),
    LoanApplication.countDocuments(filter),
  ]);

  res.json({ applications, meta: buildMeta(total, pagination) });
}

/**
 * GET /api/admin/loan-applications/:id
 */
export async function getLoanApplicationById(req: Request, res: Response): Promise<void> {
  const { id } = req.params;
  if (!mongoose.isValidObjectId(id)) {
    throw new AppError("Invalid application id", 400);
  }

  const application = await LoanApplication.findById(id)
    .populate("farmer", "name email phone")
    .populate("loanProduct");

  if (!application) {
    throw new AppError("Loan application not found", 404);
  }

  res.json({ application });
}

/** Notifies the farmer + pushes a live status update over Socket.io. */
async function broadcastStatusUpdate(
  application: HydratedDocument<ILoanApplication>,
  message: string
): Promise<void> {
  await notifyUser(application.farmer, {
    title: "Loan application update",
    message,
    type: "loan_status",
    meta: { loanApplicationId: application._id, status: application.status },
  });

  const io = getIo();
  io?.to(`user:${application.farmer}`).emit("loan:status_updated", {
    loanApplicationId: application._id,
    status: application.status,
  });
}

/**
 * POST /api/admin/loan-applications/:id/process
 * Optional intermediate step (Pending -> Processing) while under review,
 * matching the status set named explicitly in the PRD.
 */
export async function markProcessing(req: Request, res: Response): Promise<void> {
  const { id } = req.params;
  if (!mongoose.isValidObjectId(id)) {
    throw new AppError("Invalid application id", 400);
  }

  const application = await LoanApplication.findById(id);
  if (!application) {
    throw new AppError("Loan application not found", 404);
  }
  if (application.status !== LoanApplicationStatus.PENDING) {
    throw new AppError(`Cannot move to Processing from status ${application.status}`, 409);
  }

  application.status = LoanApplicationStatus.PROCESSING;
  application.reviewedBy = req.user!._id;
  await application.save();

  await broadcastStatusUpdate(application, "Your loan application is now being processed.");

  res.json({ application });
}

/**
 * POST /api/admin/loan-applications/:id/approve
 * Approves the application AND creates the marketplace `Project` from it
 * in the same step — this is the only place Projects get created.
 */
export async function approveLoanApplication(req: Request, res: Response): Promise<void> {
  const { id } = req.params;
  if (!mongoose.isValidObjectId(id)) {
    throw new AppError("Invalid application id", 400);
  }

  const body = req.body as ApproveLoanApplicationInput;

  const application = await LoanApplication.findById(id);
  if (!application) {
    throw new AppError("Loan application not found", 404);
  }
  if (application.status === LoanApplicationStatus.APPROVED) {
    throw new AppError("Application is already approved", 409);
  }
  if (application.status === LoanApplicationStatus.REJECTED) {
    throw new AppError("A rejected application cannot be approved", 409);
  }

  application.status = LoanApplicationStatus.APPROVED;
  application.reviewedBy = req.user!._id;
  application.reviewedAt = new Date();
  application.rejectionReason = null;
  await application.save();

  const project = await Project.create({
    loanApplication: application._id,
    farmer: application.farmer,
    title: application.projectTitle,
    description: application.projectDescription,
    cropType: body.cropType || application.cropType || "unspecified",
    riskLevel: body.riskLevel,
    expectedROIPercent: body.expectedROIPercent,
    fundingGoal: body.fundingGoal ?? application.requestedAmount,
    fundingDeadline: body.fundingDeadline ?? null,
  });

  await broadcastStatusUpdate(
    application,
    "Congratulations! Your loan application was approved and is now live on the investor marketplace."
  );

  res.json({ application, project });
}

/**
 * POST /api/admin/loan-applications/:id/reject
 */
export async function rejectLoanApplication(req: Request, res: Response): Promise<void> {
  const { id } = req.params;
  if (!mongoose.isValidObjectId(id)) {
    throw new AppError("Invalid application id", 400);
  }

  const { rejectionReason } = req.body as RejectInput;

  const application = await LoanApplication.findById(id);
  if (!application) {
    throw new AppError("Loan application not found", 404);
  }
  if (application.status === LoanApplicationStatus.APPROVED) {
    throw new AppError("An approved application cannot be rejected", 409);
  }

  application.status = LoanApplicationStatus.REJECTED;
  application.reviewedBy = req.user!._id;
  application.reviewedAt = new Date();
  application.rejectionReason = rejectionReason;
  await application.save();

  await broadcastStatusUpdate(application, `Your loan application was rejected: ${rejectionReason}`);

  res.json({ application });
}
