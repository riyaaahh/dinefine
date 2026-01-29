const Order = require('../models/Order');

// @desc    Create new order
// @route   POST /api/orders
// @access  Public
const createOrder = async (req, res) => {
    const { tableNumber, items, totalAmount } = req.body;

    if (items && items.length === 0) {
        return res.status(400).json({ message: 'No order items' });
    }

    try {
        const order = new Order({
            tableNumber,
            items,
            totalAmount,
        });

        const createdOrder = await order.save();

        // Emit socket event to Kitchen/Admin rooms
        if (req.io) {
            req.io.emit('new_order', createdOrder);
        }

        res.status(201).json(createdOrder);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private (Kitchen/Admin)
const getOrders = async (req, res) => {
    try {
        // Return most recent first
        const orders = await Order.find({}).sort({ createdAt: -1 });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private
const updateOrderStatus = async (req, res) => {
    const { status, chef } = req.body;
    try {
        const order = await Order.findById(req.params.id);

        if (order) {
            order.status = status;

            // Assign chef if provided
            if (chef) {
                order.chef = chef;
            }

            // Set timestamps based on status
            if (status === 'preparing') order.statusTimestamps.preparingAt = Date.now();
            if (status === 'ready') order.statusTimestamps.readyAt = Date.now();
            if (status === 'served') order.statusTimestamps.servedAt = Date.now();
            if (status === 'completed') order.statusTimestamps.completedAt = Date.now();

            const updatedOrder = await order.save();

            // Emit update to anyone listening (including customer tracking page)
            if (req.io) {
                req.io.emit('order_status_updated', updatedOrder);
            }

            res.json(updatedOrder);
        } else {
            res.status(404).json({ message: 'Order not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Public
const getOrderById = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if (order) {
            res.json(order);
        } else {
            res.status(404).json({ message: 'Order not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get active order for a table
// @route   GET /api/orders/active/:tableNumber
// @access  Public
const getActiveOrderByTable = async (req, res) => {
    try {
        const order = await Order.findOne({
            tableNumber: req.params.tableNumber,
            status: { $in: ['placed', 'assigned', 'preparing', 'ready', 'served'] }
        }).sort({ createdAt: -1 });

        res.json(order);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Cancel order
// @route   PUT /api/orders/:id/cancel
// @access  Public
const cancelOrder = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        // Only allowed if not prepared yet
        if (['ready', 'served', 'completed'].includes(order.status)) {
            return res.status(400).json({ message: 'Order is already being served and cannot be cancelled.' });
        }

        order.status = 'cancelled';
        const updatedOrder = await order.save();

        if (req.io) {
            req.io.emit('order_status_updated', updatedOrder);
        }

        res.json(updatedOrder);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Add items to existing order
// @route   PUT /api/orders/:id/items
// @access  Public
const addItemsToOrder = async (req, res) => {
    const { items, totalAmount } = req.body;
    try {
        const order = await Order.findById(req.params.id);
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        if (order.status === 'completed' || order.status === 'cancelled') {
            return res.status(400).json({ message: 'Cannot add items to a completed or cancelled order.' });
        }

        order.items = [...order.items, ...items];
        order.totalAmount += totalAmount;
        const updatedOrder = await order.save();

        if (req.io) {
            req.io.emit('order_status_updated', updatedOrder);
        }

        res.json(updatedOrder);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { createOrder, getOrders, updateOrderStatus, getOrderById, getActiveOrderByTable, cancelOrder, addItemsToOrder };
