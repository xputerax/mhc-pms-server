import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import auth from "./models/auth.js";
import bcrypt from "bcrypt";
const saltRounds = 10;

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
        res.json({ error: true, errorMsg: "That email is already used!" });
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
          console.log("added new user to DB.");
          res.json({ error: false, msg: "Signup Successful!" });
        });
      }
    }
  });
});

app.post("/auth/signin", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  auth.findOne({ email: email }, (err, foundUser) => {
    if (err) {
      console.log(err);
    } else {
      if (foundUser) {
        bcrypt.compare(password, foundUser.password, (err, result) => {
          if (result === true) {
            res.json({ error: false, userType: foundUser.userType });
          } else {
            res.json({ error: true, errorMsg: "Incorrect Password!" });
          }
        });
      } else {
        res.json({ error: true, errorMsg: "Email not registered." });
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
