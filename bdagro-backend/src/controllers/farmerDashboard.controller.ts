import { Request, Response } from "express";
import { LoanApplication } from "../models/LoanApplication";
import { Project } from "../models/Project";
import { Investment } from "../models/Investment";
import { Notification } from "../models/Notification";
import { LoanApplicationStatus, ProjectStatus } from "../utils/constants";

/**
 * GET /api/farmers/dashboard
 * Returns aggregated dashboard summary for the farmer:
 * - Active projects count
 * - Total funds raised across all projects
 * - Total unique investors count
 * - Recent activity feed
 */
export async function getFarmerDashboard(req: Request, res: Response): Promise<void> {
  const farmerId = req.user!._id;

  // Get all loan applications for this farmer
  const applications = await LoanApplication.find({ farmer: farmerId }).lean();

  // Get approved applications that have marketplace projects
  const approvedApplicationIds = applications
    .filter((app) => app.status === LoanApplicationStatus.APPROVED)
    .map((app) => app._id);

  const projects = await Project.find({
    loanApplication: { $in: approvedApplicationIds },
  }).lean();

  // Calculate stats
  const activeProjectsCount = projects.filter(
    (p) => p.status === ProjectStatus.OPEN || p.status === ProjectStatus.PARTIALLY_FUNDED
  ).length;

  const pendingApplicationsCount = applications.filter(
    (app) => app.status === LoanApplicationStatus.PENDING
  ).length;

  const totalFundsRaised = projects.reduce((sum, p) => sum + p.fundedAmount, 0);

  // Get unique investors across all farmer's projects
  const projectIds = projects.map((p) => p._id);
  const investments = await Investment.find({
    project: { $in: projectIds },
  })
    .select("investor")
    .lean();

  const uniqueInvestors = new Set(investments.map((inv) => inv.investor.toString()));
  const totalInvestorsCount = uniqueInvestors.size;

  // Get recent activity (recent investments + notifications)
  const recentInvestments = await Investment.find({
    project: { $in: projectIds },
  })
    .populate("investor", "name")
    .populate("project", "title")
    .sort({ createdAt: -1 })
    .limit(5)
    .lean();

  const recentNotifications = await Notification.find({
    user: farmerId,
  })
    .sort({ createdAt: -1 })
    .limit(5)
    .lean();

  // Combine and sort activity feed
  const activityFeed = [
    ...recentInvestments.map((inv) => ({
      type: "investment",
      text: `${(inv.project as any)?.title || "প্রকল্প"}-এ নতুন বিনিয়োগ পেয়েছেন ৳${inv.amount.toLocaleString()}`,
      time: inv.createdAt,
      meta: inv,
    })),
    ...recentNotifications.map((notif) => ({
      type: "notification",
      text: notif.message,
      time: notif.createdAt,
      meta: notif,
    })),
  ]
    .sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())
    .slice(0, 10);

  // Get project summaries for dashboard display
  const projectSummaries = await Promise.all(
    projects.slice(0, 5).map(async (project) => {
      const investorCount = await Investment.countDocuments({ project: project._id });
      return {
        _id: project._id,
        title: project.title,
        cropType: project.cropType,
        fundingGoal: project.fundingGoal,
        fundedAmount: project.fundedAmount,
        fundingPercent: Math.round((project.fundedAmount / project.fundingGoal) * 100),
        status: project.status,
        investorCount,
      };
    })
  );

  res.json({
    summary: {
      activeProjectsCount,
      pendingApplicationsCount,
      totalFundsRaised,
      totalInvestorsCount,
    },
    projectSummaries,
    activityFeed,
  });
}
