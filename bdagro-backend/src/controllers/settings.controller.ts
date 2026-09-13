import { Request, Response } from "express";
import { FarmerProfile } from "../models/FarmerProfile";
import { InvestorProfile } from "../models/InvestorProfile";
import { User } from "../models/User";
import { AppError } from "../middlewares/errorHandler";
import { UserRole } from "../utils/constants";
import {
  UpdateFarmerSettingsInput,
  UpdateInvestorSettingsInput,
  UpdateAdminSettingsInput,
} from "../validators/settings.validator";

/**
 * PUT /api/farmers/settings
 * Updates farmer-specific settings (payment methods, notification preferences)
 */
export async function updateFarmerSettings(req: Request, res: Response): Promise<void> {
  const body = req.body as UpdateFarmerSettingsInput;

  const profile = await FarmerProfile.findOne({ user: req.user!._id });
  if (!profile) {
    throw new AppError("Farmer profile not found", 404);
  }

  if (!profile.settings) {
    profile.settings = {
      notifyInvestmentUpdates: true,
      notifyProfitReportReminders: true,
      notifyProjectStatusChanges: true,
      notifyPromotional: false,
    };
  }

  // Update settings
  if (body.bkashNumber !== undefined) profile.settings.bkashNumber = body.bkashNumber;
  if (body.nagadNumber !== undefined) profile.settings.nagadNumber = body.nagadNumber;
  if (body.bankAccount !== undefined) profile.settings.bankAccount = body.bankAccount;
  if (body.defaultPaymentGateway !== undefined)
    profile.settings.defaultPaymentGateway = body.defaultPaymentGateway;
  if (body.notifyInvestmentUpdates !== undefined)
    profile.settings.notifyInvestmentUpdates = body.notifyInvestmentUpdates;
  if (body.notifyProfitReportReminders !== undefined)
    profile.settings.notifyProfitReportReminders = body.notifyProfitReportReminders;
  if (body.notifyProjectStatusChanges !== undefined)
    profile.settings.notifyProjectStatusChanges = body.notifyProjectStatusChanges;
  if (body.notifyPromotional !== undefined) profile.settings.notifyPromotional = body.notifyPromotional;

  await profile.save();

  res.json({ settings: profile.settings, message: "Settings updated successfully" });
}

/**
 * PUT /api/investors/settings
 * Updates investor-specific settings (risk tolerance, payment methods, notifications)
 */
export async function updateInvestorSettings(req: Request, res: Response): Promise<void> {
  const body = req.body as UpdateInvestorSettingsInput;

  const profile = await InvestorProfile.findOne({ user: req.user!._id });
  if (!profile) {
    throw new AppError("Investor profile not found", 404);
  }

  if (!profile.settings) {
    profile.settings = {
      notifyNewProjects: true,
      notifyFundingUpdates: true,
      notifyPaymentConfirmation: true,
      notifyPromotional: false,
    };
  }

  // Update settings
  if (body.riskTolerance !== undefined) profile.settings.riskTolerance = body.riskTolerance;
  if (body.defaultPaymentGateway !== undefined)
    profile.settings.defaultPaymentGateway = body.defaultPaymentGateway;
  if (body.returnAccountNumber !== undefined)
    profile.settings.returnAccountNumber = body.returnAccountNumber;
  if (body.notifyNewProjects !== undefined) profile.settings.notifyNewProjects = body.notifyNewProjects;
  if (body.notifyFundingUpdates !== undefined)
    profile.settings.notifyFundingUpdates = body.notifyFundingUpdates;
  if (body.notifyPaymentConfirmation !== undefined)
    profile.settings.notifyPaymentConfirmation = body.notifyPaymentConfirmation;
  if (body.notifyPromotional !== undefined) profile.settings.notifyPromotional = body.notifyPromotional;

  await profile.save();

  res.json({ settings: profile.settings, message: "Settings updated successfully" });
}

/**
 * PUT /api/admin/settings
 * Updates platform-wide configuration settings (only accessible by admins)
 */
export async function updateAdminSettings(req: Request, res: Response): Promise<void> {
  const body = req.body as UpdateAdminSettingsInput;

  const user = await User.findById(req.user!._id);
  if (!user || user.role !== UserRole.ADMIN) {
    throw new AppError("Only admins can update platform settings", 403);
  }

  if (!user.adminSettings) {
    user.adminSettings = {};
  }

  // Update settings
  if (body.minInvestmentAmount !== undefined)
    user.adminSettings.minInvestmentAmount = body.minInvestmentAmount;
  if (body.nidVerificationTimeoutHours !== undefined)
    user.adminSettings.nidVerificationTimeoutHours = body.nidVerificationTimeoutHours;
  if (body.allowedPaymentGateways !== undefined)
    user.adminSettings.allowedPaymentGateways = body.allowedPaymentGateways;

  await user.save();

  res.json({ settings: user.adminSettings, message: "Platform settings updated successfully" });
}
