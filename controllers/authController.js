import auth from "../models/auth.js";
import token from "../models/Token.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
const { ACCESS_SECRET, REFRESH_SECRET } = process.env;

const signup = async (req, res) => {
  try {
    auth.findOne({ email: req.body.email }, (err, foundEmail) => {
      if (err) {
        console.log(err);
        return res.status(500).json({ err: "Internal Server Error!" });
      } else {
        if (foundEmail) {
          return res
            .status(400)
            .json({ error: true, errorMsg: "That email is already used!" });
        } else {
          bcrypt.hash(req.body.password, saltRounds, (err, hash) => {
            auth.create({
              userType: req.body.userType,
              fname: req.body.fname,
              lname: req.body.lname,
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
    return res.status(500).json({ error: "Internal Server Error!" });
  }
};

const signin = async (req, res) => {
  try {
    const email = req.body.email;
    const password = req.body.password;
    auth.findOne({ email: email }, (err, foundUser) => {
      if (err) {
        console.log(err);
        return res.status(500).json({ err: "Internal Server Error!" });
      } else {
        if (foundUser) {
          bcrypt.compare(password, foundUser.password, (err, result) => {
            if (result === true) {
              let accessToken = await auth.createAccessToken();
              let refreshToken = await auth.createRefreshToken();
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
        } else {
          return res
            .status(404)
            .json({ error: true, errorMsg: "Email not registered." });
        }
      }
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ err: "Internal Server Error!" });
  }
};

const generateRefreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return res.status(403).json({ error: "Access denied, token missing!" });
    } else {
      const storedToken = await token.findOne({ token: refreshToken });
      if (!storedToken) {
        return res.status(401).json({ error: "Token Expired!" });
      } else {
        const payload = jwt.verify(storedToken.token, REFRESH_SECRET);
        const accessToken = jwt.sign(payload, ACCESS_SECRET, {
          expiresIn: "1d",
        });
        return res.status(200).json({ accessToken });
      }
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error!" });
  }
};

const logout = async (req, res) => {
  try {
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error!" });
  }
};

export { signup, signin, generateRefreshToken, logout };
