import { Router } from "express";
import { requireAuth } from "@clerk/express";
import { syncClerkUser } from "../middlewares/auth";
import { requireRole } from "../middlewares/rbac";
import { validate } from "../middlewares/validate";
import { uploadFarmerDocs } from "../middlewares/upload";
import { UserRole } from "../utils/constants";
import { submitFarmerProfileSchema, createLoanApplicationSchema, initiatePaymentSchema, updateFarmerProjectSchema } from "../validators/farmer.validator";
import { submitProfitReportSchema, markPaidSchema } from "../validators/installment.validator";
import * as profileCtrl from "../controllers/farmerProfile.controller";
import * as loanAppCtrl from "../controllers/loanApplication.controller";
import * as installmentCtrl from "../controllers/installment.controller";
import * as farmerProjectCtrl from "../controllers/farmerProject.controller";
import * as farmerTransactionCtrl from "../controllers/farmerTransaction.controller";
import * as notificationCtrl from "../controllers/userNotification.controller";
import * as farmerDashboardCtrl from "../controllers/farmerDashboard.controller";

const router = Router();

// Every route below requires a logged-in, active Farmer account.
router.use(requireAuth(), syncClerkUser, requireRole(UserRole.FARMER));

// --- Dashboard ---
router.get("/dashboard", farmerDashboardCtrl.getFarmerDashboard);

// --- Profile & document verification ---
router.get("/profile/me", profileCtrl.getMyProfile);
router.put(
  "/profile",
  uploadFarmerDocs, // parses multipart fields into req.body + files into req.files
  validate(submitFarmerProfileSchema),
  profileCtrl.submitProfile
);

// --- Loan applications ---
router.post("/loan-applications", validate(createLoanApplicationSchema), loanAppCtrl.createApplication);
router.get("/loan-applications", loanAppCtrl.listMyApplications);
router.get("/loan-applications/:id", loanAppCtrl.getMyApplicationById);

// --- Installments / repayments ---
router.get("/installments", installmentCtrl.listMyInstallments);
router.post("/installments/:id/pay", validate(initiatePaymentSchema), installmentCtrl.initiatePayment);
router.post("/installments/:id/profit-report", validate(submitProfitReportSchema), installmentCtrl.submitProfitReport);
router.post("/installments/:id/mark-paid", validate(markPaidSchema), installmentCtrl.markAsPaid);

// --- Projects (Farmer perspective of Loan Applications & Marketplace Projects) ---
router.get("/projects", farmerProjectCtrl.listMyProjects);
router.get("/projects/:id", farmerProjectCtrl.getMyProjectById);
router.post("/projects", validate(createLoanApplicationSchema), farmerProjectCtrl.createMyProject);
router.put("/projects/:id", validate(updateFarmerProjectSchema), farmerProjectCtrl.updateMyProject);

// --- Transactions ---
router.get("/transactions", farmerTransactionCtrl.listFarmerTransactions);

// --- Notifications ---
router.get("/notifications", notificationCtrl.listMyNotifications);
router.put("/notifications/mark-all-read", notificationCtrl.markAllNotificationsAsRead);
router.put("/notifications/:id/read", notificationCtrl.markNotificationAsRead);

export default router;
