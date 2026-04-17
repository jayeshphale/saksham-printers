const Category = require('../models/Category');
const Product = require('../models/Product');

const getCategories = async (req, res) => {
    try {
        const categories = await Category.find({ isActive: true });
        res.json({ success: true, message: 'Categories fetched successfully', count: categories.length, data: categories });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message, data: null });
    }
};

const getCategoryBySlug = async (req, res) => {
    try {
        const category = await Category.findOne({ slug: req.params.slug, isActive: true });
        if (!category) return res.status(404).json({ success: false, message: 'Category not found', data: null });
        res.json({ success: true, message: 'Category fetched successfully', data: category });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message, data: null });
    }
};

const createCategory = async (req, res) => {
    try {
        const { name, image } = req.body;
        
        if (!name) {
            return res.status(400).json({ success: false, message: 'Category name is required', data: null });
        }
        
        const slug = name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
        
        const existingCategory = await Category.findOne({ slug });
        if (existingCategory) {
            return res.status(400).json({ success: false, message: 'Category already exists', data: null });
        }
        
        const category = await Category.create({
            name,
            slug,
            image: image || '/images/default-category.jpeg',
            isActive: true
        });
        
        res.status(201).json({ success: true, message: 'Category created successfully', data: category });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message, data: null });
    }
};

const updateCategory = async (req, res) => {
    try {
        const { name, image, isActive } = req.body;
        
        const category = await Category.findById(req.params.id);
        if (!category) {
            return res.status(404).json({ success: false, message: 'Category not found', data: null });
        }
        
        if (name) {
            category.name = name;
            category.slug = name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
        }
        
        if (image) category.image = image;
        if (typeof isActive === 'boolean') category.isActive = isActive;
        
        await category.save();
        res.json({ success: true, message: 'Category updated successfully', data: category });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message, data: null });
    }
};

const deleteCategory = async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);
        if (!category) {
            return res.status(404).json({ success: false, message: 'Category not found', data: null });
        }

        const deletedCategoryName = category.name;
        await Product.updateMany(
            { category: deletedCategoryName },
            { $set: { category: 'Uncategorized', subCategory: '' } }
        );

        await category.deleteOne();

        res.json({ success: true, message: 'Category deleted successfully', data: category });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message, data: null });
    }
};

module.exports = { getCategories, getCategoryBySlug, createCategory, updateCategory, deleteCategory };
