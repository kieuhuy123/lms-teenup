import mongoose from "mongoose";
import "dotenv/config";

const connectDB = async () => {
  try {
    // Thêm các options cho mongoose
    const options = {
      autoIndex: false,
      maxPoolSize: process.env.maxPool, //tùy chỉnh bao nhiêu kết nối đồng thời
      serverSelectionTimeoutMS: process.env.serverSelection, // tùy chỉnh
      socketTimeoutMS: 45000,
    };
    const conn = await mongoose.connect(process.env.MONGODB_URI, options);
    mongoose.connection.on("connected", () => {
      console.log("Mongoose connected to DB");
    });

    mongoose.connection.on("error", (err) => {
      console.error("Mongoose connection error:", err);
    });

    mongoose.connection.on("disconnected", () => {
      console.log("Mongoose disconnected");
    });
    process.on("SIGINT", async () => {
      await mongoose.connection.close();
      process.exit(0);
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
};

export default connectDB;
