import { Router } from "express";
import { syncClerkUser , requireAuth} from "../middlewares/auth";
import { requireRole } from "../middlewares/rbac";
import { validate } from "../middlewares/validate";
import { UserRole } from "../utils/constants";
import {
  rejectSchema,
  approveLoanApplicationSchema,
  updateAdminProfileSchema
} from "../validators/admin.validator";
import * as dashboardCtrl from "../controllers/admin.controller";


const router = Router();

// Every route below requires a logged-in, active Admin account.
router.use(requireAuth, syncClerkUser, requireRole(UserRole.ADMIN));

// --- Central dashboard ---
router.get("/dashboard", dashboardCtrl.getDashboard);

// --- Manual verification panel ("Pending Verifications") ---
router.get("/verifications", dashboardCtrl.listVerifications);
router.post("/verifications/:id/approve", dashboardCtrl.approveVerification);
router.post("/verifications/:id/reject", validate(rejectSchema), dashboardCtrl.rejectVerification);

// --- Loan approval system (approve -> creates the marketplace Project) ---
router.get("/loan-applications", dashboardCtrl.listLoanApplications);
router.get("/all-projects", dashboardCtrl.listAllProjects);
router.post(
  "/loan-applications/:id/approve",
  validate(approveLoanApplicationSchema),
  dashboardCtrl.approveLoanApplication
);
router.post("/loan-applications/:id/reject", validate(rejectSchema), dashboardCtrl.rejectLoanApplication);

// --- User & role management (RBAC) ---
router.get("/users", dashboardCtrl.listUsers);

// --- Monitoring & notifications ---
router.get("/transactions", dashboardCtrl.listAllTransactions);

// --- Profile ---
router.get("/profile", dashboardCtrl.getAdminProfile);
router.patch("/profile", validate(updateAdminProfileSchema), dashboardCtrl.updateAdminProfile);

export default router;
