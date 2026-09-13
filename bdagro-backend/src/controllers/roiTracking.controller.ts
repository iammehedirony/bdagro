import { Request, Response } from "express";
import { Investment } from "../models/Investment";
import { Transaction } from "../models/Transaction";
import { TransactionType, TransactionStatus } from "../utils/constants";

interface MonthlyROI {
  month: string;
  year: number;
  amount: number;
  count: number;
}

interface ProjectROI {
  projectId: string;
  projectTitle: string;
  invested: number;
  earned: number;
  roi: number;
  status: string;
}

/**
 * GET /api/investors/roi-tracking
 * Returns monthly ROI chart data and per-project ROI breakdown
 */
export async function getROITracking(req: Request, res: Response): Promise<void> {
  const investorId = req.user!._id;

  // Get all investments for this investor
  const investments = await Investment.find({ investor: investorId })
    .populate("project", "title status")
    .lean();

  // Get all transactions related to returns (profit distributions)
  const transactions = await Transaction.find({
    user: investorId,
    type: TransactionType.INVESTMENT,
    status: TransactionStatus.SUCCESS,
    relatedInvestment: { $in: investments.map((inv) => inv._id) },
  })
    .sort({ createdAt: 1 })
    .lean();

  // Calculate monthly ROI data for the last 12 months
  const monthlyData: MonthlyROI[] = [];
  const now = new Date();

  for (let i = 11; i >= 0; i--) {
    const targetDate = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const monthStart = new Date(targetDate.getFullYear(), targetDate.getMonth(), 1);
    const monthEnd = new Date(targetDate.getFullYear(), targetDate.getMonth() + 1, 0, 23, 59, 59);

    const monthTransactions = transactions.filter(
      (t) => new Date(t.createdAt) >= monthStart && new Date(t.createdAt) <= monthEnd
    );

    const monthlyAmount = monthTransactions.reduce((sum, t) => {
      // Calculate profit portion (difference between return and principal)
      const investment = investments.find((inv) => inv._id.toString() === t.relatedInvestment?.toString());
      if (investment) {
        // Assume transactions include both principal + profit
        // For ROI tracking, we only want the profit portion
        const profit = t.amount - investment.amount;
        return sum + Math.max(profit, 0);
      }
      return sum;
    }, 0);

    monthlyData.push({
      month: targetDate.toLocaleString("en-US", { month: "short" }),
      year: targetDate.getFullYear(),
      amount: Math.round(monthlyAmount),
      count: monthTransactions.length,
    });
  }

  // Calculate per-project ROI
  const projectROIs: ProjectROI[] = await Promise.all(
    investments.map(async (investment) => {
      // Get all return transactions for this investment
      const returnTransactions = await Transaction.find({
        user: investorId,
        relatedInvestment: investment._id,
        type: TransactionType.INVESTMENT,
        status: TransactionStatus.SUCCESS,
      }).lean();

      const totalReturns = returnTransactions.reduce((sum, t) => sum + t.amount, 0);
      const profit = totalReturns - investment.amount;
      const roiPercent = investment.amount > 0 ? (profit / investment.amount) * 100 : 0;

      return {
        projectId: investment.project._id.toString(),
        projectTitle: (investment.project as any)?.title || "Unknown Project",
        invested: investment.amount,
        earned: Math.round(profit),
        roi: Math.round(roiPercent * 10) / 10, // Round to 1 decimal
        status: (investment.project as any)?.status || investment.status,
      };
    })
  );

  // Calculate summary stats
  const totalEarned = projectROIs.reduce((sum, p) => sum + p.earned, 0);
  const totalInvested = projectROIs.reduce((sum, p) => sum + p.invested, 0);
  const averageROI = totalInvested > 0 ? (totalEarned / totalInvested) * 100 : 0;
  const topPerformer = projectROIs.reduce(
    (max, p) => (p.roi > max.roi ? p : max),
    { projectTitle: "N/A", roi: 0 }
  );

  res.json({
    summary: {
      totalEarned: Math.round(totalEarned),
      averageROI: Math.round(averageROI * 10) / 10,
      topPerformer: topPerformer.projectTitle,
      topPerformerROI: topPerformer.roi,
      completedPayouts: transactions.length,
    },
    monthlyData,
    projectROIs,
  });
}
