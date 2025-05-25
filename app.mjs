import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import mongoose from "mongoose";
import logger from "morgan";
import path from "path";
import bookingRouter from "./routes/booking.mjs";

import dotenv from "dotenv";
import { dirname } from "path";
import { fileURLToPath } from "url";
import AppError from "./models/appError.mjs";
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

const init = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
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
app.use("/images", express.static(path.join(__dirname, "images")));

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
