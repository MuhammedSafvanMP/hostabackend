import { Router } from "express";
import {
  createAd,
  getAds,
  getSingleAd,
  updateAd,
  deleteAd,
} from "../controllers/ad.controller";
import { authenticate } from "../middleware/authenticate";
import { checkPermission } from "../middleware/role.middleware";

const router = Router();

router.post("/ads", authenticate, checkPermission("ad", "create"),  createAd);
router.get("/ads",  getAds);
router.get("/ads/:id", authenticate,  checkPermission("ad", "view"), getSingleAd);
router.put("/ads/:id", authenticate, checkPermission("ad", "edit"), updateAd);
router.delete("/ads/:id", authenticate, checkPermission("ad", "delete"), deleteAd);

export default router;
