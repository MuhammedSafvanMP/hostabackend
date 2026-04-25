import { Router } from "express";
import {
  Registeration,
  login,
  getanDoctor,
  updateData,
  doctorDelete,
  getDoctors,
  forgetpassword,
  changepassword,
} from "../controllers/doctor.controllers";
import { checkPermission } from "../middleware/role.middleware";
import { authenticate } from "../middleware/authenticate";

const router = Router();

// Auth
router.post("/doctor", checkPermission("doctor", "create"), Registeration);
router.post("/doctor/login", login);
router.post("/doctor/forgot", forgetpassword);
router.put("/doctor/changepassword",  changepassword);

// CRUD

router.get("/doctor", authenticate, checkPermission("doctor", "view"), getDoctors);
router.get("/doctor/:id", authenticate, checkPermission("doctor", "view"), getanDoctor);
router.put("/doctor/:id", authenticate, checkPermission("doctor", "edit"), updateData);
router.delete("/doctor/:id", authenticate, checkPermission("doctor", "delete"), doctorDelete);

export default router;