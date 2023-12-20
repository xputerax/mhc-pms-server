import express from "express";
import { uploadPrescription } from "../controllers/doctor";
import authMiddleware from "../middlewares/index";
import handleFileUpload from "../middlewares/handleMulter";

const router = express.Router();

router.post(
  "/doctor/prescription/upload",
  [authMiddleware, handleFileUpload],
  uploadPrescription
);

export default router;
