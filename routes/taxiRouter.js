import express from "express";
import { assignDriver, createBooking, createDriver, getAllBookings, getAllDrivers, getAvailableDrivers, getBookingById, getTaxiStats, updateBookingStatus, updatePaymentStatus } from "../controllers/taxiController.js";

const taxiRouter = express.Router();

taxiRouter.post('/bookings', createBooking);
taxiRouter.get('/bookings', getAllBookings);
taxiRouter.get('/bookings/:id', getBookingById);
taxiRouter.put('/bookings/:id/status', updateBookingStatus);
taxiRouter.put('/bookings/:id/assign-driver', assignDriver);
taxiRouter.put('/bookings/:id/payment', updatePaymentStatus);

taxiRouter.get('/drivers', getAllDrivers);
taxiRouter.get('/drivers/available', getAvailableDrivers);
taxiRouter.post('/drivers', createDriver);

taxiRouter.get('/stats', getTaxiStats)

export default taxiRouter