import express from "express";
import { uploadPrescription } from "../controllers/doctor.js";
import middleware from "../middlewares/index.js";
import handleFileUpload from "../middlewares/handleMulter.js";

const router = express.Router();

router.post(
  "/doctor/prescription/upload",
  [middleware, handleFileUpload],
  (req, res) => {
    uploadPrescription(req, res);
  }
);

export default router;
