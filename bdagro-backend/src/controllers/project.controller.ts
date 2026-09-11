import { Request, Response } from "express";
import mongoose from "mongoose";
import { Project } from "../models/Project";
import { ProjectStatus, RiskLevel } from "../utils/constants";
import { AppError } from "../middlewares/errorHandler";
import { getPagination, buildMeta } from "../utils/pagination";

/**
 * GET /api/projects?cropType=&riskLevel=&minROI=&maxROI=&page=&limit=
 * The investor "প্রোজেক্ট মার্কেটপ্লেস" — browse verified farmers' live,
 * fundable projects, filterable by crop type, risk level and expected ROI.
 * Only shows projects still accepting investment (OPEN / PARTIALLY_FUNDED);
 * fully funded / closed projects are reachable via GET /:id but not listed.
 */
export async function listProjects(req: Request, res: Response): Promise<void> {
  const { cropType, riskLevel, minROI, maxROI } = req.query as {
    cropType?: string;
    riskLevel?: RiskLevel;
    minROI?: number;
    maxROI?: number;
  };
  const pagination = getPagination(req);

  const filter: Record<string, unknown> = {
    status: { $in: [ProjectStatus.OPEN, ProjectStatus.PARTIALLY_FUNDED] },
  };
  if (cropType) filter.cropType = new RegExp(cropType.trim(), "i");
  if (riskLevel) filter.riskLevel = riskLevel;
  if (minROI !== undefined || maxROI !== undefined) {
    const roiFilter: Record<string, number> = {};
    if (minROI !== undefined) roiFilter.$gte = minROI;
    if (maxROI !== undefined) roiFilter.$lte = maxROI;
    filter.expectedROIPercent = roiFilter;
  }

  const [projects, total] = await Promise.all([
    Project.find(filter)
      .populate("farmer", "name avatarUrl")
      .sort({ createdAt: -1 })
      .skip(pagination.skip)
      .limit(pagination.limit),
    Project.countDocuments(filter),
  ]);

  res.json({ projects, meta: buildMeta(total, pagination) });
}

/**
 * GET /api/projects/:id
 */
export async function getProjectById(req: Request, res: Response): Promise<void> {
  const { id } = req.params;
  if (!mongoose.isValidObjectId(id)) {
    throw new AppError("Invalid project id", 400);
  }

  const project = await Project.findById(id).populate("farmer", "name avatarUrl");
  if (!project) {
    throw new AppError("Project not found", 404);
  }

  res.json({ project });
}
