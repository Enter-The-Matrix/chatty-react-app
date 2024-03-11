import mongoose from "mongoose";

const connectToMongoDB = async ()=>{
    try {
        
        await mongoose.connect(process.env.MONOGO_DB_URI)
        console.log("Connected to MongoDB");

    } catch (error) {
        console.log("Error connecting to Mongo db");
    }
}

export default connectToMongoDB