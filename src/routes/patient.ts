import express from "express";
import authMiddleware from "../middlewares/index";
import {
  bookAppointment,
  duePayment,
  makePayment,
  myAppointments,
  cancelAppointment,
  prescriptions,
  writeFeedback,
  deleteFeedback,
} from '../controllers/patient';

const router = express.Router();

router.post("/booking/appointment", authMiddleware, bookAppointment);
router.get("/booking/duepayment", authMiddleware, duePayment);
router.post("/booking/payment", authMiddleware, makePayment);
router.get("/patient/appointments", authMiddleware, myAppointments);
router.delete("/patient/appointments/cancel", authMiddleware, cancelAppointment);
router.get("/patient/prescriptions", authMiddleware, prescriptions);
router.post("/patient/feedback/write", authMiddleware, writeFeedback);
router.post("/patient/feedback/delete", authMiddleware, deleteFeedback);

export default router;
