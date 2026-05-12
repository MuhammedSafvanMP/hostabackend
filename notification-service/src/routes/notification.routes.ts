import { Router } from "express";
import {
  createNotification,
  getanNotification,
  updateData,
  notificationDelete,
  getNotification,
  getAllReadNotifications,
  getAllUnreadNotifications,
  updateNotificationRolandID,
  markAllNotificationsAsRead
} from "../controllers/notification.controllers";
import { validate, validateParams } from "../middleware/validate.middleware";
import {
  createNotificationSchema,
  updateNotificationSchema,
  getByRoleParamsSchema
} from "../validations/notification.validation";

const router = Router();

// Apply authentication to all routes
// router.use(authenticate);

// CRUD
router.post(
  "/notification",
  validate(createNotificationSchema),
  createNotification
);

router.get("/notification", getNotification);

router.get("/notification/:id", getanNotification);

router.put(
  "/notification/:id",
  validate(updateNotificationSchema),
  updateData
);

router.delete("/notification/:id", notificationDelete);

router.get(
  "/notification/unread/:id/:role",
  validateParams(getByRoleParamsSchema),
  getAllUnreadNotifications
);

router.get(
  "/notification/read/:id/:role",
  validateParams(getByRoleParamsSchema),
  getAllReadNotifications
);

router.put(
  "/notification/:role/:roleId/:id",
  updateNotificationRolandID
);

router.put(
  "/notifications/read-all/:role/:roleId",
  markAllNotificationsAsRead
);

export default router;





