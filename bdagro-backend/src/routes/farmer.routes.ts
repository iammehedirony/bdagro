import { Router } from "express";
import { syncClerkUser, requireAuth } from "../middlewares/auth";
import { requireRole } from "../middlewares/rbac";
import { validate } from "../middlewares/validate";
import { uploadFarmerDocs, uploadLoanDocs } from "../middlewares/upload";
import { UserRole } from "../utils/constants";
import { submitFarmerProfileSchema, createLoanApplicationSchema, initiatePaymentSchema, saveProjectProfitReportSchema, updateFarmerProjectSchema } from "../validators/farmer.validator";
import { submitProfitReportSchema, markPaidSchema } from "../validators/installment.validator";
import { updateFarmerSettingsSchema } from "../validators/settings.validator";
import * as notificationCtrl from "../controllers/notification.controller";
import * as farmerCtrl from "../controllers/farmer.controller";



const router = Router();

// Every route below requires a logged-in, active Farmer account.
router.use(requireAuth, syncClerkUser, requireRole(UserRole.FARMER));

// --- Dashboard ---
router.get("/dashboard", farmerCtrl.getFarmerDashboard);

// --- Profile & document verification ---
router.get("/profile/me", farmerCtrl.getMyProfile);
router.put(
  "/profile",
  uploadFarmerDocs, // parses multipart fields into req.body + files into req.files
  validate(submitFarmerProfileSchema),
  farmerCtrl.submitProfile
);

// --- Loan applications ---
router.post(
  "/loan-applications",
  uploadLoanDocs,
  validate(createLoanApplicationSchema),
  farmerCtrl.createApplication
);
router.get("/loan-applications", farmerCtrl.listMyApplications);
router.get("/loan-applications/:id", farmerCtrl.getMyApplicationById);

// --- Installments / repayments ---
router.get("/installments", farmerCtrl.listMyInstallments);
router.get("/installments/:id/recipients", farmerCtrl.getInstallmentRecipients);
router.post("/installments/:id/pay", validate(initiatePaymentSchema), farmerCtrl.initiatePayment);
router.post("/installments/:id/profit-report", validate(submitProfitReportSchema), farmerCtrl.submitProfitReport);
router.post("/installments/:id/mark-paid", validate(markPaidSchema), farmerCtrl.markAsPaid);

// --- Projects (Farmer perspective of Loan Applications & Marketplace Projects) ---
router.get("/projects", farmerCtrl.listMyProjects);
router.get("/projects/:id", farmerCtrl.getMyProjectById);
router.post("/projects/:id/profit-report", validate(saveProjectProfitReportSchema), farmerCtrl.saveProjectProfitReport);
router.post("/projects", validate(createLoanApplicationSchema), farmerCtrl.createMyProject);
router.put("/projects/:id", validate(updateFarmerProjectSchema), farmerCtrl.updateMyProject);

// --- Transactions ---
router.get("/profit-distribution", farmerCtrl.getProfitDistribution);
router.get("/transactions", farmerCtrl.listFarmerTransactions);

// --- Notifications ---
router.get("/notifications", notificationCtrl.listMyNotifications);
router.put("/notifications/mark-all-read", notificationCtrl.markAllNotificationsAsRead);
router.put("/notifications/:id/read", notificationCtrl.markNotificationAsRead);

// --- Settings ---
router.put("/settings", validate(updateFarmerSettingsSchema), farmerCtrl.updateFarmerSettings);

export default router;
