import { Router } from "express";

import { authenticate } from "../middleware/authenticate";

import {

  createNotification,
  getanNotification,
  getNotification,
  getRoleNotifications,
  markAsRead,
  updateData,
  notificationDelete,

} from "../controllers/notification.controllers";

import {
  validate,
  validateParams,
} from "../middleware/validate.middleware";

import {

  createNotificationSchema,
  updateNotificationSchema,
  getByRoleParamsSchema,

} from "../validations/notification.validation";
import { checkPermission } from "../middleware/role.middleware";

const router = Router();

/* =========================================================
   CREATE NOTIFICATION
========================================================= */

router.post(

  "/notification",

  validate(createNotificationSchema),
  authenticate,
  checkPermission("notification", "create"),

  createNotification

);

/* =========================================================
   GET ALL NOTIFICATIONS
========================================================= */

router.get(

  "/notification",

  getNotification

);

/* =========================================================
   GET ONE NOTIFICATION
========================================================= */

router.get(

  "/notification/:id",authenticate,
   checkPermission("notification", "view"),

  getanNotification

);

/* =========================================================
   GET ROLE NOTIFICATIONS
   EXAMPLE:
   /notification/user/10
   /notification/doctor/5
========================================================= */

router.get(

  "/notification/:role/:id",authenticate,

  validateParams(getByRoleParamsSchema),
   checkPermission("notification", "view"),

  getRoleNotifications

);

/* =========================================================
   MARK AS READ
   EXAMPLE:
   /notification/read/user/10/1

   role = user
   userId = 10
   notificationId = 1
========================================================= */

router.put(

  "/notification/read/:role/:userId/:notificationId",

  authenticate,
   checkPermission("notification", "edit"),

  markAsRead

);

/* =========================================================
   UPDATE NOTIFICATION
========================================================= */

router.put(

  "/notification/:id",

  validate(updateNotificationSchema),
  authenticate,
   checkPermission("notification", "edit"),

  updateData

);

/* =========================================================
   DELETE NOTIFICATION
========================================================= */

router.delete(

  "/notification/:id",
  authenticate,
   checkPermission("notification", "delete"),

  notificationDelete

);

export default router;

