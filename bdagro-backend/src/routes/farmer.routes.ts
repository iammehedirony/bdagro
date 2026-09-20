import { Router } from "express";
import { syncClerkUser, requireAuth } from "../middlewares/auth";
import { requireRole } from "../middlewares/rbac";
import { validate } from "../middlewares/validate";
import { uploadFarmerDocs, uploadLoanDocs } from "../middlewares/upload";
import { UserRole } from "../utils/constants";
import { submitFarmerProfileSchema, createLoanApplicationSchema, saveProjectProfitReportSchema, updateFarmerProjectSchema } from "../validators/farmer.validator";
import { updateFarmerProfileSchema } from "../validators/settings.validator";
import * as farmerCtrl from "../controllers/farmer.controller";
import * as notificationCtrl from "../controllers/notification.controller";


const router = Router();

// Every route below requires a logged-in, active Farmer account.
router.use(requireAuth, syncClerkUser, requireRole(UserRole.FARMER));

// --- Dashboard ---
router.get("/dashboard", farmerCtrl.getFarmerDashboard);

// --- Profile & document verification ---
router.get("/profile", farmerCtrl.getFarmerProfile);
router.patch(
  "/profile",
  validate(updateFarmerProfileSchema),
  farmerCtrl.updateFarmerProfile
);
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
router.get("/loan-applications/:id", farmerCtrl.getMyApplicationById);

// --- Projects (Farmer perspective of Loan Applications & Marketplace Projects) ---
router.get("/projects", farmerCtrl.listMyProjects);
router.get("/projects/:id", farmerCtrl.getMyProjectById);
router.post("/projects/:id/profit-report", validate(saveProjectProfitReportSchema), farmerCtrl.saveProjectProfitReport);
router.patch("/projects/:id", validate(updateFarmerProjectSchema), farmerCtrl.updateMyProject);

// --- Transactions ---
router.get("/profit-distribution", farmerCtrl.getProfitDistribution);
router.get("/transactions", farmerCtrl.listFarmerTransactions);

// --- Notifications ---
router.get("/notifications", notificationCtrl.listMyNotifications);

export default router;