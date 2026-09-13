import { Schema, model, Document, Types } from "mongoose";
import { LoanApplicationStatus } from "../utils/constants";

/**
 * A farmer's loan application for a specific agricultural project.
 * Status transitions (Pending -> Processing -> Approved/Rejected) are
 * broadcast to the farmer's dashboard in real time via Socket.io.
 * Once Approved, an Admin converts this into a marketplace `Project`.
 */
export interface ILoanApplication extends Document {
  _id: Types.ObjectId;
  farmer: Types.ObjectId;
  loanProduct: Types.ObjectId;
  requestedAmount: number;
  durationMonths: number;
  projectTitle: string;
  projectDescription: string;
  cropType?: string;
  landDeedUrl?: string;
  incomeProofUrl?: string;
  status: LoanApplicationStatus;
  reviewedBy: Types.ObjectId | null;
  reviewedAt: Date | null;
  rejectionReason: string | null;
  createdAt: Date;
  updatedAt: Date;
}

const loanApplicationSchema = new Schema<ILoanApplication>(
  {
    farmer: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    loanProduct: { type: Schema.Types.ObjectId, ref: "LoanProduct", required: true },
    requestedAmount: { type: Number, required: true },
    durationMonths: { type: Number, required: true },
    projectTitle: { type: String, required: true, trim: true },
    projectDescription: { type: String, required: true },
    cropType: { type: String, trim: true },
    landDeedUrl: { type: String },
    incomeProofUrl: { type: String },
    status: {
      type: String,
      enum: Object.values(LoanApplicationStatus),
      default: LoanApplicationStatus.PENDING,
      index: true,
    },
    reviewedBy: { type: Schema.Types.ObjectId, ref: "User", default: null },
    reviewedAt: { type: Date, default: null },
    rejectionReason: { type: String, default: null },
  },
  { timestamps: true }
);

export const LoanApplication = model<ILoanApplication>("LoanApplication", loanApplicationSchema);
