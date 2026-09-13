import { Router } from "express";
import { requireAuth } from "@clerk/express";
import { syncClerkUser } from "../middlewares/auth";
import { requireRole } from "../middlewares/rbac";
import { validate } from "../middlewares/validate";
import { UserRole } from "../utils/constants";
import { createInvestmentSchema } from "../validators/investor.validator";
import { updateInvestorSettingsSchema } from "../validators/settings.validator";
import * as investmentCtrl from "../controllers/investment.controller";
import * as portfolioCtrl from "../controllers/portfolio.controller";
import * as transactionCtrl from "../controllers/transaction.controller";
import * as notificationCtrl from "../controllers/userNotification.controller";
import * as settingsCtrl from "../controllers/settings.controller";
import * as roiTrackingCtrl from "../controllers/roiTracking.controller";

const router = Router();

// Every route below requires a logged-in, active Investor account.
router.use(requireAuth(), syncClerkUser, requireRole(UserRole.INVESTOR));

// --- Funding & investment ---
router.post("/investments", validate(createInvestmentSchema), investmentCtrl.createInvestment);
router.get("/investments", investmentCtrl.listMyInvestments);
router.get("/investments/:id", investmentCtrl.getMyInvestmentById);

// --- Portfolio dashboard ---
router.get("/portfolio", portfolioCtrl.getPortfolio);

// --- ROI Tracking ---
router.get("/roi-tracking", roiTrackingCtrl.getROITracking);

// --- Transaction history & receipts ---
router.get("/transactions", transactionCtrl.listMyTransactions);
router.get("/transactions/:id/receipt", transactionCtrl.getMyTransactionReceipt);

// --- Notifications ---
router.get("/notifications", notificationCtrl.listMyNotifications);
router.put("/notifications/mark-all-read", notificationCtrl.markAllNotificationsAsRead);
router.put("/notifications/:id/read", notificationCtrl.markNotificationAsRead);

// --- Settings ---
router.put("/settings", validate(updateInvestorSettingsSchema), settingsCtrl.updateInvestorSettings);

export default router;
