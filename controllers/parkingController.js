import ParkingSlot from "../models/ParkingSlot.js";
import Vehicle from "../models/Vehicle.js";

// Get all parking slots with real-time availability
export const getAllSlots = async (req, res) => {
    try {
        const slots = await ParkingSlot.find().populate('currentVehicle');
        res.json({ success: true, data: slots });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

//Get available slots
export const getAvailableSlots = async (req, res) => {
    try {
        const { type } = req.query;
        const query = { status: 'available' };
        if (type) query.type = type;

        const slots = await ParkingSlot.find(query);
        res.json({ success: true, data: slots });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

//Create parking slot
export const createParkingSlot = async (req, res) => {
    try {
        const slot = new ParkingSlot(req.body);
        await slot.save();
        res.status(201).json({ success: true, data: slot });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
}

// Park vehicle
export const parkVehicle = async (req, res) => {
    try {
        const { vehicleNumber, vehicleType, guestName, guestRoom, guestPhone, parkingSlotId } = req.body;

        // Check if slot is available
        const slot = await ParkingSlot.findById(parkingSlotId);
        if (!slot || slot.status !== 'available') {
            return res.status(400).json({ success: false, message: 'Parking slot not available' });
        }

        // Create vehicle entry
        const vehicle = new Vehicle({
            vehicleNumber,
            vehicleType,
            guestName,
            guestRoom,
            guestPhone,
            parkingSlot: parkingSlotId
        });
        await vehicle.save();

        // Update slot status
        slot.status = 'occupied';
        slot.currentVehicle = vehicle._id;
        await slot.save();

        res.status(201).json({ success: true, data: vehicle });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
}

// Get all parked vehicles
export const getParkedVehicles = async (req, res) => {
    try {
        const vehicles = await Vehicle.find({ status: 'parked' }).populate('parkingSlot');
        res.json({ success: true, data: vehicles });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

//Exit vehicle
export const exitVehicle = async (req, res) => {
    try {
        const { vehicleId } = req.params;

        const vehicle = await Vehicle.findById(vehicleId).populate('parkingSlot');
        if (!vehicle) {
            return res.status(404).json({ success: false, message: 'Vehicle not found' });
        }

        // Calculate parking duration and amount
        const exitTime = new Date();
        const entryTime = new Date(vehicle.entryTime);
        const hours = Math.ceil((exitTime - entryTime) / (1000 * 60 * 60));
        const totalAmount = hours * vehicle.parkingSlot.rate;

        vehicle.exitTime = exitTime;
        vehicle.status = 'exited';
        vehicle.totalAmount = totalAmount;
        await vehicle.save();

        // Update slot status
        const slot = await ParkingSlot.findById(vehicle.parkingSlot);
        slot.status = 'available';
        slot.currentVehicle = null;
        await slot.save(); { }

        res.json({ success: true, data: vehicle });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

// Get parking statistics
export const getParkingStats = async (req, res) => {
    try {
        const totalSlots = await ParkingSlot.countDocuments();
        const availableSlots = await ParkingSlot.countDocuments({ status: 'available' });
        const occupiedSlots = await ParkingSlot.countDocuments({ status: 'occupied' });
        const parkedVehicles = await Vehicle.countDocuments({ status: 'parked' });

        res.json({
            success: true,
            data: {
                totalSlots,
                availableSlots,
                occupiedSlots,
                parkedVehicles
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

// Get all vehicle history (both parked and exited)
export const getAllVehicleHistory = async (req, res) => {
    try {
        const vehicles = await Vehicle.find()
            .populate('parkingSlot')
            .sort({ entryTime: -1 });
        res.json({ success: true, data: vehicles });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
