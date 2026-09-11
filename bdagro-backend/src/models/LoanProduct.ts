import { Schema, model, Document, Types } from "mongoose";
import { LoanCategory } from "../utils/constants";

/**
 * Catalog of loan products a farmer can browse ("লোন এক্সপ্লোরার"),
 * e.g. Seed Purchase, Tractor Purchase, Livestock Farming.
 * Managed by Admin.
 */
export interface ILoanProduct extends Document {
  _id: Types.ObjectId;
  name: string;
  category: LoanCategory;
  description?: string;
  minAmount: number;
  maxAmount: number;
  interestRatePercent: number;
  maxDurationMonths: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const loanProductSchema = new Schema<ILoanProduct>(
  {
    name: { type: String, required: true, trim: true },
    category: {
      type: String,
      enum: Object.values(LoanCategory),
      required: true,
      index: true,
    },
    description: { type: String, trim: true },
    minAmount: { type: Number, required: true },
    maxAmount: { type: Number, required: true },
    interestRatePercent: { type: Number, required: true },
    maxDurationMonths: { type: Number, required: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const LoanProduct = model<ILoanProduct>("LoanProduct", loanProductSchema);
