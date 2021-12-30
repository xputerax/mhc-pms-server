import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema({
  patient: String,
  doctor: String,
  pemail: String,
  demail: String,
  date: String,
  doa: String,
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
});

export default mongoose.model("Appointment", appointmentSchema);
