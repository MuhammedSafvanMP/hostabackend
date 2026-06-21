// import { Router } from "express";
// import {
//   createNotification,
//   getanNotification,
//   updateData,
//   notificationDelete,
//   getNotification,
//   getAllReadNotifications,
//   getAllUnreadNotifications,
//   updateNotificationRolandID,
//   markAllNotificationsAsRead
// } from "../controllers/notification.controllers";
// import { validate, validateParams } from "../middleware/validate.middleware";
// import {
//   createNotificationSchema,
//   updateNotificationSchema,
//   getByRoleParamsSchema
// } from "../validations/notification.validation";

// const router = Router();

// // Apply authentication to all routes
// // router.use(authenticate);

// // CRUD
// router.post(
//   "/notification",
//   validate(createNotificationSchema),
//   createNotification
// );

// router.get("/notification", getNotification);

// router.get("/notification/:id", getanNotification);

// router.put(
//   "/notification/:id",
//   validate(updateNotificationSchema),
//   updateData
// );

// router.delete("/notification/:id", notificationDelete);

// router.get(
//   "/notification/unread/:id/:role",
//   validateParams(getByRoleParamsSchema),
//   getAllUnreadNotifications
// );

// router.get(
//   "/notification/read/:id/:role",
//   validateParams(getByRoleParamsSchema),
//   getAllReadNotifications
// );

// router.put(
//   "/notification/:role/:roleId/:id",
//   updateNotificationRolandID
// );

// router.put(
//   "/notifications/read-all/:role/:roleId",
//   markAllNotificationsAsRead
// );

// export default router;




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

const router = Router();

/* =========================================================
   CREATE NOTIFICATION
========================================================= */

router.post(

  "/notification",

  validate(createNotificationSchema),

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

  "/notification/:id",

  getanNotification

);

/* =========================================================
   GET ROLE NOTIFICATIONS
   EXAMPLE:
   /notification/user/10
   /notification/doctor/5
========================================================= */

router.get(

  "/notification/:role/:id",

  validateParams(getByRoleParamsSchema),

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

  

  markAsRead

);

/* =========================================================
   UPDATE NOTIFICATION
========================================================= */

router.put(

  "/notification/:id",

  validate(updateNotificationSchema),

  updateData

);

/* =========================================================
   DELETE NOTIFICATION
========================================================= */

router.delete(

  "/notification/:id",

  notificationDelete

);

export default router;

