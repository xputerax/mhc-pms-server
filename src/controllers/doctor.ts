import express from 'express';
import appointment from "../models/appointment";
import * as path from "path";
const file_path = path.join("/public/uploads");

interface UploadPrescriptionRequest extends express.Request {
  body: {
    patientEmail?: string,
    doctorEmail?: string,
    appointmentDate?: string,
  },
}

const uploadPrescription = async (req: UploadPrescriptionRequest, res: express.Response) => {
  const uploaded_path = path.join(file_path, "/", req.file.filename);
  const filter = {
    $and: [
      { patientEmail: req.body.patientEmail },
      { doctorEmail: req.body.doctorEmail },
      { appointmentDate: req.body.appointmentDate },
    ],
  };
  try {
    const updated = await appointment.findOneAndUpdate(
      filter,
      { prescribed: true, file: uploaded_path },
      { new: true }
    );
    if (updated) {
      return res.status(200).json({
        error: false,
        msg: "Prescription uploaded successfully.",
      });
    } else {
      res.status(304).json({
        error: true,
        errorMsg: "Failed to upload!",
      });
    }
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: true, errorMsg: "Internal Server Error!" });
  }
};

export { uploadPrescription };
