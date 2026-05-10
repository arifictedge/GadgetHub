const express = require('express');
const {
  toggleWishlist,
  toggleCompare,
  getWishlist,
  getCompareList,
  getAllUsers,
  updateUserRole,
  deleteUser,
  updateUserProfile,
} = require('../controllers/userController');
const { protect, adminOnly } = require('../middlewares/authMiddleware');

const router = express.Router();

// @route   PUT /api/users/profile
router.put('/profile', protect, updateUserProfile);

// @route   GET /api/users/wishlist
router.get('/wishlist', protect, getWishlist);

// @route   PUT /api/users/wishlist
router.put('/wishlist', protect, toggleWishlist);

// @route   GET /api/users/compare
router.get('/compare', protect, getCompareList);

// @route   PUT /api/users/compare
router.put('/compare', protect, toggleCompare);

// @route   GET /api/users (Admin only)
router.get('/', protect, adminOnly, getAllUsers);

// @route   PUT /api/users/:id/role (Admin only)
router.put('/:id/role', protect, adminOnly, updateUserRole);

// @route   DELETE /api/users/:id (Admin only)
router.delete('/:id', protect, adminOnly, deleteUser);

module.exports = router;
