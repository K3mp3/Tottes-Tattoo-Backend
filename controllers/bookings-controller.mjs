import BookingRepository from "../repositories/bookingRepository.mjs";
import { catchErrorAsync } from "../utilities/catchErrorAsync.mjs";

export const getAllBookings = catchErrorAsync(async (req, res) => {
  const bookingRepo = new BookingRepository();
  const bookings = await bookingRepo.getAll();
  res.status(200).json({ sucess: true, data: bookings });
});

export const addBooking = catchErrorAsync(async (req, res) => {
  const booking = new BookingRepository().add(req.body);
  res.status(201).json({ success: true, data: booking });
});
