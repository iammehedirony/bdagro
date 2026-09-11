import { Request, Response } from "express";
import { Investment } from "../models/Investment";
import { InvestmentStatus } from "../utils/constants";

interface PortfolioAggregate {
  totalInvested: number;
  totalReturned: number;
  projectIds: unknown[];
}

/**
 * GET /api/investors/portfolio
 * The "পোর্টফোলিও ড্যাশবোর্ড" — total invested, distinct running projects,
 * and ROI-to-date, computed live from completed Investments (rather than
 * trusting only the denormalized InvestorProfile counters).
 */
export async function getPortfolio(req: Request, res: Response): Promise<void> {
  const investorId = req.user!._id;

  const [totals] = await Investment.aggregate<PortfolioAggregate>([
    { $match: { investor: investorId, status: InvestmentStatus.COMPLETED } },
    {
      $group: {
        _id: null,
        totalInvested: { $sum: "$amount" },
        totalReturned: { $sum: "$returnAmount" },
        projectIds: { $addToSet: "$project" },
      },
    },
  ]);

  const recentInvestments = await Investment.find({ investor: investorId })
    .populate("project", "title cropType riskLevel expectedROIPercent status")
    .sort({ createdAt: -1 })
    .limit(5);

  res.json({
    portfolio: {
      totalInvested: totals?.totalInvested ?? 0,
      totalReturned: totals?.totalReturned ?? 0,
      activeProjectsCount: totals?.projectIds?.length ?? 0,
    },
    recentInvestments,
  });
}
