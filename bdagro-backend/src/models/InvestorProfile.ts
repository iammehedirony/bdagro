import { Schema, model, Document, Types } from "mongoose";

interface IInvestorPreferences {
  preferredCropTypes: string[];
  maxRiskLevel: string | null;
}

/**
 * Investor-specific profile. Holds denormalized portfolio totals
 * for fast dashboard reads; the source of truth for individual
 * investments still lives in the Investment collection.
 */
export interface IInvestorProfile extends Document {
  _id: Types.ObjectId;
  user: Types.ObjectId;
  totalInvested: number;
  totalReturned: number;
  activeProjectsCount: number;
  preferences: IInvestorPreferences;
  settings: {
    riskTolerance?: string;
    defaultPaymentGateway?: string;
    returnAccountNumber?: string;
    notifyNewProjects: boolean;
    notifyFundingUpdates: boolean;
    notifyPaymentConfirmation: boolean;
    notifyPromotional: boolean;
  };
  createdAt: Date;
  updatedAt: Date;
}

const investorProfileSchema = new Schema<IInvestorProfile>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true, unique: true, index: true },
    totalInvested: { type: Number, default: 0 },
    totalReturned: { type: Number, default: 0 },
    activeProjectsCount: { type: Number, default: 0 },
    preferences: {
      preferredCropTypes: [{ type: String }],
      maxRiskLevel: { type: String, default: null },
    },
    settings: {
      riskTolerance: { type: String },
      defaultPaymentGateway: { type: String },
      returnAccountNumber: { type: String, trim: true },
      notifyNewProjects: { type: Boolean, default: true },
      notifyFundingUpdates: { type: Boolean, default: true },
      notifyPaymentConfirmation: { type: Boolean, default: true },
      notifyPromotional: { type: Boolean, default: false },
    },
  },
  { timestamps: true }
);

export const InvestorProfile = model<IInvestorProfile>("InvestorProfile", investorProfileSchema);
