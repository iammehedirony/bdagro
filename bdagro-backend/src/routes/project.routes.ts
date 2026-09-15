import { Router } from "express";
import { syncClerkUser, requireAuth } from "../middlewares/auth";
import { validate } from "../middlewares/validate";
import { listProjectsQuerySchema } from "../validators/investor.validator";
import { listProjects, getProjectById } from "../controllers/project.controller";

const router = Router();

// Any authenticated, active account can browse the marketplace
// (primarily investors, but nothing role-sensitive is exposed here).
router.get("/", requireAuth, syncClerkUser, validate(listProjectsQuerySchema, "query"), listProjects);
router.get("/:id", requireAuth, syncClerkUser, getProjectById);

export default router;
