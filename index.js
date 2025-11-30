import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import connectDB from "./config/database.js";
import parkingRouter from "./routes/parkingRouter.js";
import transportRouter from "./routes/taxiRouter.js";

// Load environment variables
dotenv.config()

// Create express app
const app = express()

// PORT
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Parse JSON
app.use(express.json())

// Routes
app.use("/api/parking", parkingRouter);
app.use("/api/taxi", transportRouter);

// Start server
app.listen(PORT, () => {
    console.log("Server is running on port 5000")
})