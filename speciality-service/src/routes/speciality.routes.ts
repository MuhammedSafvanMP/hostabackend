import { Router } from "express";
import {
  Registeration,
  getanSpeciality,
  updateData,
  specialityDelete,
  getSpecialitys,
} from "../controllers/speciality.controllers";
import { authenticate } from "../middleware/authenticate";

const router = Router();



// CRUD

router.post("/speciality/register",authenticate,Registeration);
router.get("/speciality", authenticate, getSpecialitys);
router.get("/speciality/:id",authenticate, getanSpeciality);
router.put("/speciality/:id",authenticate, updateData);
router.delete("/speciality/:id",authenticate, specialityDelete);

export default router;