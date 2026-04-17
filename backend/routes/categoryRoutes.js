const express = require('express');
const router = express.Router();
const { getCategories, getCategoryBySlug, createCategory, updateCategory, deleteCategory } = require('../controllers/categoryController');
const { protect } = require('../middleware/auth');

// Middleware to disable caching for category routes
const noCache = (req, res, next) => {
    res.set('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.set('Pragma', 'no-cache');
    res.set('Expires', '0');
    next();
};

router.get('/', noCache, getCategories);
router.get('/:slug', noCache, getCategoryBySlug);

// Admin Routes
router.post('/', protect, createCategory);
router.put('/:id', protect, updateCategory);
router.delete('/:id', protect, deleteCategory);

module.exports = router;
