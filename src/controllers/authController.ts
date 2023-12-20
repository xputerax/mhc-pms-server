import auth from "../models/auth.js";
import token from "../models/token.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
const saltRounds = 10;
const { ACCESS_SECRET, REFRESH_SECRET } = process.env;

const signup = async (req, res) => {
  try {
    auth.findOne({ email: req.body.email }, (err, foundEmail) => {
      if (err) {
        console.log(err);
        return res
          .status(500)
          .json({ error: true, errorMsg: "Internal Server Error!" });
      } else {
        if (foundEmail) {
          return res.status(400).json({
            error: true,
            errorMsg: "That email is already registered!",
          });
        } else {
          bcrypt.hash(req.body.password, saltRounds, (err, hash) => {
            auth.create({
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
          });
        }
      }
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: true, errorMsg: "Internal Server Error!" });
  }
};

const signin = (req, res) => {
  try {
    const email = req.body.email;
    const password = req.body.password;
    auth.findOne({ email: email }, (err, foundUser) => {
      if (err) {
        console.log(err);
        return res
          .status(500)
          .json({ error: true, errorMsg: "Internal Server Error!" });
      } else {
        if (foundUser && foundUser.verified) {
          bcrypt.compare(password, foundUser.password, async (err, result) => {
            if (result === true) {
              const accessToken = await foundUser.createAccessToken(foundUser);
              const refreshToken = await foundUser.createRefreshToken(
                foundUser
              );
              return res.status(201).json({
                error: false,
                userType: foundUser.userType,
                accessToken,
                refreshToken,
              });
            } else {
              return res
                .status(401)
                .json({ error: true, errorMsg: "Incorrect Password!" });
            }
          });
        } else if (foundUser && !foundUser.verified) {
          return res.status(401).json({
            error: true,
            errorMsg:
              "This email is not verified by the Admin. Please login after the verification process is completed.",
          });
        } else {
          return res
            .status(404)
            .json({ error: true, errorMsg: "Email not registered." });
        }
      }
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: true, errorMsg: "Internal Server Error!" });
  }
};

const generateRefreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return res
        .status(403)
        .json({ error: true, errorMsg: "Access denied, token missing!" });
    } else {
      const storedToken = await token.findOne({ token: refreshToken });
      if (!storedToken) {
        return res
          .status(401)
          .json({ error: true, errorMsg: "Token Expired!" });
      } else {
        const payload = jwt.verify(storedToken.token, REFRESH_SECRET);
        const accessToken = jwt.sign(payload, ACCESS_SECRET);
        return res.status(200).json({ accessToken });
      }
    }
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: true, errorMsg: "Internal Server Error!" });
  }
};

const logout = async (req, res) => {
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
