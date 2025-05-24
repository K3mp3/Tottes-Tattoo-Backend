import express from "express";
import {
  addBooking,
  deleteBooking,
  getAllBookings,
  getAvailability,
  getBookingById,
  updateBooking,
} from "../controllers/bookings-controller.mjs";
import { upload } from "../utilities/imageUpload.mjs";

const bookingRouter = express.Router();

bookingRouter.get("/availability", getAvailability);

bookingRouter
  .route("/bookings")
  .get(getAllBookings)
  .post(upload.single("file"), addBooking);

bookingRouter
  .route("/bookings/:id")
  .get(getBookingById)
  .patch(upload.single("file"), updateBooking)
  .delete(deleteBooking);

export default bookingRouter;
