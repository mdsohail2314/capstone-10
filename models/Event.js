import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema({
  name: { type: String, required: true },
  location: { type: String, required: true },
  description: { type: String },
  price: { type: Number, required: true },
  imageUrls: { type: [String], default: [] },
  checkIn: { type: Date },
  checkOut: { type: Date },
  currentBookings: [{ type: mongoose.Schema.Types.ObjectId, ref: "Booking" }],
  createdAt: { type: Date, default: Date.now }
});

const Event = mongoose.model('Event', eventSchema);

export default Event;
