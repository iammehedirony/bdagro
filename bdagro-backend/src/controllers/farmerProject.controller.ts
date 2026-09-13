import { Request, Response } from "express";
import mongoose from "mongoose";
import { LoanApplication } from "../models/LoanApplication";
import { Project } from "../models/Project";
import { Investment } from "../models/Investment";
import { LoanProduct } from "../models/LoanProduct";
import { FarmerProfile } from "../models/FarmerProfile";
import { VerificationStatus, LoanApplicationStatus } from "../utils/constants";
import { AppError } from "../middlewares/errorHandler";
import { CreateLoanApplicationInput, UpdateFarmerProjectInput } from "../validators/farmer.validator";
import { getPagination, buildMeta } from "../utils/pagination";

/**
 * GET /api/farmers/projects
 * Lists all projects for the farmer (combining LoanApplications and their resulting Projects).
 */
export async function listMyProjects(req: Request, res: Response): Promise<void> {
  const pagination = getPagination(req);
  const filter = { farmer: req.user!._id };

  const [applications, total] = await Promise.all([
    LoanApplication.find(filter)
      .populate("loanProduct", "name category interestRatePercent")
      .sort({ createdAt: -1 })
      .skip(pagination.skip)
      .limit(pagination.limit)
      .lean(),
    LoanApplication.countDocuments(filter),
  ]);

  // Fetch corresponding Projects for approved applications
  const applicationIds = applications.map((app) => app._id);
  const projects = await Project.find({ loanApplication: { $in: applicationIds } }).lean();

  const projectMap = new Map(projects.map((p) => [p.loanApplication.toString(), p]));

  const combinedProjects = applications.map((app) => {
    const project = projectMap.get(app._id.toString());
    return {
      ...app,
      // If a project exists, embed its marketplace stats
      marketplaceProject: project || null,
    };
  });

  res.json({ projects: combinedProjects, meta: buildMeta(total, pagination) });
}

/**
 * GET /api/farmers/projects/:id
 * Gets project details, including investor list if it is an approved Project.
 */
export async function getMyProjectById(req: Request, res: Response): Promise<void> {
  const { id } = req.params;
  if (!mongoose.isValidObjectId(id)) {
    throw new AppError("Invalid project id", 400);
  }

  const application = await LoanApplication.findOne({
    _id: id,
    farmer: req.user!._id,
  })
    .populate("loanProduct", "name category interestRatePercent maxDurationMonths")
    .lean();

  if (!application) {
    throw new AppError("Project not found", 404);
  }

  let marketplaceProject = null;
  let investments: any[] = [];

  if (application.status === LoanApplicationStatus.APPROVED) {
    marketplaceProject = await Project.findOne({ loanApplication: application._id }).lean();
    if (marketplaceProject) {
      investments = await Investment.find({ project: marketplaceProject._id })
        .populate("investor", "name")
        .sort({ createdAt: -1 })
        .lean();
    }
  }

  res.json({
    project: {
      ...application,
      marketplaceProject,
      investments,
    },
  });
}

/**
 * POST /api/farmers/projects
 * Creates a new project (which is technically a LoanApplication).
 */
export async function createMyProject(req: Request, res: Response): Promise<void> {
  const body = req.body as CreateLoanApplicationInput;

  const profile = await FarmerProfile.findOne({ user: req.user!._id });
  if (!profile || profile.verificationStatus !== VerificationStatus.APPROVED) {
    throw new AppError("Complete document verification before creating a project", 403);
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

  res.status(201).json({ project: application });
}

/**
 * PUT /api/farmers/projects/:id
 * Updates a pending project (LoanApplication).
 */
export async function updateMyProject(req: Request, res: Response): Promise<void> {
  const { id } = req.params;
  if (!mongoose.isValidObjectId(id)) {
    throw new AppError("Invalid project id", 400);
  }

  const body = req.body as UpdateFarmerProjectInput;

  const application = await LoanApplication.findOne({ _id: id, farmer: req.user!._id });
  if (!application) {
    throw new AppError("Project not found", 404);
  }

  if (application.status !== LoanApplicationStatus.PENDING) {
    throw new AppError("You can only edit projects that are in Pending status", 403);
  }

  if (body.requestedAmount || body.durationMonths) {
    const loanProduct = await LoanProduct.findById(application.loanProduct);
    if (!loanProduct) {
      throw new AppError("Associated loan product not found", 404);
    }
    const requestedAmount = body.requestedAmount ?? application.requestedAmount;
    if (requestedAmount < loanProduct.minAmount || requestedAmount > loanProduct.maxAmount) {
      throw new AppError(
        `requestedAmount must be between ${loanProduct.minAmount} and ${loanProduct.maxAmount} for this product`,
        400
      );
    }
    const durationMonths = body.durationMonths ?? application.durationMonths;
    if (durationMonths > loanProduct.maxDurationMonths) {
      throw new AppError(`durationMonths cannot exceed ${loanProduct.maxDurationMonths} for this product`, 400);
    }
  }

  if (body.requestedAmount !== undefined) application.requestedAmount = body.requestedAmount;
  if (body.durationMonths !== undefined) application.durationMonths = body.durationMonths;
  if (body.projectTitle !== undefined) application.projectTitle = body.projectTitle;
  if (body.projectDescription !== undefined) application.projectDescription = body.projectDescription;
  if (body.cropType !== undefined) application.cropType = body.cropType;

  await application.save();

  res.json({ project: application });
}
