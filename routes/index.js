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
import {
  docList,
  addNew,
  updateFee,
  unverified,
  verify,
  reject,
} from "../controllers/admin.js";
import middleware from "../middlewares/index.js";

router.post("/auth/signup", signup);

router.post("/auth/signin", signin);

router.post("/auth/refresh", generateRefreshToken);

router.delete("/auth/logout", logout);

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

export default router;
