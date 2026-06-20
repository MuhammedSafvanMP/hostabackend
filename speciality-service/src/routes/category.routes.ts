import { Router } from "express";
import {
 Registeration,
 categoryDelete,
 getCategorys,
 getanCategory,
 updateData
} from "../controllers/category.controllers";
import { authenticate } from "../middleware/authenticate";
import { checkPermission } from "../middleware/role.middleware";

const router = Router();



// CRUD

router.post("/category", Registeration);
router.get("/category",  getCategorys);
router.get("/category/:id", getanCategory);
router.put("/category/:id", updateData);
router.delete("/category/:id", categoryDelete);


export default router;