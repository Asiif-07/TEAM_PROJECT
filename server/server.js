import app from "./app.js";
import connectDB from "./config/db.config.js";

const PORT = process.env.PORT || 2000;
connectDB()

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});