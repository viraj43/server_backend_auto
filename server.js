import express from 'express';
import mongoose from 'mongoose';
import triggerRoutes from './routes/triggerRoutes.js';
import authRoutes from './routes/authRoutes.js';
import dotenv from 'dotenv';
import cors from 'cors'; // Import the CORS package
import cookieParser from 'cookie-parser';

dotenv.config();

// Initialize the express app first
const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cookieParser()); // Use cookie-parser middleware to parse cookies
app.use(express.json()); // For parsing application/json

// Use CORS middleware
app.use(
  cors({
    origin: 'https://techmafia.site', // or your deployed frontend domain
    credentials: true,
  })
);


// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected successfully!");
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });

// Routes
app.use('/api/triggers', triggerRoutes);  // e.g., /api/triggers/trigger-country
app.use('/auth', authRoutes);             // e.g., /auth/login

// Start Server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
