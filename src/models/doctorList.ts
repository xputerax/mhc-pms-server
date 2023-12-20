import mongoose from "mongoose";

export type Doctor = {
  docName: string,
  email: string,
  degree: string,
  wdays: string,
  fee: number,
  wIds: number[],
}

const doctorListSchema = new mongoose.Schema<Doctor>({
  docName: String,
  email: String,
  degree: String,
  wdays: String,
  fee: Number,
  wIds: [Number],
});

export default mongoose.model("DoctorList", doctorListSchema);
