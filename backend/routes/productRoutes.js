const express = require('express');
const router = express.Router();
const { getProducts, getProductsAdmin, getProductBySlug, createProduct, updateProduct, deleteProduct, seedProducts } = require('../controllers/productController');
const { protect } = require('../middleware/auth');

router.get('/', getProducts);
router.get('/admin', protect, getProductsAdmin);
router.post('/seed', seedProducts); // Seed strictly ordered before /:slug
router.get('/:slug', getProductBySlug);

// Admin Routes for CMS capability
router.post('/', protect, createProduct);
router.put('/:id', protect, updateProduct);
router.delete('/:id', protect, deleteProduct);

module.exports = router;
