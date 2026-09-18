import { Schema, model, Document, Types } from "mongoose";
import { TransactionType, TransactionStatus, PaymentMethod } from "../utils/constants";

/**
 * Single unified ledger for every money movement on the platform:
 * investor -> project (investment), farmer -> platform (repayment),
 * platform -> farmer (disbursement), refunds, etc.
 * This is what Admin's "monitor all transactions" screen reads from,
 * and what money-receipt generation (Investor feature) is based on.
 */
export interface ITransaction extends Document {
  _id: Types.ObjectId;
  user: Types.ObjectId;
  type: TransactionType;
  amount: number;
  paymentMethod: PaymentMethod;
  gatewayTransactionId: string | null;
  status: TransactionStatus;
  relatedLoanApplication: Types.ObjectId | null;
  relatedInvestment: Types.ObjectId | null;
  relatedProfitDistribution: Types.ObjectId | null;
  metadata: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
}

const transactionSchema = new Schema<ITransaction>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    type: {
      type: String,
      enum: Object.values(TransactionType),
      required: true,
      index: true,
    },
    amount: { type: Number, required: true },
    paymentMethod: {
      type: String,
      enum: Object.values(PaymentMethod),
      required: true,
    },
    gatewayTransactionId: { type: String, default: null, index: true },
    status: {
      type: String,
      enum: Object.values(TransactionStatus),
      default: TransactionStatus.PENDING,
      index: true,
    },
    relatedLoanApplication: { type: Schema.Types.ObjectId, ref: "LoanApplication", default: null },
    relatedInvestment: { type: Schema.Types.ObjectId, ref: "Investment", default: null },
    relatedProfitDistribution: { type: Schema.Types.ObjectId, ref: "ProfitDistribution", default: null },
    metadata: { type: Schema.Types.Mixed, default: {} },
  },
  { timestamps: true }
);

export const Transaction = model<ITransaction>("Transaction", transactionSchema);
