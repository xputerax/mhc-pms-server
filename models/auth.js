import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import Token from "./token.js";
const { ACCESS_SECRET, REFRESH_SECRET } = process.env;

const authSchema = new mongoose.Schema({
  userType: String,
  fname: String,
  lname: String,
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  verified: {
    type: Boolean,
    default: true,
  },
});

authSchema.methods = {
  createAccessToken: async (foundUser) => {
    try {
      let payload = {
        userType: foundUser.userType,
        email: foundUser.email,
        name: foundUser.fname,
      };
      let accessToken = jwt.sign(payload, ACCESS_SECRET, { expiresIn: "5m" });
      return accessToken;
    } catch (error) {
      console.log(error);
      return;
    }
  },

  createRefreshToken: async (foundUser) => {
    try {
      let payload = {
        userType: foundUser.userType,
        email: foundUser.email,
        name: foundUser.fname,
      };
      let refreshToken = jwt.sign(payload, REFRESH_SECRET, { expiresIn: "1d" });
      await new Token({ token: refreshToken }).save();
      return refreshToken;
    } catch (error) {
      console.log(error);
      return;
    }
  },
};

export default mongoose.model("Auth", authSchema);
