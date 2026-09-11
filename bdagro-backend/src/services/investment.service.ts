import { Investment } from "../models/Investment";
import { Project } from "../models/Project";
import { InvestorProfile } from "../models/InvestorProfile";
import { InvestmentStatus, ProjectStatus } from "../utils/constants";

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
  }

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
