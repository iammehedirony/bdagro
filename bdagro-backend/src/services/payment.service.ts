import type { HydratedDocument } from "mongoose";
import { ITransaction } from "../models/Transaction";
import { ProfitDistribution } from "../models/ProfitDistribution";
import { TransactionStatus, TransactionType, ProfitDistributionStatus } from "../utils/constants";
import { confirmInvestment } from "./investment.service";

/**
 * Applies the domain-specific effects of a successful payment, shared by
 * both the SSLCommerz IPN handler and the Stripe webhook handler so the
 * "what happens when money actually arrives" logic lives in one place.
 * Idempotent — safe to call more than once for the same transaction
 * (gateways can and do redeliver webhooks/IPNs).
 */
export async function markTransactionSuccess(
  transaction: HydratedDocument<ITransaction>,
  gatewayTransactionId?: string
): Promise<void> {
  if (transaction.status === TransactionStatus.SUCCESS) {
    return; // already processed — avoid double-crediting an investment/distribution
  }

  transaction.status = TransactionStatus.SUCCESS;
  if (gatewayTransactionId) {
    transaction.gatewayTransactionId = gatewayTransactionId;
  }
  await transaction.save();

  if (transaction.type === TransactionType.INVESTMENT && transaction.relatedInvestment) {
    await confirmInvestment(transaction.relatedInvestment.toString());
  }

  if (transaction.type === TransactionType.PROFIT_DISTRIBUTION && transaction.relatedProfitDistribution) {
    await ProfitDistribution.findByIdAndUpdate(transaction.relatedProfitDistribution, {
      status: ProfitDistributionStatus.PAID,
      paidAt: new Date(),
    });
  }
}

/** Marks a transaction failed. Never downgrades a transaction that already succeeded. */
export async function markTransactionFailed(transaction: HydratedDocument<ITransaction>): Promise<void> {
  if (transaction.status === TransactionStatus.SUCCESS) {
    return;
  }
  transaction.status = TransactionStatus.FAILED;
  await transaction.save();
}
