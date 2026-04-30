import { Router } from "express";
import {
  Registeration,
  getanBooking,
  updateData,
  bookingDelete,
  getBooking,
 
} from "../controllers/booking.controllers";
import { authenticate } from "../middleware/authenticate";

const router = Router();




// CRUD

router.post("/booking/register", authenticate, Registeration);
router.get("/booking", getBooking);
router.get("/booking/:id", getanBooking);
router.put("/booking/:id", updateData);
router.delete("/booking/:id", bookingDelete);

export default router;