import mongoose from 'mongoose';

const flightSchema = new mongoose.Schema({
  origin: { type: String, required: true },
  destination: { type: String, required: true },
  outboundDate: { type: Date, required: true },
  inboundDate: { type: Date, required: function() { return this.flightType === 'round-trip'; } },
  airline: { type: String, required: true },
  price: { type: Number, required: true },
  availableSeats: { type: Number, required: true },
  flightNumber: { type: String, required: false },
  cabinClass: { type: String, enum: ['economy', 'premium_economy', 'business'], required: false },
  flightDuration: { type: String, required: false },
  baggageAllowance: { type: String, required: false },
  flightType: { type: String, enum: ['one-way', 'round-trip'], default: 'one-way' },
  flightStatus: { type: String, enum: ['active', 'cancelled'], default: 'active' },
});

const Flight = mongoose.model('Flight', flightSchema);

export default Flight;
