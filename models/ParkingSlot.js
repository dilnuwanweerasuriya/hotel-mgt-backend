import mongoose from "mongoose";

const parkingSlotSchema = new mongoose.Schema({
    slotNumber: {
        type: String,
        required: true,
        unique: true
    },
    floor: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ['car', 'bike', 'van', 'bus'],
        required: true
    },
    status: {
        type: String,
        enum: ['available', 'occupied', 'reserved', 'maintenance'],
        default: 'available'
    },
    currentVehicle: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Vehicle',
        default: null
    },
    rate: {
        type: Number,
        required: true
    }
}, {
    timestamps: true
});

const ParkingSlot = mongoose.model('ParkingSlot', parkingSlotSchema);

export default ParkingSlot