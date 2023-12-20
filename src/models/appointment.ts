import mongoose from "mongoose";

export type Appointment = {
  patient: string,
  doctor: string,
  patientEmail: string,
  doctorEmail: string,
  date: string,
  appointmentDate: string,
  payment: boolean,
  prescribed: boolean,
  file: string,
  feedback: boolean,
  review: string,
  rating: number,
}

const AppointmentSchema = new mongoose.Schema<Appointment>({
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

export default mongoose.model("Appointment", AppointmentSchema);
