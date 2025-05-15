import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import mongoose from "mongoose";
import logger from "morgan";
import path from "path";
import bookingRouter from "./routes/booking.mjs";

import { dirname } from "path";
import { fileURLToPath } from "url";
import AppError from "./models/appError.mjs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

const init = async () => {
  // console.log(process.env.MONGODB_URI);

  try {
    await mongoose.connect(
      "mongodb+srv://k3mp3:k3mp3@cluster.oxwzxut.mongodb.net/tottes-tattoo"
    );
    console.log("connected!");
  } catch (error) {
    console.log(error);
  }
};

init();

app.use(cors());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/api/v1", bookingRouter);

app.all("*", (req, res, next) => {
  next(
    new AppError(
      `Vi kan tyvärr inte hitta resursen som du söker, ${req.originalUrl}`,
      404
    )
  );
});

export default app;
