const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    orderId: {
        type: String,
        required: true,
        unique: true
    },
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    productSnapshot: {
        name: { type: String, required: true },
        priceAtOrder: { type: Number, required: true },
        optionsSelected: { type: mongoose.Schema.Types.Mixed, default: {} }
    },
    quantity: { type: Number, required: true },
    options: {
        type: mongoose.Schema.Types.Mixed,
        default: {}
    },
    dimensions: {
        width: { type: Number, default: 0 },
        height: { type: Number, default: 0 },
        length: { type: Number, default: 0 }
    },
    price: { type: Number, required: true },
    deliveryCharge: { type: Number, default: 0 },
    finalPrice: { type: Number, required: true },
    totalAmount: { type: Number, required: true },

    // Files
    originalFile: { type: String },
    designPreview: { type: String },
    finalFile: { type: String },

    needDesign: { type: Boolean, default: false },

    // Customer
    customerName: { type: String, required: true },
    mobile: { type: String, required: true },
    address: { type: String },
    notes: { type: String },

    deliveryType: {
        type: String,
        enum: ['Pickup', 'Home Delivery'],
        required: true
    },

    // Status flow
    status: {
        type: String,
        enum: [
            'Pending',
            'Confirmed',
            'In Design',
            'Design Sent',
            'Approved',
            'Printing',
            'Finishing',
            'Packed',
            'Out for Delivery',
            'Delivered'
        ],
        default: 'Pending'
    },

    statusHistory: [{
        status: String,
        timestamp: { type: Date, default: Date.now },
        notes: String
    }],

    internalNotes: { type: String },

    // User Feedback
    userFeedback: {
        rating: { type: Number, min: 1, max: 5 },
        comment: { type: String },
        submittedAt: { type: Date }
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Order', orderSchema);
