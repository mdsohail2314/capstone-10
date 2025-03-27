import mongoose from 'mongoose';

const roomSchema = new mongoose.Schema({
    roomName:{type:String, required:true},
    personsPerRoom:{type:Number,required:true},
    phoneNumber:{type:String,required:true},
    rentPerNight:{type:Number,required:true},
    imageUrls: { type: [String], default: [] },
    currentBookings: { type: [Object], default: [] },
    location:{type:String,required:true},
    checkIn: { type: Date },
    checkOut: { type: Date },
    description:{type:String,required:true},
},{
    timestamps:true,
});

const Room = mongoose.model('Room', roomSchema);

export default Room;