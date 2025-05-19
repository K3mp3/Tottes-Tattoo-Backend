import express from "express";
import {
  addBooking,
  getAllBookings,
  getBookingById,
  updateBooking,
  deleteBooking
} from "../controllers/bookings-controller.mjs";
import { upload } from "../utilities/imageUpload.mjs";

const bookingRouter = express.Router();

//Tillgänglighet
bookingRouter.get("/availability", getAvailability);

bookingRouter.route("/bookings")
  .get(getAllBookings)
  .post(upload.single('image'), addBooking);

bookingRouter.route("/bookings/:id")
  .get(getBookingById)
  .patch(upload.single('image'), updateBooking)
  .delete(deleteBooking);

export default bookingRouter;
