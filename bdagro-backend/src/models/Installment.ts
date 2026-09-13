import { Schema, model, Document, Types } from "mongoose";
import { InstallmentStatus } from "../utils/constants";

/**
 * A single repayment installment in a farmer's loan schedule.
 * Powers the "কিস্তি ও পেমেন্ট ম্যানেজমেন্ট" farmer feature
 * (view due installments, pay via SSLCommerz/Stripe).
 */
export interface IInstallment extends Document {
  _id: Types.ObjectId;
  loanApplication: Types.ObjectId;
  farmer: Types.ObjectId;
  installmentNumber: number;
  dueDate: Date;
  amount: number;
  status: InstallmentStatus;
  paidAt: Date | null;
  transaction: Types.ObjectId | null;
  metadata: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
}

const installmentSchema = new Schema<IInstallment>(
  {
    loanApplication: { type: Schema.Types.ObjectId, ref: "LoanApplication", required: true, index: true },
    farmer: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    installmentNumber: { type: Number, required: true },
    dueDate: { type: Date, required: true },
    amount: { type: Number, required: true },
    status: {
      type: String,
      enum: Object.values(InstallmentStatus),
      default: InstallmentStatus.DUE,
      index: true,
    },
    paidAt: { type: Date, default: null },
    transaction: { type: Schema.Types.ObjectId, ref: "Transaction", default: null },
    metadata: { type: Schema.Types.Mixed, default: {} },
  },
  { timestamps: true }
);

export const Installment = model<IInstallment>("Installment", installmentSchema);
