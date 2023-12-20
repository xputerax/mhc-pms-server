import express from "express";
import middleware from "../middlewares/index.js";

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

const router = express.Router();

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

module.exports = router;
