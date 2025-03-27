import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    itemId: { type: mongoose.Schema.Types.ObjectId, required: true },
    itemType: { type: String, enum: ["ROOM", "EVENT", "FLIGHT"], required: true },
    quantity: { type: Number, default: 1 },
    nights: { type: Number, default: 1 },
    totalPrice: { type: Number, required: true },
    bookingDate: { type: Date, default: Date.now },
});

const Bookings = mongoose.model('Bookings', bookingSchema);

export default Bookings;
