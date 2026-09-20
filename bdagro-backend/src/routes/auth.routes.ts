import { Router } from "express";
import { requireAuth } from "../middlewares/auth";
import { selectRole } from "../controllers/auth.controller";

const router = Router();

// Intentionally NOT behind syncClerkUser — that middleware 404s an
// account with no role yet, which is exactly the account this route
// exists to create.
router.post("/select-role", requireAuth, selectRole);

export default router;
