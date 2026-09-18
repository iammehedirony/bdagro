import { Schema, model, Document, Types } from "mongoose";
import { ProfitDistributionStatus } from "../utils/constants";

/**
 * A farmer's profit distribution to the investors who funded a project.
 */
export interface IProfitDistribution extends Document {
  _id: Types.ObjectId;
  project: Types.ObjectId;
  farmer: Types.ObjectId;
  investor: Types.ObjectId | null;
  distributionNumber: number;
  dueDate: Date;
  amount: number;
  status: ProfitDistributionStatus;
  paidAt: Date | null;
  transaction: Types.ObjectId | null;
  metadata: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
}

const profitDistributionSchema = new Schema<IProfitDistribution>(
  {
    project: { type: Schema.Types.ObjectId, ref: "Project", required: true, index: true },
    farmer: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    investor: { type: Schema.Types.ObjectId, ref: "User", default: null, index: true },
    distributionNumber: { type: Number, required: true },
    dueDate: { type: Date, required: true },
    amount: { type: Number, required: true },
    status: {
      type: String,
      enum: Object.values(ProfitDistributionStatus),
      default: ProfitDistributionStatus.PENDING,
      index: true,
    },
    paidAt: { type: Date, default: null },
    transaction: { type: Schema.Types.ObjectId, ref: "Transaction", default: null },
    metadata: { type: Schema.Types.Mixed, default: {} },
  },
  { timestamps: true }
);

export const ProfitDistribution = model<IProfitDistribution>("ProfitDistribution", profitDistributionSchema);
