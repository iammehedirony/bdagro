import { Router } from "express";
import { syncClerkUser, requireAuth } from "../middlewares/auth";
import { requireRole } from "../middlewares/rbac";
import { validate } from "../middlewares/validate";
import { UserRole } from "../utils/constants";
import { createInvestmentSchema } from "../validators/investor.validator";
import { updateInvestorSettingsSchema } from "../validators/settings.validator";
import * as investorCtrl from "../controllers/investor.controller";
import * as notificationCtrl from "../controllers/notification.controller";


const router = Router();

// Every route below requires a logged-in, active Investor account.
router.use(requireAuth, syncClerkUser, requireRole(UserRole.INVESTOR));

// --- Funding & investment ---
router.post("/investments", validate(createInvestmentSchema), investorCtrl.createInvestment);
router.get("/investments", investorCtrl.listMyInvestments);
router.get("/investments/:id", investorCtrl.getMyInvestmentById);

// --- Portfolio dashboard ---
router.get("/portfolio", investorCtrl.getPortfolio);

// --- ROI Tracking ---
router.get("/roi-tracking", investorCtrl.getROITracking);

// --- Transaction history & receipts ---
router.get("/transactions", investorCtrl.listMyTransactions);
router.get("/transactions/:id/receipt", investorCtrl.getMyTransactionReceipt);

// --- Notifications ---
router.get("/notifications", notificationCtrl.listMyNotifications);
router.put("/notifications/mark-all-read", notificationCtrl.markAllNotificationsAsRead);
router.put("/notifications/:id/read", notificationCtrl.markNotificationAsRead);

// --- Settings ---
router.put("/settings", validate(updateInvestorSettingsSchema), investorCtrl.updateInvestorSettings);

export default router;
