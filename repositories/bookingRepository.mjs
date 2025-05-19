import Booking from "../models/Booking.mjs";

export default class BookingRepository {
  async getAll() {
    return await Booking.find();
  }

  // Tillgänglighet
  async getByDateTimeAndEmployee(date, time, employee) {
  return await Booking.findOne({ date, time, employee });
}

  async add(booking) {
    return await Booking.create(booking);
  }
  
  async getById(id) {
    return await Booking.findById(id);
  }
  
  async update(id, bookingData) {
    return await Booking.findByIdAndUpdate(
      id, 
      bookingData, 
      { new: true, runValidators: true }
    );
  }
  
  async delete(id) {
    return await Booking.findByIdAndDelete(id);
  }
}
