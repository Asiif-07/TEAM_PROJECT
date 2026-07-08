import express from "express";
import { getNotifications, markAsRead, markAllAsRead } from "../controller/notification_controller.js";
import authMiddleWare from "../middleWare/authMiddleWare.js";

const router = express.Router();

router.get("/", authMiddleWare, getNotifications);
router.patch("/:notificationId/read", authMiddleWare, markAsRead);
router.patch("/read-all", authMiddleWare, markAllAsRead);

export default router;
