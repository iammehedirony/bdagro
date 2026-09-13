import { Request, Response } from "express";
import mongoose from "mongoose";
import { Installment } from "../models/Installment";
import { Investment } from "../models/Investment";
import { Project } from "../models/Project";
import { AppError } from "../middlewares/errorHandler";

/**
 * GET /api/farmers/installments/:id/recipients
 * Returns detailed breakdown of profit distribution to individual investors
 */
export async function getInstallmentRecipients(req: Request, res: Response): Promise<void> {
  const { id } = req.params;
  if (!mongoose.isValidObjectId(id)) {
    throw new AppError("Invalid installment id", 400);
  }

  const installment = await Installment.findOne({ _id: id, farmer: req.user!._id })
    .populate("loanApplication")
    .lean();

  if (!installment) {
    throw new AppError("Installment not found", 404);
  }

  // Get profit report data from metadata
  const profitReport = installment.metadata?.profitReport as any;
  if (!profitReport) {
    throw new AppError("Profit report not yet submitted for this installment", 404);
  }

  // Get the project associated with this loan application
  const project = await Project.findOne({ loanApplication: installment.loanApplication }).lean();

  if (!project) {
    throw new AppError("Associated project not found", 404);
  }

  // Get all investments for this project
  const investments = await Investment.find({ project: project._id })
    .populate("investor", "name phone")
    .lean();

  // Calculate profit share for each investor based on their investment proportion
  const totalInvested = project.fundedAmount;
  const totalProfitDue = profitReport.investorShareAmount;

  const recipients = investments.map((investment: any) => {
    const investmentProportion = investment.amount / totalInvested;
    const profitShare = Math.round(totalProfitDue * investmentProportion);

    return {
      investorId: investment.investor._id,
      investorName: investment.investor.name,
      investedAmount: investment.amount,
      profitShare,
      profitSharePercent: Math.round(investmentProportion * 100 * 10) / 10,
      paymentMethod: investment.paymentMethod || "sslcommerz",
      // Note: In a real system, payment account details would come from investor settings
      status: "pending", // All pending until the entire installment is marked as paid
    };
  });

  const summary = {
    totalRecipients: recipients.length,
    totalProfitDue,
    paidCount: 0,
    pendingCount: recipients.length,
    installmentStatus: installment.status,
  };

  res.json({ recipients, summary, profitReport });
}
