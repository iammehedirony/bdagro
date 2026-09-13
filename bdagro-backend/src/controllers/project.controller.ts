import { Request, Response } from "express";
import mongoose from "mongoose";
import { Project } from "../models/Project";
import { ProjectStatus, RiskLevel } from "../utils/constants";
import { AppError } from "../middlewares/errorHandler";
import { getPagination, buildMeta } from "../utils/pagination";

/**
 * GET /api/projects?cropType=&riskLevel=&status=&location=&minROI=&maxROI=&search=&sort=&page=&limit=
 * The investor "প্রোজেক্ট মার্কেটপ্লেস" — browse verified farmers' live,
 * fundable projects, filterable by crop type, risk level, location, expected ROI, and search.
 * Supports multiple sort options.
 */
export async function listProjects(req: Request, res: Response): Promise<void> {
  const { cropType, riskLevel, status, location, minROI, maxROI, search, sort } = req.query as {
    cropType?: string;
    riskLevel?: RiskLevel;
    status?: string;
    location?: string;
    minROI?: number;
    maxROI?: number;
    search?: string;
    sort?: string;
  };
  const pagination = getPagination(req);

  // Default: only show open/partially funded projects
  const filter: Record<string, unknown> = {};

  // Status filter - default to open projects only
  if (status) {
    filter.status = status;
  } else {
    filter.status = { $in: [ProjectStatus.OPEN, ProjectStatus.PARTIALLY_FUNDED] };
  }

  if (cropType) filter.cropType = new RegExp(cropType.trim(), "i");
  if (riskLevel) filter.riskLevel = riskLevel;

  // Location filter (search in title or description or farmer location)
  if (location) {
    filter.$or = [
      { title: new RegExp(location.trim(), "i") },
      { description: new RegExp(location.trim(), "i") },
    ];
  }

  // Search filter
  if (search) {
    filter.$or = [
      { title: new RegExp(search.trim(), "i") },
      { description: new RegExp(search.trim(), "i") },
      { cropType: new RegExp(search.trim(), "i") },
    ];
  }

  if (minROI !== undefined || maxROI !== undefined) {
    const roiFilter: Record<string, number> = {};
    if (minROI !== undefined) roiFilter.$gte = minROI;
    if (maxROI !== undefined) roiFilter.$lte = maxROI;
    filter.expectedROIPercent = roiFilter;
  }

  // Sort options
  let sortOption: Record<string, 1 | -1> = { createdAt: -1 }; // default: newest first
  if (sort === "roi_desc") sortOption = { expectedROIPercent: -1 };
  else if (sort === "roi_asc") sortOption = { expectedROIPercent: 1 };
  else if (sort === "newest") sortOption = { createdAt: -1 };
  else if (sort === "oldest") sortOption = { createdAt: 1 };
  else if (sort === "funding_desc") sortOption = { fundedAmount: -1 };
  else if (sort === "funding_asc") sortOption = { fundedAmount: 1 };

  const [projects, total] = await Promise.all([
    Project.find(filter)
      .populate("farmer", "name avatarUrl")
      .sort(sortOption)
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
