import { Schema, model, Document, Types } from "mongoose";
import { LoanCategory } from "../utils/constants";

/**
 * Catalog of funding products a farmer can browse ("ফান্ডিং প্রোডাক্ট এক্সপ্লোরার"),
 * e.g. Seed Purchase, Tractor Purchase, Livestock Farming.
 * Managed by Admin.
 *
 * NOTE: "সার ও কীটনাশক" (fertilizer/pesticide) style products currently fall
 * under LoanCategory.OTHER since there is no dedicated enum value for it yet.
 *
 * NOTE: This platform works on a profit-sharing model, not interest.
 * If the farmer profits, `profitSharePercent` of that profit goes to the
 * investor. There is no fixed interest and no penalty on loss.
 */
export interface ILoanProduct extends Document {
  _id: Types.ObjectId;
  name: string;
  category: LoanCategory;
  description?: string;
  minAmount: number;
  maxAmount: number;
  profitSharePercent: number;
  maxDurationMonths: number;
  icon: string; // lucide-react icon name, e.g. "Wheat", "Truck", "PawPrint"
  tone: "emerald" | "amber" | "orange"; // card accent color used in the UI
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
    profitSharePercent: { type: Number, required: true, min: 0, max: 100 },
    maxDurationMonths: { type: Number, required: true },
    icon: { type: String, required: true },
    tone: {
      type: String,
      enum: ["emerald", "amber", "orange"],
      default: "emerald",
    },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const LoanProduct = model<ILoanProduct>("LoanProduct", loanProductSchema);