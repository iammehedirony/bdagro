import { Router } from "express";
import { requireAuth, syncClerkUser } from "../middlewares/auth";
import * as notificationCtrl from "../controllers/notification.controller";

const router = Router();

router.use(requireAuth, syncClerkUser);
router.get("/", notificationCtrl.listMyNotifications);

export default router;