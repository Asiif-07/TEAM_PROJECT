import 'dotenv/config'; // MUST be the first import
import http from "http";
import app from "./app.js";
import connectDB from "./config/db.config.js";
import { initSocket } from "./config/socket.js";

const PORT = process.env.PORT || 8080;

const httpServer = http.createServer(app);

// Initialize Socket.io
initSocket(httpServer);

connectDB()
  .then(() => {
    httpServer.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Failed to start server due to DB connection error.", err);
    process.exit(1);
  });