import express from "express";
import {
  addBooking,
  getAllBookings,
} from "../controllers/bookings-controller.mjs";

const bookingRouter = express.Router();

bookingRouter.route("/bookings").get(getAllBookings).post(addBooking);

export default bookingRouter;
