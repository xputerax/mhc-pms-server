import '../env.js';
import express from "express";
import authRoutes from './auth.js';

const router = express.Router();

import {
  docList,
  addNew,
  updateFee,
  unverified,
  verify,
  reject,
  generateStats,
  patientFeedbacks,
} from "../controllers/admin.js";
import {
  bookAppointment,
  duePayment,
  makePayment,
  myAppointments,
  cancelAppointment,
  prescriptions,
  writeFeedback,
  deleteFeedback,
} from "../controllers/patient.js";

import { uploadPrescription } from "../controllers/doctor.js";
import middleware from "../middlewares/index.js";
import handleFileUpload from "../middlewares/handleMulter.js";

router.use(authRoutes);

router.get("/doctor/list", middleware, (req, res) => {
  docList(req, res);
});

router.post("/doctor/new", middleware, (req, res) => {
  addNew(req, res);
});

router.post("/doctor/fee", middleware, (req, res) => {
  updateFee(req, res);
});

router.get("/users/unverified", middleware, (req, res) => {
  unverified(req, res);
});

router.post("/users/unverified/verify", middleware, (req, res) => {
  verify(req, res);
});

router.delete("/users/unverified/reject", middleware, (req, res) => {
  reject(req, res);
});

router.get("/generate/stats", middleware, (req, res) => {
  generateStats(req, res);
});

router.get("/patient/feedbacks", middleware, (req, res) => {
  patientFeedbacks(req, res);
});

router.post("/booking/appointment", middleware, (req, res) => {
  bookAppointment(req, res);
});

router.get("/booking/duepayment", middleware, (req, res) => {
  duePayment(req, res);
});

router.post("/booking/payment", middleware, (req, res) => {
  makePayment(req, res);
});

router.get("/patient/appointments", middleware, (req, res) => {
  myAppointments(req, res);
});

router.delete("/patient/appointments/cancel", middleware, (req, res) => {
  cancelAppointment(req, res);
});

router.get("/patient/prescriptions", middleware, (req, res) => {
  prescriptions(req, res);
});

router.post("/patient/feedback/write", middleware, (req, res) => {
  writeFeedback(req, res);
});

router.post("/patient/feedback/delete", middleware, (req, res) => {
  deleteFeedback(req, res);
});

router.post(
  "/doctor/prescription/upload",
  [middleware, handleFileUpload],
  (req, res) => {
    uploadPrescription(req, res);
  }
);

export default router;
