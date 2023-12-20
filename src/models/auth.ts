import mongoose, { Model } from "mongoose";
import jwt from "jsonwebtoken";
import Token from "./token";
const { ACCESS_SECRET, REFRESH_SECRET } = process.env;

export type Auth = {
  userType: string,
  fname: string,
  lname: string,
  degree: string,
  email: string,
  password: string,
  verified: boolean,
}

interface AuthMethods {
  createAccessToken(): string,
  createRefreshToken(): Promise<String>,
}

type AuthModel = Model<Auth, {}, AuthMethods>

export const AuthSchema = new mongoose.Schema<Auth, AuthModel, AuthMethods>({
  userType: String,
  fname: String,
  lname: String,
  degree: String,
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

export type JwtPayload = {
  userType: string,
  email: string,
  name: string,
}

AuthSchema.methods = {
  createAccessToken: function (this: Auth): string {
    try {
      let payload = {
        userType: this.userType,
        email: this.email,
        name: this.fname,
      };
      let accessToken = jwt.sign(payload, ACCESS_SECRET, { expiresIn: "5m" });
      return accessToken;
    } catch (error) {
      console.log(error);
      return;
    }
  },

  createRefreshToken: async function (this: Auth): Promise<String> {
    try {
      let payload: JwtPayload = {
        userType: this.userType,
        email: this.email,
        name: this.fname,
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

export default mongoose.model("Auth", AuthSchema);
