import { Request, Response } from "express";
import mongoose from "mongoose";
import { Project } from "../models/Project";
import { ProjectStatus } from "../utils/constants";
import { AppError } from "../middlewares/errorHandler";
import { getPagination, buildMeta } from "../utils/pagination";
import { disburseLoan } from "../services/loan.service";
import { notifyUser } from "../services/notification.service";

/**
 * GET /api/admin/projects?status=&page=&limit=
 * Unlike the investor-facing GET /api/projects (which only shows
 * OPEN/PARTIALLY_FUNDED), this shows every status — including
 * FULLY_FUNDED projects awaiting disbursement and CLOSED ones.
 */
export async function listProjectsForAdmin(req: Request, res: Response): Promise<void> {
  const { status } = req.query as { status?: ProjectStatus };
  const pagination = getPagination(req);

  const filter: Record<string, unknown> = {};
  if (status) {
    if (!Object.values(ProjectStatus).includes(status)) {
      throw new AppError("Invalid status filter", 400);
    }
    filter.status = status;
  }

  const [projects, total] = await Promise.all([
    Project.find(filter)
      .populate("farmer", "name email phone")
      .sort({ createdAt: -1 })
      .skip(pagination.skip)
      .limit(pagination.limit),
    Project.countDocuments(filter),
  ]);

  res.json({ projects, meta: buildMeta(total, pagination) });
}

/**
 * POST /api/admin/projects/:id/disburse
 * Disburses a fully funded project's loan and generates its repayment
 * Installment schedule (see src/services/loan.service.ts).
 */
export async function disburseProject(req: Request, res: Response): Promise<void> {
  const { id } = req.params;
  if (!mongoose.isValidObjectId(id)) {
    throw new AppError("Invalid project id", 400);
  }

  const project = await Project.findById(id);
  if (!project) {
    throw new AppError("Project not found", 404);
  }

  await disburseLoan(project);

  await notifyUser(project.farmer, {
    title: "Loan disbursed",
    message: "Your loan has been disbursed and your repayment schedule is ready.",
    type: "loan_status",
    meta: { projectId: project._id },
  });

  res.json({ project, message: "Loan disbursed and installment schedule generated." });
}
