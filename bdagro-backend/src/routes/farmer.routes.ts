import { Router } from "express";
import { requireAuth } from "@clerk/express";
import { syncClerkUser } from "../middlewares/auth";
import { requireRole } from "../middlewares/rbac";
import { validate } from "../middlewares/validate";
import { uploadFarmerDocs } from "../middlewares/upload";
import { UserRole } from "../utils/constants";
import { submitFarmerProfileSchema, createLoanApplicationSchema, initiatePaymentSchema } from "../validators/farmer.validator";
import * as profileCtrl from "../controllers/farmerProfile.controller";
import * as loanAppCtrl from "../controllers/loanApplication.controller";
import * as installmentCtrl from "../controllers/installment.controller";

const router = Router();

// Every route below requires a logged-in, active Farmer account.
router.use(requireAuth(), syncClerkUser, requireRole(UserRole.FARMER));

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

export default router;
