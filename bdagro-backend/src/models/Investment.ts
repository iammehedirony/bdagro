import { Schema, model, Document, Types } from "mongoose";
import { InvestmentType, InvestmentStatus } from "../utils/constants";

/**
 * One investor's funding commitment toward one project.
 * A project can have many partial Investments (crowdfunded) or
 * a single "full" Investment that covers the entire fundingGoal.
 */
export interface IInvestment extends Document {
  _id: Types.ObjectId;
  investor: Types.ObjectId;
  project: Types.ObjectId;
  amount: number;
  investmentType: InvestmentType;
  status: InvestmentStatus;
  transaction: Types.ObjectId | null;
  returnAmount: number;
  returnedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

const investmentSchema = new Schema<IInvestment>(
  {
    investor: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    project: { type: Schema.Types.ObjectId, ref: "Project", required: true, index: true },
    amount: { type: Number, required: true },
    investmentType: {
      type: String,
      enum: Object.values(InvestmentType),
      required: true,
    },
    status: {
      type: String,
      enum: Object.values(InvestmentStatus),
      default: InvestmentStatus.PENDING,
      index: true,
    },
    transaction: { type: Schema.Types.ObjectId, ref: "Transaction", default: null },
    returnAmount: { type: Number, default: 0 },
    returnedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

export const Investment = model<IInvestment>("Investment", investmentSchema);
