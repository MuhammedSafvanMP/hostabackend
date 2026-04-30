import { Router } from "express";
import {
  registerUser,
  loginUser,
  getUsers,
  getUser,
  deleteUser,
  createPatient,
  getPatients,
  getPatient,
} from "../controllers/user.controller";
import {
  createPrescription,
  getPrescription,
  getAPrescription,
  deletePrescription,
  updateData
} from "../controllers/prescription.controller";


import { validate, validateParams } from "../middleware/validate.middleware";
import { registerSchema, loginSchema, idParamSchema } from "../validators/user.validator";
import { authenticate } from "../middleware/authenticate";

const router = Router();

// User Routes
router.post("/users", validate(registerSchema), registerUser);
router.post("/users/login", validate(loginSchema), loginUser);
router.get("/users", authenticate, getUsers);
router.get("/users/:id", authenticate, validateParams(idParamSchema), getUser);
router.delete("/users/:id", authenticate, validateParams(idParamSchema), deleteUser);

// Patient Routes
router.post("/patients", authenticate, createPatient);
router.get("/patients", authenticate, getPatients);
router.get("/patients/:id", authenticate, validateParams(idParamSchema), getPatient);


// Prescription

router.post("/prescription", authenticate, createPrescription);
router.get("/prescription", authenticate, getPrescription);
router.get("/prescription/:id", authenticate, getAPrescription);
router.put("/prescription/:id", authenticate, updateData);
router.delete("/prescription/:id", authenticate, deletePrescription);


export default router;
