import { Router } from "express";
import { requireAuth, syncClerkUser } from "../middlewares/auth";
import * as notificationCtrl from "../controllers/notification.controller";

const router = Router();

router.use(requireAuth, syncClerkUser);
router.get("/", notificationCtrl.listMyNotifications);
router.put("/mark-all-read", notificationCtrl.markAllNotificationsAsRead);
router.put("/:id/read", notificationCtrl.markNotificationAsRead);

export default router;