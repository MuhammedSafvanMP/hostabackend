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

router.post("/ad", checkPermission("ad", "create"), createAd);
router.get("/ad",  getAds);
router.get("/ad/:id",  checkPermission("ad", "view"), getSingleAd);
router.put("/ad/:id", checkPermission("ad", "edit"), updateAd);
router.delete("/ad/:id", checkPermission("ad", "delete"), deleteAd);

export default router;
