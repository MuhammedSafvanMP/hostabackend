import { Router } from "express";
import { validate } from "../middleware/validate.middleware";
import { 
  registerHospitalSchema, 
  loginHospitalSchema, 
  loginWithPhoneSchema, 
  verifyOtpSchema, 
  changePasswordSchema,
  loginWithEmailSchema,
  resetPasswordSchema,
  sendCustomEmailSchema 
} from "../validators/hospital.validator";
import { 
  Registeration,
  login,
  loginWithPhone,
  sendOtp,
  verifyOtp,
  verifyLoginOtp,
  resetPassword,
  changePassword,
  sendCustomEmail,
  getanHospital,
  getHospital,
  updateData,
  hospitalDelete 
} from "../controllers/hospital.controllers";
import { authenticate } from "../middleware/authenticate";

const router = Router();

// Auth & Password Flow
router.post("/hospital/register", validate(registerHospitalSchema), Registeration);
router.post("/hospital/login", validate(loginHospitalSchema), login);
router.post("/hospital/login/phone", validate(loginWithPhoneSchema), loginWithPhone);
router.post("/hospital/otp",validate(verifyOtpSchema),verifyLoginOtp)


// Production Auth Routes
router.post("/hospital/auth/send-otp", validate(loginWithEmailSchema), sendOtp);
router.post("/hospital/auth/verify-otp", validate(verifyOtpSchema), verifyOtp);
router.post("/hospital/auth/reset-password", validate(resetPasswordSchema), resetPassword);
router.put("/hospital/auth/change-password", authenticate, validate(changePasswordSchema), changePassword);

// Notifications
router.post("/hospital/notify/email", authenticate, validate(sendCustomEmailSchema), sendCustomEmail);

// CRUD

router.get("/hospital",authenticate, getHospital);
router.get("/hospital/:id", getanHospital);
router.put("/hospital/:id",authenticate, updateData);
router.delete("/hospital/:id",authenticate, hospitalDelete);

export default router;

