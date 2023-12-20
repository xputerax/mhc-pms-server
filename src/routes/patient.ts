import express from "express";
import middleware from "../middlewares/index.js";

const router = express.Router();

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

export default router;
