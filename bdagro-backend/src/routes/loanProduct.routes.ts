import { Router } from "express";
import { requireAuth } from "@clerk/express";
import { syncClerkUser } from "../middlewares/auth";
import { listLoanProducts } from "../controllers/loanProduct.controller";

const router = Router();

// Any authenticated, active account (farmer or investor) can browse the catalog.
router.get("/", requireAuth(), syncClerkUser, listLoanProducts);

export default router;
