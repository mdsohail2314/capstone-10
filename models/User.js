import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, unique: true, required: true,lowercase:true },
  password: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  registeredDate: { type: Date, default: Date.now },
  cartUpdatedAt: { type: Date, default: Date.now }, // Track last cart update
  cart: [
    {
      itemId: { type: mongoose.Schema.Types.ObjectId, required: true, refPath: 'cart.itemType' }, 
      itemType: { type: String, enum: ['Room', 'Event', 'Flight'], required: true },
      nights: { type: Number, default: 1 }, // Relevant for rooms
      quantity: { type: Number, default: 1 }, // Relevant for flights/events
      price: { type: Number, required: true }, // Store calculated price
      name:{type:String, required:true},
      location:{type:String, required:true},
      description:{type:String, required:true}
    }
  ],
  totalPrice: { type: Number, default: 0 },
  role: { type: String, default: 'USER' }
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

export default User;
