const axios = require('axios');
const Product = require('../models/Product');

const generateProductDescription = async (req, res) => {
    try {
        const { productId } = req.body;
        if (!productId) {
            return res.status(400).json({ success: false, message: 'productId is required' });
        }

        const product = await Product.findById(productId).lean();
        if (!product) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }

        const apiKey = process.env.OPENAI_API_KEY;
        if (!apiKey) {
            return res.status(500).json({ success: false, message: 'OpenAI API key is not configured' });
        }

        const prompt = `You are an experienced marketing writer for a premium printing service. Generate a short, persuasive, customer-facing product description in 2-3 sentences. Keep it concise, polished, and relevant to the product details.

Product details:
- Name: ${product.name}
- Category: ${product.category}
- Subcategory: ${product.subCategory || 'General printing'}
- Features: ${product.description || 'High quality printing services'}
- Unit type: ${product.unitType || 'per piece'}
- Service type: ${product.serviceType || 'printing'}
- Options: ${product.options ? JSON.stringify(product.options) : 'None'}

Return only the description without any extra markup or labels.`;

        const response = await axios.post(
            'https://api.openai.com/v1/chat/completions',
            {
                model: 'gpt-3.5-turbo',
                messages: [
                    { role: 'system', content: 'You generate clean marketing descriptions for printing products.' },
                    { role: 'user', content: prompt }
                ],
                max_tokens: 180,
                temperature: 0.8,
            },
            {
                headers: {
                    Authorization: `Bearer ${apiKey}`,
                    'Content-Type': 'application/json',
                },
            }
        );

        const description = response.data?.choices?.[0]?.message?.content?.trim();
        if (!description) {
            return res.status(500).json({ success: false, message: 'No response returned from OpenAI' });
        }

        res.json({ success: true, message: 'AI description generated successfully', data: { description } });
    } catch (error) {
        console.error('AI description error:', error?.response?.data || error.message || error);
        res.status(500).json({ success: false, message: 'Failed to generate AI description' });
    }
};

module.exports = { generateProductDescription };