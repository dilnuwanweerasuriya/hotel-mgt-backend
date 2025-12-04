import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import connectDB from "./config/database.js";
import parkingRouter from "./routes/parkingRouter.js";
import taxiRouter from "./routes/taxiRouter.js";
import authRouter from "./routes/authRouter.js";

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
app.use("/api/auth", authRouter);
app.use("/api/parking", parkingRouter);
app.use("/api/taxi", taxiRouter);


mongoose.connection.once('open', async () => {
    try {
        const Driver = mongoose.connection.collection('drivers');

        try {
            await Driver.dropIndex('employeeId_1');
            console.log('✅ Cleaned up old employeeId index');
        } catch (error) {
            if (error.code !== 27) {
                console.log('ℹ️  No old indexes to clean up');
            }
        }
    } catch (error) {
        console.log('ℹ️  Collection not yet created');
    }
});

// Start server
app.listen(PORT, () => {
    console.log("Server is running on port 5000")
})