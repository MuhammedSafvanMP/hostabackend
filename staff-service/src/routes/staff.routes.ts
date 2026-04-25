import { Router } from "express";
import {
  Registeration,
  login,
  getanStaff,
  updateData,
  staffDelete,
  getStaffs,
  forgetpassword,
  changepassword,
} from "../controllers/staff.controllers";
import { authenticate } from "../middleware/authenticate";
import { checkPermission } from "../middleware/role.middleware";

const router = Router();

// Auth
router.post("/staff", authenticate, checkPermission("staff", "create"), Registeration);
router.post("/staff/login",  login);
router.post("/staff/forgot", authenticate, checkPermission("staff", "create"), forgetpassword);
router.put("/staff/changepassword", authenticate, checkPermission("staff", "edit"), changepassword);

// CRUD

router.get("/staff", authenticate, checkPermission("staff", "view"), getStaffs);
router.get("/staff/:id", authenticate, checkPermission("staff", "view"), getanStaff);
router.put("/staff/:id", authenticate, checkPermission("staff", "edit"), updateData);
router.delete("/staff/:id", authenticate, checkPermission("staff", "delete"), staffDelete);

export default router;