import mongoose from "mongoose";

const patientSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  appointments: [
    {
      doc: String,
      date: String,
    },
  ],
  prescriptions: [
    {
      doc: String,
      filepath: String,
    },
  ],
  feedbacks: [
    {
      doc: String,
      date: String,
      feedback: String,
      rating: Number,
    },
  ],
});
