import express from "express";
import { assignDriver, createBooking, createDriver, getAllBookings, getAllDrivers, getAvailableDrivers, getBookingById, updateBookingStatus, updatePaymentStatus } from "../controllers/taxiController.js";

const transportRouter = express.Router();

transportRouter.post('/bookings', createBooking);
transportRouter.get('/bookings', getAllBookings);
transportRouter.get('/bookings/:id', getBookingById);
transportRouter.put('/bookings/:id/status', updateBookingStatus);
transportRouter.put('/bookings/:id/assign-driver', assignDriver);
transportRouter.put('/bookings/:id/payment', updatePaymentStatus);

transportRouter.get('/drivers', getAllDrivers);
transportRouter.get('/drivers/available', getAvailableDrivers);
transportRouter.post('/drivers', createDriver);

export default transportRouter