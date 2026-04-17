const express = require('express');
const router = express.Router();
const {
    createOrder, getOrders, getOrderById,
    updateOrder, uploadOrderFile, approveDesign, submitFeedback
} = require('../controllers/orderController');
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');

// Customer placing order
router.post('/', upload.single('file'), createOrder);
// Customer uploading their file when placing order (optional)
router.post('/:id/upload-file', upload.single('file'), uploadOrderFile);
// Customer approving design
router.post('/:id/approve-design', approveDesign);
// Customer submitting feedback (public route - accessible with tracking ID)
router.post('/:id/feedback', submitFeedback);

// Admin Routes
router.get('/', protect, getOrders);
router.get('/:id', getOrderById); // Admin or customer looking at success page (using order id string or object id)
router.put('/:id', protect, updateOrder);

module.exports = router;
