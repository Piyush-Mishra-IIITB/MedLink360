import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const MONGODB_URL = process.env.MONGODB_URL;

const connectDB = async () => {
  await mongoose.connect(MONGODB_URL);
  console.log("mongoDB is connected");
};

export default connectDB;
