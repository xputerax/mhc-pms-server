import dotenv from "dotenv";
dotenv.config();
import express from "express";
const router = express.Router();

import {
  signup,
  signin,
  generateRefreshToken,
  logout,
} from "../controllers/authController.js";
import {
  docList,
  addNew,
  updateFee,
  unverified,
  verify,
  reject,
  generateStats,
} from "../controllers/admin.js";
import {
  bookAppointment,
  duePayment,
  makePayment,
  myAppointments,
  cancelAppointment,
} from "../controllers/patient.js";
import middleware from "../middlewares/index.js";

router.post("/auth/signup", signup);

router.post("/auth/signin", signin);

router.post("/auth/refresh", generateRefreshToken);

router.delete("/auth/logout", logout);

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

export default router;
