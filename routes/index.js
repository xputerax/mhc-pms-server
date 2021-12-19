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
import middleware from "../middlewares/index.js";

router.post("/auth/signup", signup);

router.post("/auth/signin", signin);

router.post("/auth/refresh", generateRefreshToken);

router.delete("/auth/logout", logout);

// router.get("/protected_resource", middleware.checkAuth, (req, res) => {
//     return res.status(200).json({ user: req.user });
//   });

export default router;
