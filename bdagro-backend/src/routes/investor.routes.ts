import { Router } from "express";
import { requireAuth } from "@clerk/express";
import { syncClerkUser } from "../middlewares/auth";
import { requireRole } from "../middlewares/rbac";
import { validate } from "../middlewares/validate";
import { UserRole } from "../utils/constants";
import { createInvestmentSchema } from "../validators/investor.validator";
import * as investmentCtrl from "../controllers/investment.controller";
import * as portfolioCtrl from "../controllers/portfolio.controller";
import * as transactionCtrl from "../controllers/transaction.controller";

const router = Router();

// Every route below requires a logged-in, active Investor account.
router.use(requireAuth(), syncClerkUser, requireRole(UserRole.INVESTOR));

// --- Funding & investment ---
router.post("/investments", validate(createInvestmentSchema), investmentCtrl.createInvestment);
router.get("/investments", investmentCtrl.listMyInvestments);
router.get("/investments/:id", investmentCtrl.getMyInvestmentById);

// --- Portfolio dashboard ---
router.get("/portfolio", portfolioCtrl.getPortfolio);

// --- Transaction history & receipts ---
router.get("/transactions", transactionCtrl.listMyTransactions);
router.get("/transactions/:id/receipt", transactionCtrl.getMyTransactionReceipt);

export default router;
