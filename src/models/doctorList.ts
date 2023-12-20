import mongoose from "mongoose";

const doctorListSchema = new mongoose.Schema({
  docName: String,
  email: String,
  degree: String,
  wdays: String,
  fee: Number,
  wIds: [Number],
});

export default mongoose.model("DoctorList", doctorListSchema);
