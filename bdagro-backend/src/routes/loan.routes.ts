import { Router } from "express";
import { syncClerkUser,requireAuth } from "../middlewares/auth";
import { listLoanProducts } from "../controllers/loan.controller";

const router = Router();

// Any authenticated, active account (farmer or investor) can browse the catalog.
router.get("/", requireAuth, syncClerkUser, listLoanProducts);

export default router;
