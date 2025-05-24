import fs from "fs";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import BookingRepository from "../repositories/bookingRepository.mjs";
import { catchErrorAsync } from "../utilities/catchErrorAsync.mjs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const imagesDir = path.join(__dirname, "../images");

export const getAllBookings = catchErrorAsync(async (req, res) => {
  const bookingRepo = new BookingRepository();
  const bookings = await bookingRepo.getAll();
  res.status(200).json({ sucess: true, data: bookings });
});

export const addBooking = catchErrorAsync(async (req, res) => {
  console.log("AddBooking", req.body);
  const bookingData = { ...req.body };

  const bookingRepo = new BookingRepository();
  const existing = await bookingRepo.getByDateTimeAndEmployee(
    bookingData.date,
    bookingData.time,
    bookingData.employee
  );

  if (existing) {
    return res
      .status(409)
      .json({ success: false, message: "Tiden är redan bokad" });
  }

  if (req.file) {
    bookingData.image = `/images/${req.file.filename}`;
  }

  const booking = await new BookingRepository().add(bookingData);
  res.status(201).json({ success: true, data: booking });
});

export const getBookingById = catchErrorAsync(async (req, res) => {
  const bookingRepo = new BookingRepository();
  const booking = await bookingRepo.getById(req.params.id);

  if (!booking) {
    return res
      .status(404)
      .json({ success: false, message: "Booking not found" });
  }

  res.status(200).json({ success: true, data: booking });
});

export const updateBooking = catchErrorAsync(async (req, res) => {
  const bookingRepo = new BookingRepository();
  const existingBooking = await bookingRepo.getById(req.params.id);

  if (!existingBooking) {
    return res
      .status(404)
      .json({ success: false, message: "Booking not found" });
  }

  const bookingData = { ...req.body };

  if (req.file) {
    if (existingBooking.image && !existingBooking.image.includes("default")) {
      const oldImagePath = path.join(
        imagesDir,
        path.basename(existingBooking.image)
      );
      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath);
      }
    }

    bookingData.image = `/images/${req.file.filename}`;
  }

  const updatedBooking = await bookingRepo.update(req.params.id, bookingData);
  res.status(200).json({ success: true, data: updatedBooking });
});

export const deleteBooking = catchErrorAsync(async (req, res) => {
  const bookingRepo = new BookingRepository();
  const booking = await bookingRepo.getById(req.params.id);

  if (!booking) {
    return res
      .status(404)
      .json({ success: false, message: "Booking not found" });
  }

  if (booking.image) {
    const imagePath = path.join(imagesDir, path.basename(booking.image));
    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
    }
  }

  await bookingRepo.delete(req.params.id);
  res
    .status(200)
    .json({ success: true, message: "Booking deleted successfully" });
});

export const getAvailability = catchErrorAsync(async (req, res) => {
  const { date, time } = req.body;
  const bookingRepo = new BookingRepository();

  if (!date || !time) {
    return res.status(400).json({ success: false, message: "Datum krävs" });
  }

  const times = [
    "09:00",
    "10:00",
    "11:00",
    "13:00",
    "14:00",
    "15:00",
    "16:00",
    "17:00",
  ];

  const bookings = await bookingRepo.getAvailabilityByDateTime(date, time);

  const bookedTimes = bookings.map((b) => b.time);
  const availableTimes = times.filter((t) => !bookedTimes.includes(t));

  res.status(200).json({ success: true, availableTimes });
});
