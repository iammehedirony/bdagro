import { Router } from "express";
import { requireAuth } from "@clerk/express";
import { syncClerkUser } from "../middlewares/auth";
import { getMe, selectRole } from "../controllers/auth.controller";

const router = Router();

// requireAuth() ensures a valid Clerk session exists (401 otherwise);
// syncClerkUser resolves it into our local, typed `req.user`.
router.get("/me", requireAuth(), syncClerkUser, getMe);

// Intentionally NOT behind syncClerkUser — that middleware 404s an
// account with no role yet, which is exactly the account this route
// exists to create.
router.post("/select-role", requireAuth(), selectRole);

export default router;
