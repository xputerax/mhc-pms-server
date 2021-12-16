import express from "express";
import mongoose from "mongoose";
import cors from "cors";

const app = express();

// mongoose
//   .connect("mongodb://localhost:27017/mhcpmsDB", {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//   })
//   .then(() => console.log("connected to DB"))
//   .catch((err) => console.log(err));

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

let port = process.env.PORT;
if (port == null || port == "") {
  port = 5000;
}
app.listen(port, function () {
  console.log("Server started successfully on port: ", port);
});
