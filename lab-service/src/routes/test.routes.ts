import { Router } from "express";
import {
  create,
  getanTest,
  updateData,
  testDelete,
  getTest,

} from "../controllers/test.controllers";

import { authenticate, restrictTo } from "../middleware/authenticate";

const router = Router();

// CRUD
router.post("/test/register", authenticate, restrictTo("staff"), create);
router.get("/test", authenticate, restrictTo("staff"), getTest);
router.get("/test/:id", authenticate, restrictTo("staff"), getanTest);
router.put("/test/:id", authenticate, restrictTo("staff"), updateData);
router.delete("/test/:id", authenticate, restrictTo("staff"), testDelete);

export default router;