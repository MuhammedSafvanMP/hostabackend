import { Router } from "express";
import {
  registerUser,
  loginUser,
  loginWithPhone,
  verifyOtp,
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  resetPassword,
  sendOtpEmail,
  verifyOtpEmail,
  resetPasswordEmail,
  changePassword,
  saveExpoToken,
  testPushNotification,
  createPatient,
  getPatients,
  getPatient,
  updatePatient,
  deletePatient,
  getBlacklistedPatients,
  refreshUserToken,
  logout,
  getBlacklistedUsers,
  sendEnquiry
} from "../controllers/user.controller";

import {
  createPrescription,
  getPrescription,
  getAPrescription,
  deletePrescription,
  updateData
} from "../controllers/prescription.controller";

import {
addVitals,
deleteVitals,
getLatestVitals,
getVitalsById,
getVitalsByPatient,
updateVitals
} from "../controllers/patientVitals.controller";

import {
  createLabResult,
  getLabResults,
  getLabResult,
  updateLabResult,
  deleteLabResult,
} from "../controllers/labResult.controller";

import {
  createDocument,
  getDocuments,
  getDocument,
  updateDocument,
  deleteDocument,
} from "../controllers/document.controller";

import { validate, validateParams } from "../middleware/validate.middleware";
import { registerSchema, loginSchema, idParamSchema, loginWithPhoneSchema, verifyOtpSchema, updateUserSchema, sendOtpEmailSchema, verifyOtpEmailSchema, resetPasswordEmailSchema, changePasswordSchema } from "../validators/user.validator";
import { authenticate, restrictTo } from "../middleware/authenticate";
import { checkPermission } from "../middleware/role.middleware";

const router = Router();                              

// User Routes
router.post("/users", validate(registerSchema), registerUser);
router.post("/users/login", validate(loginSchema), loginUser);
router.post("/users/login/phone", validate(loginWithPhoneSchema), loginWithPhone);
router.post("/users/otp", validate(verifyOtpSchema), verifyOtp);
// router.post("/users/password", resetPassword);

// Email Password Reset Flow
router.post("/users/auth/send-otp", validate(sendOtpEmailSchema), sendOtpEmail);
router.post("/users/auth/verify-otp", validate(verifyOtpEmailSchema), verifyOtpEmail);
router.post("/users/auth/reset-password", validate(resetPasswordEmailSchema), resetPasswordEmail);
router.put("/users/auth/change-password", validate(changePasswordSchema), changePassword);

// Refresh and Logout
router.post("/users/refresh", refreshUserToken);
router.post("/users/logout",authenticate, logout);

router.get("/users",   getUsers);
router.get("/users/blacklist", getBlacklistedUsers);
router.get("/users/:id", validateParams(idParamSchema), getUser);
router.put("/users/:id", validateParams(idParamSchema), validate(updateUserSchema), updateUser);
router.delete("/users/:id", validateParams(idParamSchema), deleteUser);


// router.post("/users/:id/token", validateParams(idParamSchema), saveExpoToken);
// router.post("/users/test/:id", validateParams(idParamSchema), testPushNotification);


// Patient Routes
router.post("/patients", createPatient);
router.get("/patients",   getPatients);
router.get("/patients/blacklist", getBlacklistedPatients);
router.get("/patients/:id", validateParams(idParamSchema), getPatient);
router.put("/patients/:id", validateParams(idParamSchema), updatePatient);
router.delete("/patients/:id", validateParams(idParamSchema), deletePatient);



// Prescription

router.post("/prescription",  createPrescription);
router.get("/prescription",  getPrescription);
router.get("/prescription/:id",  getAPrescription);
router.put("/prescription/:id",  updateData);
router.delete("/prescription/:id",  deletePrescription);


router.post("/vitals",  addVitals);
router.get("/vitals",  getLatestVitals);
router.get("/vitals/:id",  getVitalsById);
router.put("/vitals/:id",  updateVitals);
router.get("/vitals/patient/:patientId",  getVitalsByPatient);
router.delete("/vitals/:id",  deleteVitals);


// Lab Result
router.post("/lab-results",  createLabResult);
router.get("/lab-results",  getLabResults);
router.get("/lab-results/:id", validateParams(idParamSchema), getLabResult);
router.put("/lab-results/:id", validateParams(idParamSchema), updateLabResult);
router.delete("/lab-results/:id", validateParams(idParamSchema), deleteLabResult);

// Document
router.post("/documents",  createDocument);
router.get("/documents",  getDocuments);
router.get("/documents/:id", validateParams(idParamSchema), getDocument);
router.put("/documents/:id", validateParams(idParamSchema), updateDocument);
router.delete("/documents/:id", validateParams(idParamSchema), deleteDocument);

router.post("/email-enquiry",   sendEnquiry);


export default router;








