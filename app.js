import "./env.js";
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import api from "./routes/index.js";

const app = express();

const { USER_NAME, PASSWORD } = process.env;
const uri = `mongodb://${USER_NAME}:${PASSWORD}@cluster0-shard-00-00.kmfwq.mongodb.net:27017,cluster0-shard-00-01.kmfwq.mongodb.net:27017,cluster0-shard-00-02.kmfwq.mongodb.net:27017/mhcpmsDB?ssl=true&replicaSet=atlas-a9v4hk-shard-0&authSource=admin&retryWrites=true&w=majority`;

mongoose
  .connect(uri, {
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

app.use("/api", api);

let port = process.env.PORT;
if (port == null || port == "") {
  port = 5000;
}
app.listen(port, function () {
  console.log("Server started on port: ", port);
});
