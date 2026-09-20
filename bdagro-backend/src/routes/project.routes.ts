import { Router } from "express";
import { syncClerkUser, requireAuth } from "../middlewares/auth";
import { requireRole } from "../middlewares/rbac";
import { UserRole } from "../utils/constants";
import { validate } from "../middlewares/validate";
import { listProjectsQuerySchema } from "../validators/investor.validator";
import { manualPayoutSchema, completePayoutSchema } from "../validators/payout.validator";
import { listProjects, getProjectById, getProjectPayouts, markInvestmentPayout, completeProjectPayout, getFeaturedOngoingProjects } from "../controllers/project.controller";

const router = Router();

// Public endpoint - no authentication required
router.get("/featured-ongoing", getFeaturedOngoingProjects);

// Any authenticated, active account can browse the marketplace
// (primarily investors, but nothing role-sensitive is exposed here).
router.get("/", requireAuth, syncClerkUser, validate(listProjectsQuerySchema, "query"), listProjects);
router.get("/:id", requireAuth, syncClerkUser, getProjectById);
router.get("/:id/payouts", requireAuth, syncClerkUser, requireRole(UserRole.FARMER), getProjectPayouts);
router.patch("/:id/payouts/:investmentId", requireAuth, syncClerkUser, requireRole(UserRole.FARMER), validate(manualPayoutSchema), markInvestmentPayout);
router.put("/:id/complete-payout", requireAuth, syncClerkUser, requireRole(UserRole.FARMER), validate(completePayoutSchema), completeProjectPayout);

export default router;
