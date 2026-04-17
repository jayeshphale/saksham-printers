const mongoose = require('mongoose');

const pricingRuleSchema = new mongoose.Schema({
    condition: {
        type: mongoose.Schema.Types.Mixed,
        required: true
    },
    price: {
        type: Number,
        required: true
    }
}, { _id: false });

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    slug: {
        type: String,
        unique: true,
        lowercase: true,
        trim: true
    },
    description: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true,
        trim: true,
        default: 'Uncategorized'
    },
    subCategory: {
        type: String,
        trim: true,
        default: ''
    },
    type: {
        type: String,
        enum: ['fixed', 'dimension', 'shape', 'custom', 'hybrid'],
        required: true,
        default: 'fixed'
    },
    unitType: {
        type: String,
        enum: ['per_piece', 'per_sqft'],
        required: true,
        default: 'per_piece'
    },
    basePrice: {
        type: Number,
        required: true
    },
    minPrice: {
        type: Number,
        default: 0
    },
    requiresFile: {
        type: Boolean,
        default: false
    },
    serviceType: {
        type: String,
        enum: ['print', 'design+print'],
        default: 'print'
    },
    image: {
        type: String,
        required: true
    },
    options: {
        quantity: [{ type: Number }],
        size: [{ type: String }],
        finish: [{ type: String }],
        material: [{ type: String }],
        shape: [{ type: String }],
        width: { type: Boolean, default: false },
        height: { type: Boolean, default: false },
        length: { type: Boolean, default: false },
        customOptions: [{
            key: { type: String },
            values: [{ type: String }]
        }]
    },
    pricingRules: [pricingRuleSchema],
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Product', productSchema);
