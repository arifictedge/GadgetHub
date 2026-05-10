const express = require('express');
const { body } = require('express-validator');
const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getCategories,
} = require('../controllers/productController');
const { protect, adminOnly } = require('../middlewares/authMiddleware');

const router = express.Router();

// @route   GET /api/products
router.get('/', getProducts);
router.get('/categories', getCategories);

// @route   GET /api/products/:id
router.get('/:id', getProductById);

// @route   POST /api/products (Admin only)
router.post(
  '/',
  protect,
  adminOnly,
  [
    body('name').trim().notEmpty().withMessage('Product name is required'),
    body('brand').trim().notEmpty().withMessage('Brand is required'),
    body('category').notEmpty().withMessage('Category is required'),
    body('price').isNumeric().withMessage('Price must be a number'),
    body('stock').isNumeric().withMessage('Stock must be a number'),
    body('description').trim().notEmpty().withMessage('Description is required'),
  ],
  createProduct
);

// @route   PUT /api/products/:id (Admin only)
router.put('/:id', protect, adminOnly, updateProduct);

// @route   DELETE /api/products/:id (Admin only)
router.delete('/:id', protect, adminOnly, deleteProduct);

module.exports = router;
