import { Schema, model, Document, Types } from "mongoose";
import { VerificationStatus } from "../utils/constants";

interface IAddress {
  district?: string;
  upazila?: string;
  village?: string;
  fullAddress?: string;
}

/**
 * Farmer-specific profile: identity + land documents used for
 * the Admin's "Pending Verifications" panel, plus address/farm info.
 */
export interface IFarmerProfile extends Document {
  _id: Types.ObjectId;
  user: Types.ObjectId;
  nidNumber: string;
  nidImageUrl: string;
  landDocumentUrl: string;
  address: IAddress;
  farmSizeAcres: number | null;
  verificationStatus: VerificationStatus;
  verifiedBy: Types.ObjectId | null;
  verifiedAt: Date | null;
  rejectionReason: string | null;
  settings: {
    bkashNumber?: string;
    nagadNumber?: string;
    bankAccount?: string;
    defaultPaymentGateway?: string;
    notifyInvestmentUpdates: boolean;
    notifyProfitReportReminders: boolean;
    notifyProjectStatusChanges: boolean;
    notifyPromotional: boolean;
  };
  createdAt: Date;
  updatedAt: Date;
}

const farmerProfileSchema = new Schema<IFarmerProfile>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true, unique: true, index: true },
    nidNumber: { type: String, required: true, trim: true },
    nidImageUrl: { type: String, required: true }, // scanned copy of NID card
    landDocumentUrl: { type: String, required: true }, // scanned copy of পর্চা/খতিয়ান
    address: {
      district: { type: String, trim: true },
      upazila: { type: String, trim: true },
      village: { type: String, trim: true },
      fullAddress: { type: String, trim: true },
    },
    farmSizeAcres: { type: Number, default: null },
    verificationStatus: {
      type: String,
      enum: Object.values(VerificationStatus),
      default: VerificationStatus.PENDING,
      index: true,
    },
    verifiedBy: { type: Schema.Types.ObjectId, ref: "User", default: null },
    verifiedAt: { type: Date, default: null },
    rejectionReason: { type: String, default: null },
    settings: {
      bkashNumber: { type: String, trim: true },
      nagadNumber: { type: String, trim: true },
      bankAccount: { type: String, trim: true },
      defaultPaymentGateway: { type: String },
      notifyInvestmentUpdates: { type: Boolean, default: true },
      notifyProfitReportReminders: { type: Boolean, default: true },
      notifyProjectStatusChanges: { type: Boolean, default: true },
      notifyPromotional: { type: Boolean, default: false },
    },
  },
  { timestamps: true }
);

export const FarmerProfile = model<IFarmerProfile>("FarmerProfile", farmerProfileSchema);
