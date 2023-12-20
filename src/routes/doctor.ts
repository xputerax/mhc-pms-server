import express from "express";
import { uploadPrescription } from "../controllers/doctor";
import middleware from "../middlewares/index";
import handleFileUpload from "../middlewares/handleMulter";

const router = express.Router();

router.post(
  "/doctor/prescription/upload",
  [middleware, handleFileUpload],
  (req, res) => {
    uploadPrescription(req, res);
  }
);

export default router;
