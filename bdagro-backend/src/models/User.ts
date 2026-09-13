import { Schema, model, Document, Types } from "mongoose";
import { UserRole, UserStatus } from "../utils/constants";

/**
 * Base User. Every account (Farmer, Investor, Admin) is a User.
 * Authentication identity/OTP/social login is handled by Clerk;
 * `clerkId` links this document to the Clerk user record.
 * Role-specific data (NID, investment stats, etc.) lives in
 * FarmerProfile / InvestorProfile, referenced 1:1 from here.
 */
export interface IUser extends Document {
  _id: Types.ObjectId;
  clerkId: string;
  name: string;
  email?: string;
  phone?: string;
  avatarUrl: string | null;
  role: UserRole;
  status: UserStatus;
  statusReason: string | null;
  lastLoginAt: Date | null;
  adminSettings?: {
    minInvestmentAmount?: number;
    nidVerificationTimeoutHours?: number;
    allowedPaymentGateways?: string[];
  };
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    clerkId: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true, trim: true },
    email: { type: String, trim: true, lowercase: true, sparse: true },
    phone: { type: String, trim: true, sparse: true, index: true },
    avatarUrl: { type: String, default: null },
    role: {
      type: String,
      enum: Object.values(UserRole),
      required: true,
      index: true,
    },
    status: {
      type: String,
      enum: Object.values(UserStatus),
      default: UserStatus.ACTIVE,
      index: true,
    },
    statusReason: { type: String, default: null },
    lastLoginAt: { type: Date, default: null },
    adminSettings: {
      minInvestmentAmount: { type: Number },
      nidVerificationTimeoutHours: { type: Number },
      allowedPaymentGateways: [{ type: String }],
    },
  },
  { timestamps: true }
);

export const User = model<IUser>("User", userSchema);
