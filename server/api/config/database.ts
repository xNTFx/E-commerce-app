import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || "", {
      dbName: "e-commerce",
    });
    console.info("MongoDB connection established");
  } catch (err) {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  }
};
