const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const { protect } = require('../middleware/auth');

// Upload image to Cloudinary
const uploadToCloudinary = async (file) => {
    const uploadOptions = {
        folder: 'printing_press',
        resource_type: 'auto',
        type: 'upload',
        allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp']
    };

    const result = await require('../config/cloudinary').uploader.upload(`data:${file.mimetype};base64,${file.buffer.toString('base64')}`, uploadOptions);
    return result.secure_url;
};

// @route POST /api/upload/image
// @desc Upload image to Cloudinary
// @access Private (Admin only)
router.post('/image', protect, upload.single('image'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, message: 'No image file provided' });
        }

        const imageUrl = await uploadToCloudinary(req.file);

        res.json({
            success: true,
            message: 'Image uploaded successfully',
            data: { imageUrl }
        });
    } catch (error) {
        console.error('Upload error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to upload image',
            error: error.message
        });
    }
});

module.exports = router;