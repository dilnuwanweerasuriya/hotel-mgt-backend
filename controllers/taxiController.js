import TaxiBooking from "../models/TaxiBooking.js";
import Driver from "../models/Driver.js";

// Fare calculation rates
const FARE_RATES = {
    sedan: { base: 50, perKm: 12 },
    suv: { base: 80, perKm: 15 },
    luxury: { base: 150, perKm: 25 },
    van: { base: 100, perKm: 18 },
    bus: { base: 200, perKm: 20 }
};

// Create transport booking
export const createBooking = async (req, res) => {
    try {
        const { guestName, guestRoom, guestPhone, pickupLocation, dropLocation, pickupTime, vehicleType, distance } = req.body;

        // Generate booking ID
        const bookingId = 'TB' + Date.now();

        // Calculate fare
        const rates = FARE_RATES[vehicleType];
        const baseFare = rates.base;
        const totalFare = baseFare + (distance * rates.perKm);

        // Find available driver
        const driver = await Driver.findOne({ vehicleType, status: 'available' });

        const booking = new TaxiBooking({
            bookingId,
            guestName,
            guestRoom,
            guestPhone,
            pickupLocation,
            dropLocation,
            pickupTime,
            vehicleType,
            driver: driver ? driver._id : null,
            distance,
            baseFare,
            totalFare,
            status: driver ? 'confirmed' : 'pending'
        });

        await booking.save();

        // Update driver status if assigned
        if (driver) {
            driver.status = 'busy';
            await driver.save();
        }

        const populatedBooking = await TaxiBooking.findById(booking._id).populate('driver');
        res.status(201).json({ success: true, data: populatedBooking });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
}

// Get all bookings
export const getAllBookings = async (req, res) => {
    try {
        const bookings = await TaxiBooking.find().populate('driver').sort({ createdAt: -1 });
        res.json({ success: true, data: bookings });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

// Get booking by ID
export const getBookingById = async (req, res) => {
    try {
        const booking = await TaxiBooking.findById(req.params.id).populate('driver');
        if (!booking) {
            return res.status(404).json({ success: false, message: 'Booking not found' });
        }
        res.json({ success: true, data: booking });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

// Update booking status
export const updateBookingStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const booking = await TaxiBooking.findById(req.params.id).populate('driver');

        if (!booking) {
            return res.status(404).json({ success: false, message: 'Booking not found' });
        }

        booking.status = status;
        await booking.save();

        // If completed or cancelled, make driver available
        if ((status === 'completed' || status === 'cancelled') && booking.driver) {
            const driver = await Driver.findById(booking.driver._id);
            driver.status = 'available';
            await driver.save();
        }

        res.json({ success: true, data: booking });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

// Assign driver to booking
export const assignDriver = async (req, res) => {
    try {
        const { driverId } = req.body;
        const booking = await TaxiBooking.findById(req.params.id);

        if (!booking) {
            return res.status(404).json({ success: false, message: 'Booking not found' });
        }

        const driver = await Driver.findById(driverId);
        if (!driver || driver.status !== 'available') {
            return res.status(400).json({ success: false, message: 'Driver not available' });
        }

        booking.driver = driverId;
        booking.status = 'confirmed';
        await booking.save();

        driver.status = 'busy';
        await driver.save();

        const updatedBooking = await TaxiBooking.findById(booking._id).populate('driver');
        res.json({ success: true, data: updatedBooking });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

// Get all drivers
export const getAllDrivers = async (req, res) => {
    try {
        const drivers = await Driver.find();
        res.json({ success: true, data: drivers });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

// Create driver
export const createDriver = async (req, res) => {
    try {
        const driver = new Driver(req.body);
        await driver.save();
        res.status(201).json({ success: true, data: driver });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
}

// Get available drivers
export const getAvailableDrivers = async (req, res) => {
    try {
        const { vehicleType } = req.query;
        const query = { status: 'available' };
        if (vehicleType) query.vehicleType = vehicleType;

        const drivers = await Driver.find(query);
        res.json({ success: true, data: drivers });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

// Update payment status
export const updatePaymentStatus = async (req, res) => {
    try {
        const { paymentStatus } = req.body;
        const booking = await TaxiBooking.findById(req.params.id);

        if (!booking) {
            return res.status(404).json({ success: false, message: 'Booking not found' });
        }

        booking.paymentStatus = paymentStatus;
        await booking.save();

        res.json({ success: true, data: booking });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}