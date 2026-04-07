import { Router } from "express";
import {
  Registeration,
  getanSpeciality,
  updateData,
  specialityDelete,
  getSpecialitys,
} from "../controllers/speciality.controllers";

const router = Router();



// CRUD

router.post("/speciality/register", Registeration);
router.get("/speciality", getSpecialitys);
router.get("/speciality/:id", getanSpeciality);
router.put("/speciality/:id", updateData);
router.delete("/speciality/:id", specialityDelete);

export default router;