import { Router } from "express";
import {
  Registeration,
  login,
  getanLab,
  updateData,
  labDelete,
  getLab,
  forgetpassword,
  changepassword,
} from "../controllers/lab.controllers";
import { authenticate } from "../middleware/authenticate";
import { checkPermission } from "../middleware/role.middleware";

const router = Router();

// Auth
router.post("/lab",  Registeration);
router.post("/lab/login", login);
router.post("/lab/forgot", forgetpassword);
router.put("/lab/changepassword", changepassword);

// CRUD

router.get("/lab", authenticate, checkPermission("lab", "view"), getLab);
router.get("/lab/:id", authenticate, checkPermission("lab", "view"), getanLab);
router.put("/lab/:id", authenticate, checkPermission("lab", "edit"), updateData);
router.delete("/lab/:id", authenticate, checkPermission("lab", "delete"), labDelete);

export default router;