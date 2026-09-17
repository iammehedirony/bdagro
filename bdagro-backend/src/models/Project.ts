import { Schema, model, Document, Types } from "mongoose";
import { RiskLevel, ProjectStatus } from "../utils/constants";

/**
 * Marketplace listing created by Admin from an Approved LoanApplication.
 * Investors browse/filter these by cropType, riskLevel and expectedROI,
 * then fund them fully or partially (see Investment model).
 */
export interface IProject extends Document {
  _id: Types.ObjectId;
  loanApplication: Types.ObjectId;
  farmer: Types.ObjectId;
  title: string;
  description: string;
  cropType: string;
  riskLevel: RiskLevel;
  expectedROIPercent: number;
  fundingGoal: number;
  fundedAmount: number;
  status: ProjectStatus;
  fundingDeadline: Date | null;
  expectedHarvestDate: Date | null;
  profitReport: {
    totalSales: number;
    productionCost: number;
    netProfit: number;
    profitSharePercent: number;
    investorShareAmount: number;
    submittedAt: Date;
  } | null;
  imageUrls: string[];
  remainingAmount?: number; // virtual
  createdAt: Date;
  updatedAt: Date;
}

const projectSchema = new Schema<IProject>(
  {
    loanApplication: { type: Schema.Types.ObjectId, ref: "LoanApplication", required: true, unique: true },
    farmer: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    cropType: { type: String, required: true, index: true },
    riskLevel: {
      type: String,
      enum: Object.values(RiskLevel),
      required: true,
      index: true,
    },
    expectedROIPercent: { type: Number, required: true },
    fundingGoal: { type: Number, required: true },
    fundedAmount: { type: Number, default: 0 },
    status: {
      type: String,
      enum: Object.values(ProjectStatus),
      default: ProjectStatus.OPEN,
      index: true,
    },
    fundingDeadline: { type: Date, default: null },
    expectedHarvestDate: { type: Date, default: null, index: true },
    profitReport: {
      totalSales: { type: Number, min: 0 },
      productionCost: { type: Number, min: 0 },
      netProfit: { type: Number, min: 0 },
      profitSharePercent: { type: Number, min: 0, max: 100 },
      investorShareAmount: { type: Number, min: 0 },
      submittedAt: { type: Date },
    },
    imageUrls: { type: [String], default: [] },
  },
  { timestamps: true }
);

// Convenience virtual: how much funding room is left
projectSchema.virtual("remainingAmount").get(function (this: IProject) {
  return Math.max(this.fundingGoal - this.fundedAmount, 0);
});
projectSchema.set("toJSON", { virtuals: true });
projectSchema.set("toObject", { virtuals: true });

export const Project = model<IProject>("Project", projectSchema);
