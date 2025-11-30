import mongoose from "mongoose";

const ParkingLogSchema = new mongoose.Schema({
    vehicle: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Vehicle',
        required: true
    },
    slot: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ParkingSlot',
        required: true
    },
    entryTime: {
        type: Date,
        required: true
    },
    exitTime: Date,
    duration: Number, // in minutes
    charges: {
        amount: Number,
        paid: {
            type: Boolean,
            default: false
        },
        paymentMethod: String,
        transactionId: String
    },
    attendant: {
        name: String,
        employeeId: String
    }
}, {
    timestamps: true
});

const ParkingLog = mongoose.model('ParkingLog', ParkingLogSchema);

export default ParkingLog