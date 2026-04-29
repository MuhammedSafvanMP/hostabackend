import { Router } from "express";
import {
  create,
  getanReport,
  updateData,
  reportDelete,
  getReport,

} from "../controllers/report.controllers";

import { authenticate, restrictTo } from "../middleware/authenticate";

const router = Router();

// CRUD
router.post("/report/register", authenticate, restrictTo("staff"), create);
router.get("/report", authenticate, restrictTo("staff"), getReport);
router.get("/report/:id", authenticate, restrictTo("staff"), getanReport);
router.put("/report/:id", authenticate, restrictTo("staff"), updateData);
router.delete("/report/:id", authenticate, restrictTo("staff"), reportDelete);


export default router;