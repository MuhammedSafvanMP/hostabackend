import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import Booking from "../models/booking.model";
import { publishEvent } from "../events/publisher";
import { httpClient } from "../utils/httpClient";
import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

// REGISTER - POST /boooking/register
// REGISTER - POST /booking/register
export const Registeration: any = asyncHandler(
  async (req: any, res: Response): Promise<void> => {
    const {
      patient_dob,
      patient_name,
      patient_place,
      patient_phone,
      userId: bodyUserId,
      hospitalId,
      doctorId,
      booking_date,
      consulting_time,
    } = req.body;

    const tokenUserId = req.user.id;
    const authHeader = req.headers.authorization;

    // ==============================
    // 1. SECURITY CHECK
    // ==============================
    if (bodyUserId && Number(bodyUserId) !== Number(tokenUserId)) {
      res.status(403).json({
        success: false,
        message: "User ID mismatch",
      });
      return;
    }

    const userId = tokenUserId;
    const errors: string[] = [];

    // ==============================
    // 2. VALIDATE USER
    // ==============================
    try {
      await httpClient.get(
        `${process.env.USER_SERVICE_URL}/users/${userId}`,
        { headers: { Authorization: authHeader } }
      );
    } catch {
      errors.push("User not found");
    }

    // ==============================
    // 3. VALIDATE HOSPITAL
    // ==============================
    try {
      await httpClient.get(
        `${process.env.HOSPITAL_SERVICE_URL}/hospital/${hospitalId}`,
        { headers: { Authorization: authHeader } }
      );
    } catch {
      errors.push("Hospital not found");
    }

    // ==============================
    // 4. VALIDATE DOCTOR (FIXED)
    // ==============================
    let doctor: any;
    let hospital: any;

    try {
      const [doctorRes, hospitalRes] = await Promise.all([
        httpClient.get(
          `${process.env.DOCTOR_SERVICE_URL}/doctor/${doctorId}`,
          { headers: { Authorization: authHeader } }
        ),
        httpClient.get(
          `${process.env.HOSPITAL_SERVICE_URL}/hospital/${hospitalId}`,
          { headers: { Authorization: authHeader } }
        )
      ]);

      // IMPORTANT FIX: correct axios structure
      doctor = doctorRes.data;
      hospital = hospitalRes.data;
    } catch {
      res.status(404).json({
        success: false,
        message: "Doctor or Hospital not found",
      });
      return;
    }

    // ==============================
    // 5. STOP IF ERRORS EXIST
    // ==============================
    if (errors.length > 0) {
      res.status(404).json({
        success: false,
        message: "Validation failed",
        errors,
      });
      return;
    }

    // ==============================
    // 6. CREATE BOOKING
    // ==============================
    const newbooking = await Booking.create({
      patient_dob,
      patient_name,
      patient_place,
      patient_phone,
      userId,
      hospitalId,
      doctorId,
      booking_date,
      consulting_time,
    });

    // ==============================
    // 7. SAFE EXTERNAL CALLS
    // ==============================

    const doctorName = doctor?.data?.displayName || "Unknown Doctor"; 
    const hospitalName = hospital?.data?.name || `Hospital (ID: ${hospitalId})`;
      

    await Promise.allSettled([
      // BullMQ Service
      axios.post(
        `${process.env.BULMQ_SERVICE_URL}/booking-task/hospital`,
        {
          doctorId,
          hospitalId,
          message: `New booking for Dr. ${doctorName} at ${hospitalName} on ${booking_date}`,
        },
        { headers: { Authorization: authHeader } }
      ),
    ]);

    // ==============================
    // 8. EVENT PUBLISH
    // ==============================
    const payload = {
      bookingId: newbooking.id,
      userId: userId,
      hospitalId: hospitalId,
      doctorId: doctorId,
      patient_name: patient_name,
      doctorName: doctorName,
      hospitalName: hospitalName,
      booking_date: booking_date,
    };

    console.log("📤 Publishing BOOKING_REGISTERED event with payload:", JSON.stringify(payload, null, 2));

    await publishEvent("booking_events", "BOOKING_REGISTERED", payload);

    // ==============================
    // 9. RESPONSE
    // ==============================
    res.status(201).json({
      success: true,
      message: "Registration completed",
      data: newbooking,
    });

    return;
  }
);

// GET ONE - GET /booking/:id
export const getanBooking: any = asyncHandler(
  async (req: Request, res: Response) => {
    const booking = await Booking.findByPk(req.params.id);
    if (!booking) {
      res.status(404).json({
        success: false,
        message: "booking not found",
        data: null,
        error: { code: "BOOKING_NOT_FOUND", details: null },
      });
      return;
    }

    res.status(200).json({
      success: true,
      status: "Success",
      data: booking,
      error: null,
    });
  },
);

// UPDATE - PUT /booking/:id
export const updateData: any = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const updatePayload = req.body;
    const authHeader = req.headers.authorization;

    const booking = await Booking.update(updatePayload, {
      where: { id: id },
      returning: true,
    });

    if (!booking[1] || booking[1].length === 0) {
      res.status(404).json({
        success: false,
        message: "booking not found",
        status: 200,
        data: null,
        error: { code: "BOOKING_NOT_FOUND", details: null },
      });
      return;
    }

    // ✅ Get updated booking object
    const updatedBooking = booking[1][0];

    const eventName = updatedBooking.status === "cancel" ? "BOOKING_CANCELLED" : "BOOKING_UPDATED";
    
    const eventPayload = {
      bookingId: updatedBooking.id,
      userId: updatedBooking.userId,
      hospitalId: updatedBooking.hospitalId,
      doctorId: updatedBooking.doctorId,
      patient_name: updatedBooking.patient_name,
      status: updatedBooking.status
    };

    console.log(`📤 Publishing ${eventName} event with payload:`, JSON.stringify(eventPayload, null, 2));
    
    await publishEvent("booking_events", eventName, eventPayload);

    if (updatedBooking.status !== "cancel") {
      // ✅ Use correct values
      await axios.post(
        `${process.env.BULMQ_SERVICE_URL}/booking-task/users`,
        {
          patient_phone: updatedBooking?.patient_phone,
          doctorId: updatedBooking?.doctorId,
          status: updatedBooking?.status,
          consulting_time: updatedBooking?.consulting_time,
          message: `Booking ${updatedBooking?.status}`,
        },
         {
          headers: { Authorization: authHeader },
        },
      );
    }

    

    res.status(200).json({
      success: true,
      message: "successfully updated",
      data: updatedBooking,
      error: null,
    });
  },
);

// DELETE - DELETE /booking/:id
export const bookingDelete: any = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;

    const staff = await Booking.findByPk(id);
    if (!staff) {
      res.status(404).json({
        success: false,
        message: "booking not found",
        data: null,
        error: { code: "BOOKING_NOT_FOUND", details: null },
      });
      return;
    }

    await Booking.destroy({
      where: { id: id },
    });

    res.status(200).json({
      success: true,
      message: "Your account deleted successfully",
      status: 200,
      data: null,
      error: null,
    });
  },
);

// GET ALL - GET /booking
export const getBooking: any = asyncHandler(
  async (req: Request, res: Response) => {
    const booking = await Booking.findAll();

    if (booking.length === 0) {
      res.status(404).json({
        success: false,
        message: "No data found",
        data: null,
        error: { code: "NO_DATA_FOUND", details: null },
      });
      return;
    }

    res.status(200).json({
      success: true,
      status: "Success",
      data: booking,
      error: null,
    });
  },
);
