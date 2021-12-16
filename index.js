import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import auth from "./models/auth.js";

const app = express();

mongoose
  .connect("mongodb://localhost:27017/mhcpmsDB", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("connected to DB"))
  .catch((err) => console.log(err));

app.use(express.static("public"));

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

app.post("/auth/signup", (req, res) => {
  auth.findOne({ email: req.body.email }, (err, foundEmail) => {
    if (err) {
      console.log(err);
    } else {
      if (foundEmail) {
        console.log("Rejection: used email!");
        res.send({ error: true, errorMsg: "That email is already used!" });
      } else {
        auth.create(req.body);
        console.log("added to the DB");
        res.send({ error: false, msg: "Signup Successful!" });
      }
    }
  });
});

let port = process.env.PORT;
if (port == null || port == "") {
  port = 5000;
}
app.listen(port, function () {
  console.log("Server started on port: ", port);
});
