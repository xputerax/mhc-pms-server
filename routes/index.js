import express from "express";
const router = express.Router();

import authController from "../controllers/authController.js";
import middleware from "../middlewares/index.js";

router.post("/auth/signup", authController.signup);

router.post("/auth/singin", authController.singin);

router.post("/auth/refresh", authController.generateRefreshToken);

router.delete("/auth/logout", authController.logout);

// router.get("/protected_resource", middleware.checkAuth, (req, res) => {
//     return res.status(200).json({ user: req.user });
//   });

export default router;
