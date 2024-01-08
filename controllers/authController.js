import auth from "../models/auth.js";
import token from "../models/token.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import nodemailer from 'nodemailer';
const saltRounds = 10;
const { ACCESS_SECRET, REFRESH_SECRET } = process.env;

const sendEmail = async (email, subject, text) => {
  try {
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: 'loveinhomeapp@gmail.com', // your email address
        pass: 'tenalkwjtbaomsyw', // your email password or app password
      },
    });

    await transporter.sendMail({
      from: 'loveinhomeapp@gmail.com', // sender address
      to: email, // list of receivers
      subject: subject, // Subject line
      text: text, // plain text body
    });

    console.log('Email sent successfully');
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};
const signup = async (req, res) => {
  try {
    // Assuming req.body.email contains the email address where you want to send the email
    await sendEmail(req.body.email, 'Welcome!', 'Thank you for signing up!');
    console.log('Email sent successfully');

    // Send a success response regardless of the email sending outcome
    res.status(200).json({ error: false, msg: "Signup (email sending) Successful!" });
  } catch (emailError) {
    console.error('Email sending failed:', emailError);
    res.status(200).json({ error: false, msg: "Signup (email sending) Successful, but encountered an issue!" });
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
