import app from "./app";
import dotenv from "dotenv";
import { connectDB } from "./config/db";

dotenv.config();

const PORT = process.env.PORT || 3004;

// Database Connection
connectDB();

// Starting ambulance Service
app.listen(PORT, () => {
  console.log(`🚀 Doctor Service is running on port ${PORT}`);
});
