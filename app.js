import "./env.js";
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import api from "./routes/index.js";

import { fileURLToPath } from "url";
import path, { dirname } from "path";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

import morgan from "morgan";

import fs from "fs";
fs.mkdirSync(path.join(__dirname, "public", "uploads"), { recursive: true });

const app = express();

app.use(morgan('combined'));

const { USER_NAME, PASSWORD, CONNECTION_STRING } = process.env;
// const uri = `mongodb://${USER_NAME}:${PASSWORD}@cluster0-shard-00-00.kmfwq.mongodb.net:27017,cluster0-shard-00-01.kmfwq.mongodb.net:27017,cluster0-shard-00-02.kmfwq.mongodb.net:27017/mhcpmsDB?ssl=true&replicaSet=atlas-a9v4hk-shard-0&authSource=admin&retryWrites=true&w=majority`;
const uri = CONNECTION_STRING

mongoose
  .connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("connected to DB"))
  .catch((err) => console.log(err));

app.use(express.static("public"));
app.use("/public/uploads", express.static(__dirname + "/public/uploads"));

app.use(cors());

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.get("/", (req, res) => {
  res.sendFile(__dirname + "public/index.html");
});

app.use("/api", api);

const port = process.env.PORT || 5000;

app.listen(port, function () {
  console.log("Server started on port: ", port);
});
