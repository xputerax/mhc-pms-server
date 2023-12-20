import express from 'express';
import auth from "../models/auth";
import token from "../models/token";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
const saltRounds = 10;
const { ACCESS_SECRET, REFRESH_SECRET } = process.env;

interface SignUpRequest extends express.Request {
  body: {
    userType: string,
    password: string,
    fname: string,
    lname: string,
    degree: string,
    email: string,
    verified: boolean,
  }
}

const signup = async (req: SignUpRequest, res: express.Response) => {
  try {
    const foundEmail = await auth.findOne({ email: req.body.email })

    if (foundEmail) {
      return res.status(400).json({
        error: true,
        errorMsg: "That email is already registered!",
      });
    }

    const hash = await bcrypt.hash(req.body.password, saltRounds)

    await auth.create({
      userType: req.body.userType,
      fname: req.body.fname,
      lname: req.body.lname,
      degree: req.body.degree,
      email: req.body.email,
      password: hash,
      verified: req.body.verified,
    });

    return res
      .status(201)
      .json({ error: false, msg: "Signup Successful!" });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: true, errorMsg: "Internal Server Error!" });
  }
};

const signin = async (req: express.Request, res: express.Response) => {
  const { email, password } = req.body;

  try {
    const foundUser = await auth.findOne({ email: email })

    if (!foundUser) {
      return res
        .status(404)
        .json({ error: true, errorMsg: "Email not registered." });
    }

    if (!foundUser.verified) {
      return res.status(401).json({
        error: true,
        errorMsg:
          "This email is not verified by the Admin. Please login after the verification process is completed.",
      });
    }

    const pwMatches = await bcrypt.compare(password, foundUser.password)

    if (pwMatches !== true) {
      return res
        .status(401)
        .json({ error: true, errorMsg: "Incorrect Password!" });
    }

    const accessToken = await foundUser.createAccessToken();
    const refreshToken = await foundUser.createRefreshToken();

    return res.status(201).json({
      error: false,
      userType: foundUser.userType,
      accessToken,
      refreshToken,
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: true, errorMsg: "Internal Server Error!" });
  }
};

const generateRefreshToken = async (req: express.Request, res: express.Response) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res
        .status(403)
        .json({ error: true, errorMsg: "Access denied, token missing!" });
    }

    const storedToken = await token.findOne({ token: refreshToken });

    if (!storedToken) {
      return res
        .status(401)
        .json({ error: true, errorMsg: "Token Expired!" });
    }

    const payload = jwt.verify(storedToken.token, REFRESH_SECRET);
    const accessToken = jwt.sign(payload, ACCESS_SECRET);

    return res.status(200).json({ accessToken });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: true, errorMsg: "Internal Server Error!" });
  }
};

const logout = async (req: express.Request, res: express.Response) => {
  try {
    const { refreshToken } = req.body;
    await token.findOneAndDelete({ token: refreshToken });
    return res
      .status(200)
      .json({ error: false, msg: "Logged Out successfully!" });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: true, errorMsg: "Internal Server Error!" });
  }
};

export { signup, signin, generateRefreshToken, logout };
