const mongoose = require('mongoose');

const orderSchema = mongoose.Schema({
    tableNumber: { type: String, required: true },
    items: [
        {
            menuItem: { type: mongoose.Schema.Types.ObjectId, ref: 'MenuItem' },
            quantity: { type: Number, default: 1 },
            price: { type: Number },
            name: { type: String } // Snapshot of name
        }
    ],
    totalAmount: { type: Number, required: true },
    status: {
        type: String,
        enum: ['placed', 'assigned', 'preparing', 'ready', 'served', 'completed', 'cancelled'],
        default: 'placed'
    },
    paymentStatus: {
        type: String,
        enum: ['pending', 'paid'],
        default: 'pending'
    },
    statusTimestamps: {
        placedAt: { type: Date, default: Date.now },
        preparingAt: { type: Date },
        readyAt: { type: Date },
        servedAt: { type: Date },
        completedAt: { type: Date }
    },
    customer: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    chef: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

const Order = mongoose.model('Order', orderSchema);
module.exports = Order;
