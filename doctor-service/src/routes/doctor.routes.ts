import { Router } from "express";
import {
  Registeration,
  login,
  getanDoctor,
  updateData,
  doctorDelete,
  getAmbulaces,
  forgetpassword,
  changepassword,
} from "../controllers/doctor.controllers";

const router = Router();

// Auth
router.post("/doctor/register", Registeration);
router.post("/doctor/login", login);
router.post("/doctor/forgot", forgetpassword);
router.put("/doctor/changepassword", changepassword);

// CRUD
router.get("/doctor", getAmbulaces);
router.get("/doctor/:id", getanDoctor);
router.put("/doctor/:id", updateData);
router.delete("/doctor/:id", doctorDelete);

export default router;