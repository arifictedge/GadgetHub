const express = require('express');
const {
  createOrder,
  getMyOrders,
  getAllOrders,
  updateOrderStatus,
} = require('../controllers/orderController');
const { protect, adminOnly } = require('../middlewares/authMiddleware');

const router = express.Router();

// @route   POST /api/orders
router.post('/', protect, createOrder);

// @route   GET /api/orders/my-orders
router.get('/my-orders', protect, getMyOrders);

// @route   GET /api/orders (Admin only)
router.get('/', protect, adminOnly, getAllOrders);

// @route   PUT /api/orders/:id/status (Admin only)
router.put('/:id/status', protect, adminOnly, updateOrderStatus);

module.exports = router;
