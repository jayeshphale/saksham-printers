const Order = require('../models/Order');
const Product = require('../models/Product');

// GET /api/analytics/dashboard
const getDashboardStats = async (req, res) => {
    try {
        const totalOrders = await Order.countDocuments();
        const totalRevenue = await Order.aggregate([
            { $group: { _id: null, total: { $sum: '$finalPrice' } } }
        ]);

        const ordersByStatus = await Order.aggregate([
            { $group: { _id: '$status', count: { $sum: 1 } } }
        ]);

        const recentOrders = await Order.find()
            .populate('productId', 'name')
            .sort('-createdAt')
            .limit(5);

        const topProducts = await Order.aggregate([
            { $group: { _id: '$productId', count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 5 },
            { $lookup: { from: 'products', localField: '_id', foreignField: '_id', as: 'product' } }
        ]);

        // Orders today
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const ordersToday = await Order.countDocuments({ createdAt: { $gte: today } });

        // Pending orders
        const pendingOrders = await Order.countDocuments({ 
            status: { $in: ['Pending', 'Confirmed', 'In Design'] } 
        });

        res.json({
            success: true,
            data: {
                totalOrders,
                totalRevenue: totalRevenue[0]?.total || 0,
                ordersToday,
                pendingOrders,
                ordersByStatus,
                recentOrders,
                topProducts
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// GET /api/analytics/orders-trend
const getOrdersTrend = async (req, res) => {
    try {
        const { days = 7 } = req.query;
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - days);

        const trend = await Order.aggregate([
            {
                $match: { createdAt: { $gte: startDate } }
            },
            {
                $group: {
                    _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
                    orders: { $sum: 1 },
                    revenue: { $sum: '$finalPrice' }
                }
            },
            { $sort: { _id: 1 } }
        ]);

        res.json({ success: true, data: trend });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = { getDashboardStats, getOrdersTrend };
