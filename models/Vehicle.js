import mongoose from "mongoose";

const vehicleSchema = new mongoose.Schema({
    vehicleNumber: {
        type: String,
        required: true,
        unique: true
    },
    vehicleType: {
        type: String,
        enum: ['car', 'bike', 'van', 'bus'],
        required: true
    },
    guestName: {
        type: String,
        required: true
    },
    guestRoom: {
        type: String,
        required: true
    },
    guestPhone: {
        type: String,
        required: true
    },
    parkingSlot: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ParkingSlot',
        required: true
    },
    entryTime: {
        type: Date,
        default: Date.now
    },
    exitTime: {
        type: Date,
        default: null
    },
    status: {
        type: String,
        enum: ['parked', 'exited'],
        default: 'parked'
    },
    totalAmount: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

const Vehicle = mongoose.model('Vehicle', vehicleSchema);

export default Vehicle