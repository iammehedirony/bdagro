import { Investment } from "../models/Investment";
import { Project } from "../models/Project";
import { InvestorProfile } from "../models/InvestorProfile";
import { InvestmentStatus, NotificationType, ProjectStatus } from "../utils/constants";
import { notifyUser } from "./notification.service";

/**
 * Marks a pending Investment as COMPLETED and applies its effects:
 * increments the Project's fundedAmount (and flips its status once fully
 * funded), and rolls the amount into the InvestorProfile's totals.
 *
 * NOT wired to any route yet — this is the intended call site for the
 * SSLCommerz/Stripe payment webhook (roadmap item #5), once that lands.
 * Calling it anywhere the payment hasn't actually succeeded would let an
 * investor claim a funded project without paying, so it must only ever
 * be triggered by a verified gateway webhook, not client input.
 */
export async function confirmInvestment(investmentId: string): Promise<void> {
  const investment = await Investment.findById(investmentId);
  if (!investment || investment.status !== InvestmentStatus.PENDING) {
    return;
  }

  investment.status = InvestmentStatus.COMPLETED;
  await investment.save();

  const project = await Project.findById(investment.project);
  if (project) {
    project.fundedAmount += investment.amount;
    project.status =
      project.fundedAmount >= project.fundingGoal ? ProjectStatus.FULLY_FUNDED : ProjectStatus.PARTIALLY_FUNDED;
    await project.save();

    await notifyUser(project.farmer, {
      title: "Project funding received",
      message: `Your project received an investment of ${investment.amount}.`,
      type: NotificationType.FUNDING,
      meta: { projectId: project._id, investmentId: investment._id },
    });
  }

  await notifyUser(investment.investor, {
    title: "Investment successful",
    message: `Your investment of ${investment.amount} was completed successfully.`,
    type: NotificationType.INVESTMENT,
    meta: { projectId: investment.project, investmentId: investment._id },
  });

  // Count distinct funded projects for this investor, rather than a naive
  // increment, so investing twice in the same project doesn't inflate
  // activeProjectsCount.
  const distinctProjectIds = await Investment.distinct("project", {
    investor: investment.investor,
    status: InvestmentStatus.COMPLETED,
  });

  await InvestorProfile.findOneAndUpdate(
    { user: investment.investor },
    {
      $inc: { totalInvested: investment.amount },
      $set: { activeProjectsCount: distinctProjectIds.length },
    },
    { upsert: true, setDefaultsOnInsert: true }
  );
}
