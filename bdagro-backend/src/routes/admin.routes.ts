import { Router } from "express";
import { syncClerkUser , requireAuth} from "../middlewares/auth";
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
import * as dashboardCtrl from "../controllers/admin.controller";


const router = Router();

// Every route below requires a logged-in, active Admin account.
router.use(requireAuth, syncClerkUser, requireRole(UserRole.ADMIN));

// --- Central dashboard ---
router.get("/dashboard", dashboardCtrl.getDashboard);

// --- Manual verification panel ("Pending Verifications") ---
router.get("/verifications", dashboardCtrl.listVerifications);
router.get("/verifications/:id", dashboardCtrl.getVerificationById);
router.post("/verifications/:id/approve", dashboardCtrl.approveVerification);
router.post("/verifications/:id/reject", validate(rejectSchema), dashboardCtrl.rejectVerification);

// --- Loan approval system (approve -> creates the marketplace Project) ---
router.get("/loan-applications", dashboardCtrl.listLoanApplications);
router.get("/loan-applications/:id", dashboardCtrl.getLoanApplicationById);
router.post("/loan-applications/:id/process", dashboardCtrl.markProcessing);
router.post(
  "/loan-applications/:id/approve",
  validate(approveLoanApplicationSchema),
  dashboardCtrl.approveLoanApplication
);
router.post("/loan-applications/:id/reject", validate(rejectSchema), dashboardCtrl.rejectLoanApplication);

// --- User & role management (RBAC) ---
router.get("/users", dashboardCtrl.listUsers);
router.get("/users/:id", dashboardCtrl.getUserById);
router.patch("/users/:id/status", validate(updateUserStatusSchema), dashboardCtrl.updateUserStatus);
router.patch("/users/:id/role", validate(updateUserRoleSchema), dashboardCtrl.updateUserRole);

// --- Monitoring & notifications ---
router.get("/transactions", dashboardCtrl.listAllTransactions);
router.get("/notifications", dashboardCtrl.listNotifications);
router.post("/notifications", validate(sendNotificationSchema), dashboardCtrl.sendNotification);

// --- Projects: full-status view + loan disbursement ---
router.get("/projects", dashboardCtrl.listProjectsForAdmin);
router.post("/projects/:id/disburse", dashboardCtrl.disburseProject);

// --- Settings ---
router.put("/settings", validate(updateAdminSettingsSchema), dashboardCtrl.updateAdminSettings);

export default router;
