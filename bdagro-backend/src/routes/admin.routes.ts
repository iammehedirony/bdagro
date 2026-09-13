import { Router } from "express";
import { requireAuth } from "@clerk/express";
import { syncClerkUser } from "../middlewares/auth";
import { requireRole } from "../middlewares/rbac";
import { validate } from "../middlewares/validate";
import { UserRole } from "../utils/constants";
import {
  rejectSchema,
  approveLoanApplicationSchema,
  updateUserStatusSchema,
  updateUserRoleSchema,
  sendNotificationSchema,
} from "../validators/admin.validator";
import { updateAdminSettingsSchema } from "../validators/settings.validator";
import * as dashboardCtrl from "../controllers/adminDashboard.controller";
import * as verificationCtrl from "../controllers/adminVerification.controller";
import * as loanAppCtrl from "../controllers/adminLoanApplication.controller";
import * as userCtrl from "../controllers/adminUser.controller";
import * as transactionCtrl from "../controllers/adminTransaction.controller";
import * as notificationCtrl from "../controllers/adminNotification.controller";
import * as projectCtrl from "../controllers/adminProject.controller";
import * as settingsCtrl from "../controllers/settings.controller";

const router = Router();

// Every route below requires a logged-in, active Admin account.
router.use(requireAuth(), syncClerkUser, requireRole(UserRole.ADMIN));

// --- Central dashboard ---
router.get("/dashboard", dashboardCtrl.getDashboard);

// --- Manual verification panel ("Pending Verifications") ---
router.get("/verifications", verificationCtrl.listVerifications);
router.get("/verifications/:id", verificationCtrl.getVerificationById);
router.post("/verifications/:id/approve", verificationCtrl.approveVerification);
router.post("/verifications/:id/reject", validate(rejectSchema), verificationCtrl.rejectVerification);

// --- Loan approval system (approve -> creates the marketplace Project) ---
router.get("/loan-applications", loanAppCtrl.listLoanApplications);
router.get("/loan-applications/:id", loanAppCtrl.getLoanApplicationById);
router.post("/loan-applications/:id/process", loanAppCtrl.markProcessing);
router.post(
  "/loan-applications/:id/approve",
  validate(approveLoanApplicationSchema),
  loanAppCtrl.approveLoanApplication
);
router.post("/loan-applications/:id/reject", validate(rejectSchema), loanAppCtrl.rejectLoanApplication);

// --- User & role management (RBAC) ---
router.get("/users", userCtrl.listUsers);
router.get("/users/:id", userCtrl.getUserById);
router.patch("/users/:id/status", validate(updateUserStatusSchema), userCtrl.updateUserStatus);
router.patch("/users/:id/role", validate(updateUserRoleSchema), userCtrl.updateUserRole);

// --- Monitoring & notifications ---
router.get("/transactions", transactionCtrl.listAllTransactions);
router.get("/notifications", notificationCtrl.listNotifications);
router.post("/notifications", validate(sendNotificationSchema), notificationCtrl.sendNotification);

// --- Projects: full-status view + loan disbursement ---
router.get("/projects", projectCtrl.listProjectsForAdmin);
router.post("/projects/:id/disburse", projectCtrl.disburseProject);

// --- Settings ---
router.put("/settings", validate(updateAdminSettingsSchema), settingsCtrl.updateAdminSettings);

export default router;
