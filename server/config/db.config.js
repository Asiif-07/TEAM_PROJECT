import mongoose from "mongoose";

async function connectDB() {
  try {
    const connectionInstance = await mongoose.connect(process.env.MONGO_URI);
    console.log(`DataBase connected: ${connectionInstance.connection.name} on ${connectionInstance.connection.host}:${connectionInstance.connection.port}`);
  } catch (error) {
    console.error("DB Error:", error);
    process.exit(1);
  }
}

export default connectDB;