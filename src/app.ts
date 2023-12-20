import "./env";
import "./config/db";
import express from "express";
import cors from "cors";
import api from "./routes/index";
import morgan from "morgan";
// import fs from 'fs';
// import { fileURLToPath } from "url";
// import path, { dirname } from "path";

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = dirname(__filename);

// fs.mkdirSync(path.join(__dirname, "public", "uploads"), { recursive: true });

const app = express();

app.use(morgan('combined'));

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
