import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema({
  patient: String,
  doctor: String,
  patientEmail: String,
  doctorEmail: String,
  date: String,
  appointmentDate: String,
  payment: {
    type: Boolean,
    default: false,
  },
  prescribed: {
    type: Boolean,
    default: false,
  },
  file: {
    type: String,
    default: "/downloadFiles/prescription.pdf",
  },
  feedback: {
    type: Boolean,
    default: false,
  },
  review: {
    type: String,
    default: "",
  },
  rating: {
    type: Number,
    default: 0,
  },
});

export default mongoose.model("Appointment", appointmentSchema);
