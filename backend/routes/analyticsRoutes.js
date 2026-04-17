const express = require('express');
const router = express.Router();
const { getDashboardStats, getOrdersTrend } = require('../controllers/analyticsController');
const { protect } = require('../middleware/auth');

router.get('/dashboard', protect, getDashboardStats);
router.get('/orders-trend', protect, getOrdersTrend);

module.exports = router;
