import { Request, Response } from "express";
import mongoose from "mongoose";
import { Project } from "../models/Project";
import { FarmerProfile } from "../models/FarmerProfile";
import { Investment } from "../models/Investment";
import { LoanApplication } from "../models/LoanApplication";
import { InvestmentStatus, ProjectStatus, RiskLevel } from "../utils/constants";
import { AppError } from "../middlewares/errorHandler";
import { getPagination, buildMeta } from "../utils/pagination";

/**
 * GET /api/projects?cropType=&riskLevel=&status=&location=&minROI=&maxROI=&search=&sort=&page=&limit=
 * The investor "প্রোজেক্ট মার্কেটপ্লেস" — browse verified farmers' live,
 * fundable projects, filterable by crop type, risk level, location, expected ROI, and search.
 * Supports multiple sort options.
 */
export async function listProjects(req: Request, res: Response): Promise<void> {
  const { searchQuery, sortBy, cropTypes, riskLevels, fundingStatus, locations, cropType, riskLevel, status, location, minROI, maxROI, search, sort } = req.query as {
    searchQuery?: string;
    sortBy?: string;
    cropTypes?: string;
    riskLevels?: string;
    fundingStatus?: string;
    locations?: string;
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

  const split = (value?: string) => value?.split(",").map((item) => item.trim()).filter(Boolean) ?? [];
  const selectedCropTypes = split(cropTypes || cropType);
  const selectedRiskLevels = split(riskLevels || riskLevel);
  const selectedLocations = split(locations || location);
  const selectedFundingStatuses = split(fundingStatus || status);
  const activeSearch = (searchQuery || search)?.trim();
  const conditions: Record<string, unknown>[] = [];

  if (selectedFundingStatuses.length) {
    const statuses = selectedFundingStatuses.flatMap((value) => value === "open" ? [ProjectStatus.OPEN, ProjectStatus.PARTIALLY_FUNDED] : value === "fully_funded" ? [ProjectStatus.FULLY_FUNDED] : [value]);
    conditions.push({ status: { $in: statuses } });
  } else {
    conditions.push({ status: { $in: [ProjectStatus.OPEN, ProjectStatus.PARTIALLY_FUNDED] } });
  }

  if (selectedCropTypes.length) conditions.push({ cropType: { $in: selectedCropTypes } });
  if (selectedRiskLevels.length) conditions.push({ riskLevel: { $in: selectedRiskLevels } });
  if (selectedLocations.length) conditions.push({ location: { $in: selectedLocations } });
  if (activeSearch) {
    const expression = new RegExp(activeSearch.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
    conditions.push({ $or: [{ title: expression }, { location: expression }, { cropType: expression }] });
  }

  if (minROI !== undefined || maxROI !== undefined) {
    const roiFilter: Record<string, number> = {};
    if (minROI !== undefined) roiFilter.$gte = minROI;
    if (maxROI !== undefined) roiFilter.$lte = maxROI;
    conditions.push({ expectedROIPercent: roiFilter });
  }

  const filter: Record<string, unknown> = conditions.length ? { $and: conditions } : {};

  // Sort options
  let sortOption: Record<string, 1 | -1> = { createdAt: -1 }; // default: newest first
  if (sortBy === "highest_roi" || sort === "roi_desc") sortOption = { expectedROIPercent: -1 };
  else if (sortBy === "lowest_roi" || sort === "roi_asc") sortOption = { expectedROIPercent: 1 };
  else if (sortBy === "newest" || sort === "newest") sortOption = { createdAt: -1 };
  else if (sortBy === "oldest" || sort === "oldest") sortOption = { createdAt: 1 };
  else if (sortBy === "highest_funding" || sort === "funding_desc") sortOption = { fundedAmount: -1 };
  else if (sortBy === "lowest_funding" || sort === "funding_asc") sortOption = { fundedAmount: 1 };

  const facetFilter = (excludedField: string): Record<string, unknown> => {
    const facetConditions = conditions.filter(
      (condition) => !Object.prototype.hasOwnProperty.call(condition, excludedField),
    );
    return facetConditions.length > 0 ? { $and: facetConditions } : {};
  };
  const [cropFacets, riskFacets, locationFacets, statusFacets] = await Promise.all([
    Project.aggregate([{ $match: facetFilter("cropType") }, { $group: { _id: "$cropType", count: { $sum: 1 } } }]),
    Project.aggregate([{ $match: facetFilter("riskLevel") }, { $group: { _id: "$riskLevel", count: { $sum: 1 } } }]),
    Project.aggregate([{ $match: facetFilter("location") }, { $group: { _id: "$location", count: { $sum: 1 } } }]),
    Project.aggregate([{ $match: facetFilter("status") }, { $group: { _id: "$status", count: { $sum: 1 } } }]),
  ]);

  const [projects, total] = await Promise.all([
    Project.find(filter)
      .populate("farmer", "name avatarUrl")
      .sort(sortOption)
      .skip(pagination.skip)
      .limit(pagination.limit),
    Project.countDocuments(filter),
  ]);

  res.json({
    projects,
    meta: buildMeta(total, pagination),
    facets: {
      cropTypes: Object.fromEntries(cropFacets.map((facet) => [facet._id, facet.count])),
      riskLevels: Object.fromEntries(riskFacets.map((facet) => [facet._id, facet.count])),
      locations: Object.fromEntries(locationFacets.map((facet) => [facet._id, facet.count])),
      fundingStatus: {
        open: statusFacets.filter((facet) => [ProjectStatus.OPEN, ProjectStatus.PARTIALLY_FUNDED].includes(facet._id)).reduce((sum, facet) => sum + facet.count, 0),
        fully_funded: statusFacets.find((facet) => facet._id === ProjectStatus.FULLY_FUNDED)?.count ?? 0,
      },
    },
  });
}

/**
 * GET /api/projects/:id
 */
export async function getProjectById(req: Request, res: Response): Promise<void> {
  const { id } = req.params;
  if (!mongoose.isValidObjectId(id)) {
    throw new AppError("Invalid project id", 400);
  }

  const project = await Project.findById(id).populate("farmer", "name avatarUrl createdAt").lean();
  if (!project) {
    throw new AppError("Project not found", 404);
  }

  const [application, farmerProfile, investmentSummary] = await Promise.all([
    LoanApplication.findById(project.loanApplication).select("durationMonths").lean(),
    FarmerProfile.findOne({ user: project.farmer._id }).select("farmSizeAcres").lean(),
    Investment.aggregate([
      { $match: { project: project._id, status: InvestmentStatus.COMPLETED } },
      {
        $group: {
          _id: null,
          totalRaised: { $sum: "$amount" },
          investors: { $addToSet: "$investor" },
        },
      },
      { $project: { _id: 0, totalRaised: 1, investorCount: { $size: "$investors" } } },
    ]),
  ]);

  const daysLeft = project.fundingDeadline
    ? Math.max(Math.ceil((project.fundingDeadline.getTime() - Date.now()) / 86_400_000), 0)
    : null;
  const summary = investmentSummary[0] ?? { totalRaised: project.fundedAmount, investorCount: 0 };

  res.json({
    project: {
      ...project,
      investmentSummary: {
        totalRaised: summary.totalRaised,
        investorCount: summary.investorCount,
        daysLeft,
      },
      durationMonths: application?.durationMonths ?? null,
      landAreaAcres: farmerProfile?.farmSizeAcres ?? null,
    },
  });
}
