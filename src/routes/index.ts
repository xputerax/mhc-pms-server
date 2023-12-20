import '../env.js';
import express from "express";
import authRoutes from './auth.js';
import adminRoutes from './admin.js';
import patientRoutes from './patient.js';
import doctorRoutes from './doctor.js';

const router = express.Router();

router.use(authRoutes);
router.use(adminRoutes);
router.use(patientRoutes);
router.use(doctorRoutes);

export default router;
