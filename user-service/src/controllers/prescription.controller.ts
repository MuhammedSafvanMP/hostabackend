import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import User from "../models/prescription.model";
import Prescription from "../models/prescription.model";
import { publishEvent } from "../events/publisher";


// REGISTER
export const createPrescription: any = asyncHandler(async (req: Request, res: Response) => {
  const { appointmentId, hospitalId, doctorId,  patientId, complaint, medications, investigations, advice, next_consultation, empty_stomach  } = req.body;



  const exist = await User.findOne({ where: {  patientId } });
  if (!exist) {
    res.status(400).json({
      success: false,
      message: "User not exists",
      error: { code: "USER_NOT_EXISTS" },
    });
    return;
  }


  const prescription = await Prescription.create({
    appointmentId, hospitalId, doctorId,  patientId, complaint, medications, investigations, advice, next_consultation, empty_stomach 
  });


  res.status(201).json({
    success: true,
    message: "Prescription created successfully",
    data: prescription,
  });
});



// GET ALL USERS Prescription
export const getPrescription: any = asyncHandler(async (req: Request, res: Response) => {
  const prescription = await Prescription.findAll();

  res.status(200).json({
    success: true,
    data: prescription,
  });
});

// GET ONE USER prescription
export const getAPrescription: any = asyncHandler(async (req: Request, res: Response) => {
  const prescription = await Prescription.findByPk(req.params.id);

  if (!prescription) {
    res.status(404).json({
      success: false,
      message: "Prescription not found",
    });
    return;
  }

  res.status(200).json({
    success: true,
    data: prescription,
  });
});

// UPDATE - PUT /prescription/:id
export const updateData: any = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const updatePayload = req.body;

  const prescription = await Prescription.update(updatePayload, {
    where: { id: id },
    returning: true,
  });

  if (!prescription[1] || prescription[1].length === 0) {
    res.status(404).json({
      success: false,
      message: "Prescription not found",
      status: 200,
      data: null,
      error: { code: "PRESCRIPTION_NOT_FOUND", details: null },
    });
    return;
  }

  await publishEvent("prescription_events", "PRESCRIPTION_UPDATED", {
    prescriptionId: prescription[1][0].id,
  });

  res.status(200).json({
    success: true,
    message: "successfully updated",
    data: prescription[1][0],
    error: null,
  });
});

// DELETE USER prescription
export const deletePrescription: any = asyncHandler(async (req: Request, res: Response) => {
  const user = await Prescription.findByPk(req.params.id);

  if (!user) {
    res.status(404).json({
      success: false,
      message: "Prescription not found",
    });
    return;
  }

  await Prescription.destroy({ where: { id: req.params.id } });

  res.status(200).json({
    success: true,
    message: "User deleted",
  });
});


