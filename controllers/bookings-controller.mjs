import BookingRepository from "../repositories/bookingRepository.mjs";
import { catchErrorAsync } from "../utilities/catchErrorAsync.mjs";
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const imagesDir = path.join(__dirname, '../images');

export const getAllBookings = catchErrorAsync(async (req, res) => {
  const bookingRepo = new BookingRepository();
  const bookings = await bookingRepo.getAll();
  res.status(200).json({ sucess: true, data: bookings });
});

export const addBooking = catchErrorAsync(async (req, res) => {
  const bookingData = { ...req.body };
  
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
    return res.status(404).json({ success: false, message: 'Booking not found' });
  }
  
  res.status(200).json({ success: true, data: booking });
});

export const updateBooking = catchErrorAsync(async (req, res) => {
  const bookingRepo = new BookingRepository();
  const existingBooking = await bookingRepo.getById(req.params.id);
  
  if (!existingBooking) {
    return res.status(404).json({ success: false, message: 'Booking not found' });
  }
  
  const bookingData = { ...req.body };
  
  if (req.file) {
    if (existingBooking.image && !existingBooking.image.includes('default')) {
      const oldImagePath = path.join(imagesDir, path.basename(existingBooking.image));
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
    return res.status(404).json({ success: false, message: 'Booking not found' });
  }
  
  if (booking.image) {
    const imagePath = path.join(imagesDir, path.basename(booking.image));
    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
    }
  }
  
  await bookingRepo.delete(req.params.id);
  res.status(200).json({ success: true, message: 'Booking deleted successfully' });
});
