import mongoose, { Schema } from "mongoose";

const userCartSchema= new Schema({
    roomId: { type: mongoose.Schema.Types.ObjectId, ref: 'Room', required: true },  // Referencing a Room model
    personsPerRoom: { type: Number, default: 1 },
    rentPerNight: { type: Number, required: true },
    location:{type:String,required:true}
})