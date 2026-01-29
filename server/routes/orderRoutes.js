const express = require('express');
const router = express.Router();
const { createOrder, getOrders, updateOrderStatus, getOrderById, getActiveOrderByTable, cancelOrder, addItemsToOrder } = require('../controllers/orderController');

router.route('/').post(createOrder).get(getOrders);
router.route('/active/:tableNumber').get(getActiveOrderByTable);
router.route('/:id').get(getOrderById);
router.route('/:id/status').put(updateOrderStatus);
router.route('/:id/cancel').put(cancelOrder);
router.route('/:id/items').put(addItemsToOrder);

module.exports = router;
