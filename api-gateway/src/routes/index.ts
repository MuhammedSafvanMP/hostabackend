import express from "express";
import ambulanceRoutes from "./ambulance.routes";
import userRoutes from "./user.routes";

import bloodRoutes from "./blood.routes";
import bloodBankRoutes from "./bloodBank.routes";
import pharmacyRoutes from "./pharmacy.routes";
import staffRoutes from "./staff.routes";
import doctorRoutes from "./doctor.routes";
import specialityRoutes from "./speciality.routes";
import hospitalRoutes from "./hospital.routes";

const router = express.Router();

router.use("/", bloodRoutes);
router.use("/", bloodBankRoutes);
router.use("/", ambulanceRoutes);
router.use("/", userRoutes);
router.use("/", pharmacyRoutes);
router.use("/", staffRoutes);
router.use("/", doctorRoutes);
router.use("/", specialityRoutes);
router.use("/", hospitalRoutes);
export default router;
