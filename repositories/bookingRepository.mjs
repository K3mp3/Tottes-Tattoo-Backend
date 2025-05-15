import Booking from "../models/Booking.mjs";

export default class BookingRepository {
  async getAll() {
    return await Booking.find();
  }

  async add(booking) {
    return await Booking.create(booking);
  }
}
