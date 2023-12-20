import '../env';
import express from "express";
import authRoutes from './auth';
import adminRoutes from './admin';
import patientRoutes from './patient';
import doctorRoutes from './doctor';

const router = express.Router();

router.use(authRoutes);
router.use(adminRoutes);
router.use(patientRoutes);
router.use(doctorRoutes);

export default router;
