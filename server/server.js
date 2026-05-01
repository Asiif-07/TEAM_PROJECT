import 'dotenv/config'; // MUST be the first import
import app from "./app.js";
import connectDB from "./config/db.config.js";

const PORT = process.env.PORT || 8080; // Added a fallback port

// Use .then() or wrap in an async IIFE to ensure DB connects before server starts
connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Failed to start server due to DB connection error.");
    process.exit(1);
  });