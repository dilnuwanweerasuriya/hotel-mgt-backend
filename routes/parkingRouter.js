import express from "express";
import { createParkingSlot, exitVehicle, getAllSlots, getAllVehicleHistory, getAvailableSlots, getParkedVehicles, getParkingStats, parkVehicle } from "../controllers/parkingController.js";

const parkingRouter = express.Router();

parkingRouter.get('/slots', getAllSlots);
parkingRouter.get('/slots/available', getAvailableSlots);
parkingRouter.post('/slots', createParkingSlot);
parkingRouter.post('/vehicles/park', parkVehicle);
parkingRouter.get('/vehicles', getParkedVehicles);
parkingRouter.get('/vehicles/history', getAllVehicleHistory);
parkingRouter.put('/vehicles/:vehicleId/exit', exitVehicle);
parkingRouter.get('/stats', getParkingStats);

export default parkingRouter;