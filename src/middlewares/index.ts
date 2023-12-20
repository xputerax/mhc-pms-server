import express from 'express';
import jwt from "jsonwebtoken";

const { ACCESS_SECRET } = process.env;
const TOKEN_HEADER = "x-auth-token";

export interface AuthedRequest extends express.Request {
  user?: any;
}

const checkAuth = (req: AuthedRequest, res: express.Response, next: () => void) => {
  const token = req.get(TOKEN_HEADER);

  if (!token) {
    return res
      .status(401)
      .json({ error: true, errorMsg: "Access denied, token missing!" });
  }

  try {
    const payload = jwt.verify(token, ACCESS_SECRET);
    req.user = payload;
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        error: true,
        errorMsg: "Session timed out, please login again",
      });
    } else if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
        error: true,
        errorMsg: "Invalid token, please login again!",
      });
    } else {
      console.log(error);
      return res.status(400).json({ error: true, errorMsg: error });
    }
  }
};

export default checkAuth;
