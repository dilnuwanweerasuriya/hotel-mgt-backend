import mongoose from "mongoose";

const taxiBoookingSchema = new mongoose.Schema({
    bookingId: {
        type: String,
        required: true,
        unique: true
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
    pickupLocation: {
        type: String,
        required: true
    },
    dropLocation: {
        type: String,
        required: true
    },
    pickupTime: {
        type: Date,
        required: true
    },
    vehicleType: {
        type: String,
        enum: ['sedan', 'suv', 'luxury', 'van', 'bus'],
        required: true
    },
    driver: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Driver',
        default: null
    },
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'in-progress', 'completed', 'cancelled'],
        default: 'pending'
    },
    distance: {
        type: Number,
        default: 0
    },
    baseFare: {
        type: Number,
        default: 0
    },
    totalFare: {
        type: Number,
        default: 0
    },
    paymentStatus: {
        type: String,
        enum: ['pending', 'paid', 'refunded'],
        default: 'pending'
    },
    notes: {
        type: String,
        default: ''
    }
}, {
    timestamps: true
});

const TaxiBooking = mongoose.model('TaxiBooking', taxiBoookingSchema);

export default TaxiBooking