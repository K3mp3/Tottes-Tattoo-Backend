import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, "Kundens förnamn måste anges"],
  },
  lastName: {
    type: String,
    required: [true, "Kundens efternamn måste anges"],
  },
  phone: {
    type: String,
    required: [true, "Kundens telefonnummer måste anges"],
  },
  email: {
    type: String,
    required: [true, "Kundens e-post adress måste anges"],
  },
  image: {
    type: String,
    required: false,
  },

  // Tillgänglighet
  date: {
    type: Date,
    required: [true, "Datum måste angess"]
  },
    time: {
    type: String,
    required: [true, "Tid måste anges"]
  },
    duration: {
    type: Number,
    required: true, default: 60
  },
    employee: {
    type: String,
    required: [true, "Tatuerare måste anges"]
  },

});

export default mongoose.model("Booking", bookingSchema);
