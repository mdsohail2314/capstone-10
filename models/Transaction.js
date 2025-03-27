import mongoose from 'mongoose';
const transactionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  paymentIntentId: { type: String, required: true },
  amount: { type: Number, required: true }, // Store amount as an integer (cents)
  currency: { type: String, required: true },
  status: { type: String, required: true },
  paymentMethod: { type: String, required: true }, // Payment method ID or details
  cartItems: [
    {
      itemId: { type: mongoose.Schema.Types.ObjectId, ref: 'Item' },
      name: { type: String, required: true },
      price: { type: Number, required: true }, // Price in cents
      quantity: { type: Number, required: true },
    }
  ],
  createdAt: { type: Date, default: Date.now },
});

const Transaction = mongoose.model('Transaction', transactionSchema);
export default Transaction;