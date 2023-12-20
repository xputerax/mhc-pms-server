import express from "express";
import authMiddleware from "../middlewares/index";

import {
  docList,
  addNew,
  updateFee,
  unverified,
  verify,
  reject,
  generateStats,
  patientFeedbacks,
} from "../controllers/admin";

const router = express.Router();

router.get("/doctor/list", authMiddleware, docList);
router.post("/doctor/new", authMiddleware, addNew);
router.post("/doctor/fee", authMiddleware, updateFee);
router.get("/users/unverified", authMiddleware, unverified);
router.post("/users/unverified/verify", authMiddleware, verify);
router.delete("/users/unverified/reject", authMiddleware, reject);
router.get("/generate/stats", authMiddleware, generateStats);
router.get("/patient/feedbacks", authMiddleware, patientFeedbacks);

export default router;