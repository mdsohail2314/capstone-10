import mongoose from "mongoose";

const mongooseConnection = async () => {
    try {
        await mongoose.connect("mongodb://localhost:27017/travelapp", {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log("MongoDB Connected...");
    } catch (error) {
        console.error("MongoDB Connection Failed:", error);
    }
};

export default mongooseConnection;
