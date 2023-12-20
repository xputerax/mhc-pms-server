import express from "express";
import {
  signup,
  signin,
  generateRefreshToken,
  logout,
} from "../controllers/authController";

const router = express.Router();

router.post("/auth/signup", signup);
router.post("/auth/signin", signin);
router.post("/auth/refresh", generateRefreshToken);
router.delete("/auth/logout", logout);

export default router;
