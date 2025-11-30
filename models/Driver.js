import mongoose from "mongoose";

const driverSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true,
        unique: true
    },
    licenseNumber: {
        type: String,
        required: true,
        unique: true
    },
    vehicleNumber: {
        type: String,
        required: true
    },
    vehicleType: {
        type: String,
        enum: ['sedan', 'suv', 'luxury', 'van', 'bus'],
        required: true
    },
    status: {
        type: String,
        enum: ['available', 'busy', 'off-duty'],
        default: 'available'
    },
    rating: {
        type: Number,
        min: 0,
        max: 5,
        default: 5
    }
}, {
    timestamps: true
});

const Driver = mongoose.model('Driver', driverSchema);

export default Driver