import mongoose from "mongoose";

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

export default mongoose.model("Auth", authSchema);
