import mongoose from "mongoose";

const { CONNECTION_STRING } = process.env;

const uri = CONNECTION_STRING

mongoose
  .connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("connected to DB"))
  .catch((err) => console.log(err));