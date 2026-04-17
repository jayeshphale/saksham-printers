const Order = require('../models/Order');
const Product = require('../models/Product');
const { calculatePrice, calculateDeliveryCharge } = require('../utils/pricingEngine');
const cloudinary = require('../config/cloudinary');

const getCloudinarySecureUrl = (file) => file?.secure_url || null;

const parseNumber = (value) => {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : 0;
};

const parseSizeString = (size = '') => {
    const match = String(size).match(/(\d+(?:\.\d+)?)\s*x\s*(\d+(?:\.\d+)?)(?:\s*x\s*(\d+(?:\.\d+)?))?/i);
    if (!match) return { width: 0, height: 0, length: 0 };
    return {
        width: parseFloat(match[1]) || 0,
        height: parseFloat(match[2]) || 0,
        length: match[3] ? parseFloat(match[3]) || 0 : 0
    };
};

const getOrderDimensions = (options = {}) => {
    const width = parseNumber(options.width);
    const height = parseNumber(options.height);
    const length = parseNumber(options.length);

    if (width && height) return { width, height, length };

    if (options.size) {
        const parsed = parseSizeString(options.size);
        return {
            width: width || parsed.width,
            height: height || parsed.height,
            length: length || parsed.length
        };
    }

    return { width: 0, height: 0, length: 0 };
};

// Upload file to Cloudinary manually
const uploadToCloudinary = async (file) => {
    const isPdf = file.mimetype === 'application/pdf';

    const uploadOptions = {
        folder: 'printing_press',
        resource_type: isPdf ? 'raw' : 'image',
        type: 'upload',
        access_mode: 'public'
    };

    try {
        const result = await cloudinary.uploader.upload(`data:${file.mimetype};base64,${file.buffer.toString('base64')}`, uploadOptions);
        return result.secure_url;
    } catch (error) {
        console.error('Cloudinary upload error:', error);
        throw error;
    }
};

// NOTE: Old uploads using resource_type='auto' may have broken URLs for PDFs.
// To rehydrate these correctly, delete and re-upload affected files from the admin panel.

// @route POST /api/orders
const createOrder = async (req, res) => {
    try {
        let {
            productId, quantity, options, needDesign,
            customerName, mobile, address, notes, deliveryType
        } = req.body;

        const parsedOptions = typeof options === 'string' ? JSON.parse(options) : (options || {});
        needDesign = needDesign === 'true' || needDesign === true;
        quantity = Math.max(1, Number(quantity) || 1);

        const product = await Product.findById(productId);
        if (!product) return res.status(404).json({ success: false, message: 'Product not found' });

        if (product.requiresFile && !req.file) {
            return res.status(400).json({ success: false, message: 'This product requires a print-ready file upload.' });
        }

        let calculatedBasePrice = calculatePrice(product, parsedOptions, quantity);

        if (needDesign && product.serviceType === 'design+print') {
            calculatedBasePrice += 500;
        }

        const deliveryCharge = calculateDeliveryCharge(calculatedBasePrice, deliveryType || 'Home Delivery');
        const totalAmount = calculatedBasePrice + deliveryCharge;
        const dimensions = getOrderDimensions(parsedOptions);

        const orderId = 'ORD-' + Date.now().toString().slice(-6) + Math.floor(Math.random() * 1000);

        let originalFile = null;
        if (req.file) {
            originalFile = await uploadToCloudinary(req.file);
        }

        const order = new Order({
            orderId,
            productId,
            productSnapshot: {
                name: product.name,
                priceAtOrder: calculatedBasePrice,
                optionsSelected: parsedOptions
            },
            quantity,
            options: parsedOptions,
            dimensions,
            price: calculatedBasePrice,
            deliveryCharge,
            finalPrice: calculatedBasePrice,
            totalAmount,
            needDesign,
            originalFile,
            customerName,
            mobile,
            address,
            notes,
            deliveryType: deliveryType || 'Home Delivery',
            status: 'Pending',
            statusHistory: [{ status: 'Pending', notes: 'Order placed by customer' }]
        });

        const createdOrder = await order.save();
        res.status(201).json({ success: true, message: 'Order created successfully', data: createdOrder });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @route GET /api/orders (admin)
const getOrders = async (req, res) => {
    try {
        const { status, search } = req.query;
        let query = {};
        if (status) query.status = status;
        if (search) {
            query.$or = [
                { orderId: { $regex: search, $options: 'i' } },
                { customerName: { $regex: search, $options: 'i' } },
                { mobile: { $regex: search, $options: 'i' } }
            ];
        }
        const orders = await Order.find(query).populate('productId', 'name').sort('-createdAt');
        res.json({ success: true, data: orders });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @route GET /api/orders/:id
const getOrderById = async (req, res) => {
    try {
        let order;
        if (req.query.type === 'stringId') {
            order = await Order.findOne({ orderId: req.params.id }).populate('productId');
        } else {
            order = await Order.findById(req.params.id).populate('productId');
        }
        if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
        res.json({ success: true, data: order });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @route PUT /api/orders/:id
const updateOrder = async (req, res) => {
    try {
        const { status, finalPrice, internalNotes } = req.body;
        const order = await Order.findById(req.params.id);

        if (!order) return res.status(404).json({ success: false, message: 'Order not found' });

        if (status && order.status !== status) {
            order.status = status;
            order.statusHistory.push({ status, notes: `Status updated by Admin to ${status}` });
        }

        if (finalPrice !== undefined) order.finalPrice = finalPrice;
        if (internalNotes) order.internalNotes = internalNotes;

        await order.save();
        res.json({ success: true, data: order });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @route POST /api/orders/:id/upload-file
// Uses upload.single('file') middleware before arriving here
const uploadOrderFile = async (req, res) => {
    try {
        const { fileType } = req.body; // 'originalFile', 'designPreview', 'finalFile'
        const order = await Order.findById(req.params.id);

        if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
        if (!req.file) return res.status(400).json({ success: false, message: 'No file provided' });

        const fileUrl = await uploadToCloudinary(req.file);

        if (fileType === 'originalFile') {
            order.originalFile = fileUrl;
        } else if (fileType === 'designPreview') {
            order.designPreview = fileUrl;
            order.status = 'Design Sent';
            order.statusHistory.push({ status: 'Design Sent', notes: 'Design preview uploaded' });
        } else if (fileType === 'finalFile') {
            order.finalFile = fileUrl;
        } else {
            return res.status(400).json({ success: false, message: 'Invalid fileType' });
        }

        await order.save();
        res.json({ success: true, data: order });
    } catch (error) {
        console.error('Upload error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// @route POST /api/orders/:id/approve-design
const approveDesign = async (req, res) => {
    try {
        const { approved, notes } = req.body; // boolean
        const order = await Order.findById(req.params.id);

        if (!order) return res.status(404).json({ success: false, message: 'Order not found' });

        if (approved) {
            order.status = 'Approved';
            order.statusHistory.push({ status: 'Approved', notes: notes || 'Design approved by customer' });
        } else {
            order.status = 'In Design';
            order.statusHistory.push({ status: 'In Design', notes: notes || 'Design changes requested' });
        }

        await order.save();
        res.json({ success: true, data: order });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @route POST /api/orders/:id/feedback
// Customer submits feedback using order ID from tracking page
const submitFeedback = async (req, res) => {
    try {
        const { rating, comment } = req.body;
        
        if (!rating || rating < 1 || rating > 5) {
            return res.status(400).json({ success: false, message: 'Rating must be between 1 and 5' });
        }

        if (!comment || comment.trim().length === 0) {
            return res.status(400).json({ success: false, message: 'Comment is required' });
        }

        // Find order by ObjectId first, if not found try by orderId string
        let order = await Order.findById(req.params.id);
        if (!order) {
            order = await Order.findOne({ orderId: req.params.id });
        }

        if (!order) {
            return res.status(404).json({ success: false, message: 'Order not found' });
        }

        // Add/update feedback
        order.userFeedback = {
            rating: parseInt(rating),
            comment: comment.trim(),
            submittedAt: new Date()
        };

        await order.save();
        res.json({ success: true, message: 'Feedback submitted successfully', data: order });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = { createOrder, getOrders, getOrderById, updateOrder, uploadOrderFile, approveDesign, submitFeedback };
