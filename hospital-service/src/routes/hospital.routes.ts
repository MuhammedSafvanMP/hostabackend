import { Router } from "express";
import {
  Registeration,
  login,
  getanHospital,
  updateData,
  hospitalDelete,
  getHospital,
  forgetpassword,
  changepassword,
} from "../controllers/hospital.controllers";
import { authenticate } from "../middleware/authenticate";
import { checkPermission } from "../middleware/role.middleware";

const router = Router();

// Auth
router.post("/hospital",  authenticate, checkPermission("hospital", "create"), Registeration);
router.post("/hospital/login", login);
router.post("/hospital/forgot", forgetpassword);
router.put("/hospital/changepassword", changepassword);

// CRUD

router.get("/hospital",  authenticate, checkPermission("hospital", "view"), getHospital);
router.get("/hospital/:id",  checkPermission("hospital", "view"), getanHospital);
router.put("/hospital/:id",  authenticate, checkPermission("hospital", "edit"), updateData);
router.delete("/hospital/:id",  authenticate, checkPermission("hospital", "delete"), hospitalDelete);

export default router;