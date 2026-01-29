const Order = require('../models/Order');

// @desc    Get sales stats
// @route   GET /api/reports/sales
// @access  Admin
const getSalesStats = async (req, res) => {
    try {
        // Basic stats
        const totalSales = await Order.aggregate([
            { $match: { status: 'completed' } },
            { $group: { _id: null, total: { $sum: '$totalAmount' }, count: { $sum: 1 } } }
        ]);

        const totalRevenue = totalSales[0]?.total || 0;
        const totalOrders = totalSales[0]?.count || 0;
        const avgTicket = totalOrders > 0 ? (totalRevenue / totalOrders).toFixed(2) : 0;

        // Daily sales for chart (last 7 days)
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        const dailyChart = await Order.aggregate([
            {
                $match: {
                    status: 'completed',
                    createdAt: { $gte: sevenDaysAgo }
                }
            },
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                    total: { $sum: "$totalAmount" }
                }
            },
            { $sort: { "_id": 1 } }
        ]);

        // Recent transactions
        const recentOrders = await Order.find({ status: 'completed' })
            .sort({ createdAt: -1 })
            .limit(5);

        res.json({
            summary: {
                totalRevenue,
                totalOrders,
                avgTicket
            },
            chartData: dailyChart,
            recentOrders
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getSalesStats };
