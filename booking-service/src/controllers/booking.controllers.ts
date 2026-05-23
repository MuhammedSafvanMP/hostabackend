import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import Booking from "../models/booking.model";
import { publishEvent } from "../events/publisher";
import { httpClient } from "../utils/httpClient";
import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

// REGISTER - POST /booking/register
export const Registeration: any = asyncHandler(
  async (req: any, res: Response): Promise<void> => {
    const {
      patient_dob,
      patient_age,
      patient_gender,
      patient_name,
      patient_place,
      patient_phone,
      userId,
      hospitalId,
      doctorId,
      department,
      displayName,
      booking_date,
      consulting_time,
      booking_status
    } = req.body;

    
    
    const errors: string[] = [];

    // ==============================
    // 2. VALIDATE USER
    // ==============================
    try {
      await httpClient.get(
        `${process.env.USER_SERVICE_URL}/users/${userId}`,
        { headers: { Authorization: req.headers.authorization } }
      );
    } catch {
      errors.push("User not found");
    }

    // ==============================
    // 3. VALIDATE HOSPITAL
    // ==============================
    let hospitalRes: any;
    try {
      hospitalRes = await httpClient.get(
        `${process.env.HOSPITAL_SERVICE_URL}/hospital/${hospitalId}`,
        { headers: { Authorization: req.headers.authorization } }
      );
    } catch {
      errors.push("Hospital not found");
    }

    // ==============================
    // 4. VALIDATE DOCTOR (FIXED)
    // ==============================
    let doctor: any;

    try {
      const doctorRes = await httpClient.get(
        `${process.env.DOCTOR_SERVICE_URL}/doctor/${doctorId}`,
        { headers: { Authorization: req.headers.authorization } }
      );

      // IMPORTANT FIX: correct axios structure
      doctor = doctorRes.data;
    } catch {
      res.status(404).json({
        success: false,
        message: "Doctor not found",
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
      patient_age,
      patient_gender,
      patient_name,
      patient_place,
      patient_phone,
      userId,
      hospitalId,
      doctorId,
      booking_date,
      doctor_name: displayName,
      doctor_department: department,
      consulting_time,
      booking_status: booking_status || "user booking",
    });

    // ==============================
    // 7. SAFE EXTERNAL CALLS
    // ==============================

    const doctorName =
      doctor?.data?.displayName || "Unknown Doctor"; 
    const hospitalName =
      hospitalRes?.data?.data?.name || `Hospital (ID: ${hospitalId})`;

    await Promise.allSettled([
      // Notification Service
      httpClient.post(
        `${process.env.NOTIFICATION_SERVICE_URL}/notification`,
        {
          hospitalIds: hospitalId ? [Number(hospitalId)] : [],
          doctorIds: doctorId ? [Number(doctorId)] : [],
          message: `New booking for Dr. ${doctorName} on ${booking_date}`,
        },
        { headers: { Authorization: req.headers.authorization} }
      ),

      // BullMQ Service
      axios.post(
        `${process.env.BULMQ_SERVICE_URL}/booking-task/hospital`,
        {
          doctorId,
          hospitalId,
          message: `New booking for Dr. ${doctorName} on ${booking_date}`,
        },
        { headers: { Authorization: req.headers.authorization }}
      ),
    ]);

    // ==============================
    // 8. EVENT PUBLISH
    // ==============================
    await publishEvent("booking_events", "BOOKING_REGISTERED", {
      bookingId: newbooking.id,
      userId,
      hospitalId,
      doctorId,
      patient_name,
      doctorName,
      hospitalName,
      booking_date,
    });

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
    try {
      const { id } = req.params;
      const updatePayload = req.body;
      

      const booking = await Booking.update(updatePayload, {
        where: { id: id },
        returning: true,
      });

      if (!booking[1] || booking[1].length === 0) {
        res.status(404).json({
          success: false,
          message: "booking not found",
          status: 404,
          data: null,
          error: { code: "BOOKING_NOT_FOUND", details: `No booking exists with ID ${id}` },
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
        try {
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
              headers: { Authorization: req.headers.authorization },
            },
          );
        } catch (bulmqError: any) {
          console.error("⚠️ Failed to trigger BullMQ reminder service:", bulmqError.message);
        }

        let doctor: any;
        try {
          const doctorRes = await httpClient.get(
            `${process.env.DOCTOR_SERVICE_URL}/doctor/${updatedBooking.doctorId}`,
            {
              headers: { Authorization: req.headers.authorization },
            },
          );
          doctor = doctorRes.data;
        } catch (doctorError: any) {
          console.error("⚠️ Failed to fetch doctor details for notification:", doctorError.message);
        }

        if (doctor) {
          try {
            // send notification userId
            await axios.post(`${process.env.NOTIFICATION_SERVICE_URL}/notification`, {
                userIds: updatedBooking.userId ? [Number(updatedBooking.userId)] : [],
                message: `Your booking with Dr. ${doctor.data.displayName} has been ${updatedBooking.status}.`,
              },
              {
                headers: { Authorization: req.headers.authorization }
              }
            );
          } catch (notifError: any) {
            console.error("⚠️ Failed to send user status update notification:", notifError.message);
          }
        }
      }

      res.status(200).json({
        success: true,
        message: "successfully updated",
        status: 200,
        data: updatedBooking,
        error: null,
      });

    } catch (error: any) {
      console.error("🔥 Error in booking update controller:", error);
      res.status(error.response?.status || 500).json({
        success: false,
        message: error.message || "An unexpected error occurred during update",
        status: error.response?.status || 500,
        data: null,
        error: {
          code: "UPDATE_ERROR",
          details: error.response?.data || error.stack || null,
        },
      });
    }
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

export const getBookings = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  let { userId, hospitalId, doctorId }: any = req.query;

  if (Array.isArray(userId)) userId = userId[0];
  if (Array.isArray(hospitalId)) hospitalId = hospitalId[0];
    if (Array.isArray(doctorId)) doctorId = doctorId[0];


  const whereClause: any = {};

  if (userId !== undefined) {
    whereClause.userId = Number(userId);
  }

  if (hospitalId !== undefined) {
    whereClause.hospitalId = Number(hospitalId);
  }

    if (doctorId !== undefined) {
    whereClause.doctorId = Number(doctorId);
  }

  const booking = await Booking.findAll({
    where: whereClause,
      order: [["createdAt", "DESC"]],
  });

  if (!booking.length) {
    res.status(404).json({
      success: false,
      message: "No data found",
      data: null,
    });
    return;
  }

  res.status(200).json({
    success: true,
    data: booking,
  });
});