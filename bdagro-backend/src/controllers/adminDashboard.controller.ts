import { Request, Response } from "express";
import { User } from "../models/User";
import { FarmerProfile } from "../models/FarmerProfile";
import { LoanApplication } from "../models/LoanApplication";
import { Project } from "../models/Project";
import { Investment } from "../models/Investment";
import { Transaction } from "../models/Transaction";
import {
  UserRole,
  VerificationStatus,
  LoanApplicationStatus,
  InvestmentStatus,
  TransactionType,
  TransactionStatus,
  ProjectStatus,
} from "../utils/constants";

/**
 * GET /api/admin/dashboard
 * The "সেন্ট্রাল ড্যাশবোর্ড" — platform-wide totals for users, loans,
 * investments, and the two review queues (verifications, loan applications).
 */
export async function getDashboard(_req: Request, res: Response): Promise<void> {
  const [
    totalFarmers,
    totalInvestors,
    pendingVerifications,
    pendingLoanApplications,
    openProjects,
    disbursementAgg,
    investmentAgg,
  ] = await Promise.all([
    User.countDocuments({ role: UserRole.FARMER }),
    User.countDocuments({ role: UserRole.INVESTOR }),
    FarmerProfile.countDocuments({ verificationStatus: VerificationStatus.PENDING }),
    LoanApplication.countDocuments({
      status: { $in: [LoanApplicationStatus.PENDING, LoanApplicationStatus.PROCESSING] },
    }),
    Project.countDocuments({ status: { $in: [ProjectStatus.OPEN, ProjectStatus.PARTIALLY_FUNDED] } }),
    Transaction.aggregate([
      { $match: { type: TransactionType.LOAN_DISBURSEMENT, status: TransactionStatus.SUCCESS } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]),
    Investment.aggregate([
      { $match: { status: InvestmentStatus.COMPLETED } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]),
  ]);

  res.json({
    stats: {
      totalFarmers,
      totalInvestors,
      pendingVerifications,
      pendingLoanApplications,
      openProjects,
      totalLoanDisbursed: disbursementAgg[0]?.total ?? 0,
      totalInvested: investmentAgg[0]?.total ?? 0,
    },
  });
}
