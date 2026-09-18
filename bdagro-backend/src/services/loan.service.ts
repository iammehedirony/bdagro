import type { HydratedDocument } from "mongoose";
import { LoanApplication } from "../models/LoanApplication";
import { LoanProduct } from "../models/LoanProduct";
import { ProfitDistribution } from "../models/ProfitDistribution";
import { Transaction } from "../models/Transaction";
import { IProject } from "../models/Project";
import {
  ProfitDistributionStatus,
  TransactionType,
  TransactionStatus,
  ProjectStatus,
  PaymentMethod,
} from "../utils/constants";
import { AppError } from "../middlewares/errorHandler";

/**
 * Disburses a fully funded project's loan to the farmer:
 * 1. Records the disbursement as a SUCCESS Transaction (this is the
 *    platform paying the farmer, not a gateway checkout — see the
 *    paymentMethod note below).
 * 2. Generates the profit distribution schedule — flat simple
 *    interest (loan product's annual rate, prorated by the application's
 *    chosen duration), spread evenly across the months.
 * 3. Closes the Project (funding period ended / loan disbursed).
 */
export async function disburseLoan(project: HydratedDocument<IProject>): Promise<void> {
  if (project.status !== ProjectStatus.FULLY_FUNDED) {
    throw new AppError("Only a fully funded project can be disbursed", 409);
  }

  const application = await LoanApplication.findById(project.loanApplication);
  if (!application) {
    throw new AppError("Underlying loan application not found", 404);
  }

  const loanProduct = await LoanProduct.findById(application.loanProduct);
  if (!loanProduct) {
    throw new AppError("Underlying loan product not found", 404);
  }

  const alreadyScheduled = await ProfitDistribution.countDocuments({ project: project._id });
  if (alreadyScheduled > 0) {
    throw new AppError("Profit distribution schedule already exists for this project", 409);
  }

  const principal = application.requestedAmount;
  const durationMonths = application.durationMonths;
  // Flat simple interest: annual rate applied pro-rata to the chosen duration.
  const totalDistribution = principal * (loanProduct.profitSharePercent / 100);
  const baseDistribution = Math.floor((totalDistribution / durationMonths) * 100) / 100;

  const disbursedAt = new Date();
  const distributions = [];
  let accounted = 0;

  for (let i = 1; i <= durationMonths; i++) {
    const dueDate = new Date(disbursedAt);
    dueDate.setMonth(dueDate.getMonth() + i);

    // Roll any rounding remainder into the final distribution.
    const amount = i === durationMonths ? Math.round((totalDistribution - accounted) * 100) / 100 : baseDistribution;
    accounted += amount;

    distributions.push({
      project: project._id,
      farmer: application.farmer,
      distributionNumber: i,
      dueDate,
      amount,
      status: ProfitDistributionStatus.PENDING,
    });
  }

  await ProfitDistribution.insertMany(distributions);

  project.expectedHarvestDate = distributions[distributions.length - 1].dueDate;

  await Transaction.create({
    user: application.farmer,
    type: TransactionType.LOAN_DISBURSEMENT,
    amount: principal,
    // This is an internal platform payout (e.g. bank/mobile-banking
    // transfer), not a gateway checkout — SSLCOMMERZ is used here only
    // as a placeholder enum value for record-keeping, since the
    // Transaction schema requires a paymentMethod.
    paymentMethod: PaymentMethod.SSLCOMMERZ,
    status: TransactionStatus.SUCCESS,
    relatedLoanApplication: application._id,
  });

  project.status = ProjectStatus.CLOSED;
  await project.save();
}
