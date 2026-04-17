const Product = require('../models/Product');

// GET /api/products
const getProducts = async (req, res) => {
    try {
        const { category, subCategory, page = 1, limit = 12 } = req.query;
        let query = { isActive: true };
        if (category) query.category = category;
        if (subCategory) query.subCategory = subCategory;

        const skip = (parseInt(page) - 1) * parseInt(limit);
        const total = await Product.countDocuments(query);
        const products = await Product.find(query).limit(parseInt(limit)).skip(skip).lean();
        
        res.json({ 
            success: true, 
            message: 'Products fetched successfully', 
            count: products.length,
            total,
            page: parseInt(page),
            pages: Math.ceil(total / parseInt(limit)),
            data: products 
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message, data: null });
    }
};

// GET /api/products/admin
const getProductsAdmin = async (req, res) => {
    try {
        const { category, subCategory, search = '', page = 1, limit = 50 } = req.query;
        let query = {};
        if (category) query.category = category;
        if (subCategory) query.subCategory = subCategory;
        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { category: { $regex: search, $options: 'i' } },
                { subCategory: { $regex: search, $options: 'i' } }
            ];
        }

        const skip = (parseInt(page) - 1) * parseInt(limit);
        const total = await Product.countDocuments(query);
        const products = await Product.find(query).limit(parseInt(limit)).skip(skip).lean();

        res.json({ 
            success: true, 
            message: 'Admin products fetched successfully', 
            count: products.length,
            total,
            page: parseInt(page),
            pages: Math.ceil(total / parseInt(limit)),
            data: products 
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message, data: null });
    }
};

// GET /api/products/:slug
const getProductBySlug = async (req, res) => {
    try {
        const product = await Product.findOne({ slug: req.params.slug, isActive: true });
        if (product) {
            res.json({ success: true, message: 'Product fetched successfully', data: product });
        } else {
            res.status(404).json({ success: false, message: 'Product not found', data: null });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: error.message, data: null });
    }
};

// POST /api/products (admin)
const createProduct = async (req, res) => {
    try {
        // Checking if product exists
        const existing = await Product.findOne({ name: req.body.name });
        if (existing) {
            return res.status(400).json({ success: false, message: 'Product with this name already exists', data: null });
        }
        const payload = { ...req.body };
        if (!payload.slug && payload.name) {
            payload.slug = payload.name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
        }

        const product = await Product.create(payload);
        res.status(201).json({ success: true, message: 'Product created successfully', data: product });
    } catch (error) {
        // Duplicate key handling for unique slug
        if (error.code === 11000) {
            return res.status(400).json({ success: false, message: 'Duplicate slug or product detected', data: null });
        }
        res.status(400).json({ success: false, message: error.message, data: null });
    }
};

// PUT /api/products/:id (admin)
const updateProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!product) return res.status(404).json({ success: false, message: 'Product not found', data: null });
        res.json({ success: true, message: 'Product updated successfully', data: product });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message, data: null });
    }
};

// POST /api/products/seed
const seedProducts = async (req, res) => {
    try {
        await Product.deleteMany();

        const seedData = [
            // Fixed products
            {
                name: 'Visiting Cards',
                description: 'Economy visiting cards with sharp print quality and clean edges.',
                category: 'Business Essentials', subCategory: 'Cards',
                type: 'fixed',
                unitType: 'per_piece',
                basePrice: 3,
                image: 'https://images.unsplash.com/photo-1572983570659-1e30932598fb',
                options: { quantity: [100, 500, 1000], finish: ['Matte', 'Glossy'], material: ['Standard', 'Premium'] },
                pricingRules: [
                    { condition: { quantity: { $gte: 1000 } }, price: 1.8 },
                    { condition: { quantity: { $gte: 500 } }, price: 2.0 },
                    { condition: { quantity: { $lt: 500 } }, price: 3.0 }
                ],
                requiresFile: true,
                serviceType: 'print',
                isActive: true
            },
            {
                name: 'Flyers',
                description: 'High-impact promotional flyers in popular sizes for events and campaigns.',
                category: 'Business Essentials', subCategory: 'Flyers',
                type: 'fixed',
                unitType: 'per_piece',
                basePrice: 2,
                image: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4',
                options: { quantity: [100, 500, 1000], finish: ['Matte', 'Glossy'] },
                pricingRules: [
                    { condition: { quantity: { $gte: 1000 } }, price: 1.5 },
                    { condition: { quantity: { $gte: 500 } }, price: 1.6 },
                    { condition: { quantity: { $lt: 500 } }, price: 2.0 }
                ],
                requiresFile: true,
                serviceType: 'print',
                isActive: true
            },
            {
                name: 'Business Cards',
                description: 'Professional business cards with crisp finishes for corporate branding.',
                category: 'Business Essentials', subCategory: 'Cards',
                type: 'fixed',
                unitType: 'per_piece',
                basePrice: 4,
                image: 'https://images.unsplash.com/photo-1572983570659-1e30932598fb',
                options: { quantity: [100, 500, 1000], finish: ['Matte', 'Glossy', 'Soft Touch'] },
                pricingRules: [
                    { condition: { quantity: { $gte: 1000 } }, price: 1.9 },
                    { condition: { quantity: { $gte: 500 } }, price: 2.5 }
                ],
                requiresFile: true,
                serviceType: 'print',
                isActive: true
            },
            {
                name: 'Postcards',
                description: 'Standard postcards for invites, announcements, and brand mailers.',
                category: 'Business Essentials', subCategory: 'Mailers',
                type: 'fixed',
                unitType: 'per_piece',
                basePrice: 2.5,
                image: 'https://images.unsplash.com/photo-1586075010923-2dd4570fb338',
                options: { quantity: [100, 500, 1000], finish: ['Matte', 'Glossy'] },
                pricingRules: [
                    { condition: { quantity: { $gte: 1000 } }, price: 1.4 },
                    { condition: { quantity: { $gte: 500 } }, price: 1.8 }
                ],
                requiresFile: true,
                serviceType: 'print',
                isActive: true
            },
            {
                name: 'Hang Tags',
                description: 'Retail hang tags with premium stock and elegant finishes.',
                category: 'Business Essentials', subCategory: 'Tags',
                type: 'fixed',
                unitType: 'per_piece',
                basePrice: 3.5,
                image: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc',
                options: { quantity: [100, 500, 1000], finish: ['Matte', 'Glossy', 'Spot UV'] },
                pricingRules: [
                    { condition: { quantity: { $gte: 1000 } }, price: 1.9 },
                    { condition: { quantity: { $gte: 500 } }, price: 2.6 }
                ],
                requiresFile: true,
                serviceType: 'print',
                isActive: true
            },
            {
                name: 'Invoice Books',
                description: 'Custom invoice books with sequential numbering and carbon copy pages.',
                category: 'Business Essentials', subCategory: 'Books',
                type: 'fixed',
                unitType: 'per_piece',
                basePrice: 30,
                image: 'https://images.unsplash.com/photo-1544816155-12df9643f363',
                options: { quantity: [50, 100, 200], finish: ['Single Color', 'Full Color'] },
                pricingRules: [
                    { condition: { quantity: { $gte: 200 } }, price: 25 }
                ],
                requiresFile: true,
                serviceType: 'print',
                isActive: true
            },
            {
                name: 'Event Tickets',
                description: 'Ticket printing for conferences, concerts, and events.',
                category: 'Business Essentials', subCategory: 'Tickets',
                type: 'fixed',
                unitType: 'per_piece',
                basePrice: 1.8,
                image: 'https://images.unsplash.com/photo-1622557850711-2fa318cf1b37',
                options: { quantity: [100, 500, 1000], finish: ['Matte', 'Glossy'] },
                pricingRules: [
                    { condition: { quantity: { $gte: 1000 } }, price: 0.9 },
                    { condition: { quantity: { $gte: 500 } }, price: 1.2 }
                ],
                requiresFile: true,
                serviceType: 'print',
                isActive: true
            },
            {
                name: 'Letterheads',
                description: 'Custom letterheads for company communication and official stationery.',
                category: 'Business Essentials', subCategory: 'Stationery',
                type: 'fixed',
                unitType: 'per_piece',
                basePrice: 4.5,
                image: 'https://images.unsplash.com/photo-1586075010923-2dd4570fb338',
                options: { quantity: [100, 250, 500], paperType: ['100gsm Bond', '120gsm Executive'] },
                pricingRules: [
                    { condition: { quantity: { $gte: 500 } }, price: 3.5 },
                    { condition: { paperType: '120gsm Executive' }, price: 6 }
                ],
                requiresFile: true,
                serviceType: 'design+print',
                isActive: true
            },
            {
                name: 'Envelopes',
                description: 'Branded envelopes in standard sizes with quality print finishes.',
                category: 'Business Essentials', subCategory: 'Stationery',
                type: 'fixed',
                unitType: 'per_piece',
                basePrice: 2.2,
                image: 'https://images.unsplash.com/photo-1586075010923-2dd4570fb338',
                options: { quantity: [100, 500, 1000], finish: ['Plain', 'Window'] },
                pricingRules: [
                    { condition: { quantity: { $gte: 1000 } }, price: 1.3 },
                    { condition: { quantity: { $gte: 500 } }, price: 1.7 }
                ],
                requiresFile: true,
                serviceType: 'print',
                isActive: true
            },
            {
                name: 'Appointment Cards',
                description: 'Compact appointment cards with optional finish and customization.',
                category: 'Business Essentials', subCategory: 'Cards',
                type: 'fixed',
                unitType: 'per_piece',
                basePrice: 2.8,
                image: 'https://images.unsplash.com/photo-1572983570659-1e30932598fb',
                options: { quantity: [100, 500, 1000], finish: ['Matte', 'Glossy'] },
                pricingRules: [
                    { condition: { quantity: { $gte: 1000 } }, price: 1.7 },
                    { condition: { quantity: { $gte: 500 } }, price: 2.2 }
                ],
                requiresFile: true,
                serviceType: 'print',
                isActive: true
            },

            // Dimension products
            {
                name: 'Flex Banner',
                description: 'Weatherproof flex banners for exhibitions and storefronts.',
                category: 'Large Format', subCategory: 'Banners',
                type: 'dimension',
                unitType: 'per_sqft',
                basePrice: 15,
                minPrice: 100,
                image: 'https://images.unsplash.com/photo-1616052848529-65fc065f4e15',
                options: { width: true, height: true, size: ['2x3 ft', '3x4 ft', '4x6 ft'] },
                pricingRules: [{ condition: { size: '4x6 ft' }, price: 18 }],
                requiresFile: true,
                serviceType: 'print',
                isActive: true
            },
            {
                name: 'Vinyl Print',
                description: 'High-gloss vinyl printed material for indoor and outdoor signage.',
                category: 'Large Format', subCategory: 'Vinyl',
                type: 'dimension',
                unitType: 'per_sqft',
                basePrice: 20,
                minPrice: 100,
                image: 'https://images.unsplash.com/photo-1616052848529-65fc065f4e15',
                options: { width: true, height: true, size: ['2x2 ft', '3x3 ft'] },
                pricingRules: [{ condition: { size: '3x3 ft' }, price: 35 }],
                requiresFile: true,
                serviceType: 'print',
                isActive: true
            },
            {
                name: 'Sunboard Panel',
                description: 'Rigid sunboard panels ideal for point-of-sale branding.',
                category: 'Large Format', subCategory: 'Boards',
                type: 'dimension',
                unitType: 'per_sqft',
                basePrice: 25,
                minPrice: 120,
                image: 'https://images.unsplash.com/photo-1616052848529-65fc065f4e15',
                options: { width: true, height: true, size: ['1x2 ft', '2x3 ft'] },
                pricingRules: [],
                requiresFile: true,
                serviceType: 'print',
                isActive: true
            },
            {
                name: 'Backlit Banner',
                description: 'Backlit banners with bright, even color for lightbox displays.',
                category: 'Large Format', subCategory: 'Banners',
                type: 'dimension',
                unitType: 'per_sqft',
                basePrice: 22,
                minPrice: 150,
                image: 'https://images.unsplash.com/photo-1616052848529-65fc065f4e15',
                options: { width: true, height: true, size: ['3x4 ft', '4x6 ft'] },
                pricingRules: [{ condition: { size: '4x6 ft' }, price: 28 }],
                requiresFile: true,
                serviceType: 'print',
                isActive: true
            },
            {
                name: 'Mesh Banner',
                description: 'Perforated mesh banner printing built for outdoor use.',
                category: 'Large Format', subCategory: 'Banners',
                type: 'dimension',
                unitType: 'per_sqft',
                basePrice: 18,
                minPrice: 130,
                image: 'https://images.unsplash.com/photo-1616052848529-65fc065f4e15',
                options: { width: true, height: true, size: ['4x4 ft', '5x5 ft'] },
                pricingRules: [],
                requiresFile: true,
                serviceType: 'print',
                isActive: true
            },
            {
                name: 'PVC Board',
                description: 'PVC board printing for durable indoor signage.',
                category: 'Large Format', subCategory: 'Boards',
                type: 'dimension',
                unitType: 'per_sqft',
                basePrice: 30,
                minPrice: 180,
                image: 'https://images.unsplash.com/photo-1616052848529-65fc065f4e15',
                options: { width: true, height: true, size: ['2x2 ft', '3x3 ft'] },
                pricingRules: [],
                requiresFile: true,
                serviceType: 'print',
                isActive: true
            },
            {
                name: 'Window Decal',
                description: 'Clear window decals for glass branding and displays.',
                category: 'Large Format', subCategory: 'Decals',
                type: 'dimension',
                unitType: 'per_sqft',
                basePrice: 18,
                minPrice: 90,
                image: 'https://images.unsplash.com/photo-1616052848529-65fc065f4e15',
                options: { width: true, height: true, size: ['1x3 ft', '2x4 ft'] },
                pricingRules: [],
                requiresFile: true,
                serviceType: 'print',
                isActive: true
            },
            {
                name: 'Hoarding Panel',
                description: 'Large hoarding prints for billboards and exhibition displays.',
                category: 'Large Format', subCategory: 'Hoardings',
                type: 'dimension',
                unitType: 'per_sqft',
                basePrice: 28,
                minPrice: 220,
                image: 'https://images.unsplash.com/photo-1616052848529-65fc065f4e15',
                options: { width: true, height: true, size: ['4x8 ft', '5x10 ft'] },
                pricingRules: [],
                requiresFile: true,
                serviceType: 'print',
                isActive: true
            },
            {
                name: 'Shop Fascia Board',
                description: 'High-quality fascia board prints for storefront branding.',
                category: 'Large Format', subCategory: 'Signage',
                type: 'dimension',
                unitType: 'per_sqft',
                basePrice: 24,
                minPrice: 190,
                image: 'https://images.unsplash.com/photo-1616052848529-65fc065f4e15',
                options: { width: true, height: true, size: ['2x6 ft', '3x8 ft'] },
                pricingRules: [],
                requiresFile: true,
                serviceType: 'print',
                isActive: true
            },

            // Shape products
            {
                name: 'Round Stickers',
                description: 'Premium round stickers available in multiple sizes.',
                category: 'Stickers & Labels', subCategory: 'Shapes',
                type: 'shape',
                unitType: 'per_piece',
                basePrice: 1.5,
                image: 'https://images.unsplash.com/photo-1622557850711-2fa318cf1b37',
                options: { shape: ['Round', 'Square', 'Oval'], quantity: [100, 500, 1000] },
                pricingRules: [
                    { condition: { quantity: { $gte: 1000 } }, price: 0.9 },
                    { condition: { quantity: { $gte: 500 } }, price: 1.0 }
                ],
                requiresFile: true,
                serviceType: 'design+print',
                isActive: true
            },
            {
                name: 'Die-cut Stickers',
                description: 'Custom die-cut stickers for branding and packaging.',
                category: 'Stickers & Labels', subCategory: 'Shapes',
                type: 'shape',
                unitType: 'per_piece',
                basePrice: 1.6,
                image: 'https://images.unsplash.com/photo-1622557850711-2fa318cf1b37',
                options: { shape: ['Die-cut', 'Custom'], quantity: [100, 500, 1000] },
                pricingRules: [
                    { condition: { quantity: { $gte: 1000 } }, price: 0.95 }
                ],
                requiresFile: true,
                serviceType: 'design+print',
                isActive: true
            },
            {
                name: 'Vinyl Labels',
                description: 'Durable vinyl labels with water-resistant print.',
                category: 'Stickers & Labels', subCategory: 'Shapes',
                type: 'shape',
                unitType: 'per_piece',
                basePrice: 1.8,
                image: 'https://images.unsplash.com/photo-1622557850711-2fa318cf1b37',
                options: { shape: ['Rectangle', 'Circle', 'Oval'], quantity: [200, 1000, 2000] },
                pricingRules: [
                    { condition: { quantity: { $gte: 2000 } }, price: 0.7 }
                ],
                requiresFile: true,
                serviceType: 'print',
                isActive: true
            },
            {
                name: 'Circle Coasters',
                description: 'Round coasters printed for cafes and corporate gifting.',
                category: 'Stickers & Labels', subCategory: 'Shapes',
                type: 'shape',
                unitType: 'per_piece',
                basePrice: 25,
                image: 'https://images.unsplash.com/photo-1622557850711-2fa318cf1b37',
                options: { shape: ['Circle', 'Square'], quantity: [50, 100, 250] },
                pricingRules: [
                    { condition: { quantity: { $gte: 250 } }, price: 18 }
                ],
                requiresFile: false,
                serviceType: 'design+print',
                isActive: true
            },
            {
                name: 'Product Tags',
                description: 'Custom product tags with optional die-cut shapes.',
                category: 'Stickers & Labels', subCategory: 'Shapes',
                type: 'shape',
                unitType: 'per_piece',
                basePrice: 2.5,
                image: 'https://images.unsplash.com/photo-1622557850711-2fa318cf1b37',
                options: { shape: ['Rectangle', 'Round', 'Custom'], quantity: [200, 500, 1000] },
                pricingRules: [
                    { condition: { quantity: { $gte: 1000 } }, price: 1.2 }
                ],
                requiresFile: true,
                serviceType: 'design+print',
                isActive: true
            },

            // Custom products
            {
                name: 'Custom Packaging Boxes',
                description: 'Custom-sized packaging boxes with material-specific pricing.',
                category: 'Packaging', subCategory: 'Custom',
                type: 'custom',
                unitType: 'per_piece',
                basePrice: 20,
                minPrice: 100,
                image: 'https://images.unsplash.com/photo-1607344646736-218205efc8d9',
                options: { width: true, height: true, length: true, material: ['Kraft', 'White', 'Premium'] },
                pricingRules: [
                    { condition: { material: 'Premium' }, price: 28 }
                ],
                requiresFile: true,
                serviceType: 'design+print',
                isActive: true
            },
            {
                name: 'Gift Boxes',
                description: 'Premium gift boxes designed to match your branding.',
                category: 'Packaging', subCategory: 'Custom',
                type: 'custom',
                unitType: 'per_piece',
                basePrice: 25,
                minPrice: 140,
                image: 'https://images.unsplash.com/photo-1607344646736-218205efc8d9',
                options: { width: true, height: true, length: true, material: ['Matte', 'Glossy', 'Kraft'] },
                pricingRules: [
                    { condition: { material: 'Glossy' }, price: 32 }
                ],
                requiresFile: true,
                serviceType: 'design+print',
                isActive: true
            },
            {
                name: 'Mailer Pouches',
                description: 'Custom printed poly mailers for ecommerce orders.',
                category: 'Packaging', subCategory: 'Custom',
                type: 'custom',
                unitType: 'per_piece',
                basePrice: 18,
                minPrice: 90,
                image: 'https://images.unsplash.com/photo-1607344646736-218205efc8d9',
                options: { width: true, height: true, material: ['Plastic', 'Paper'] },
                pricingRules: [
                    { condition: { material: 'Plastic' }, price: 22 }
                ],
                requiresFile: true,
                serviceType: 'design+print',
                isActive: true
            },
            {
                name: 'Corrugated Parcel Boxes',
                description: 'Robust corrugated parcel boxes for heavier shipping needs.',
                category: 'Packaging', subCategory: 'Custom',
                type: 'custom',
                unitType: 'per_piece',
                basePrice: 22,
                minPrice: 130,
                image: 'https://images.unsplash.com/photo-1607344646736-218205efc8d9',
                options: { width: true, height: true, length: true, material: ['Corrugated', 'Kraft'] },
                pricingRules: [
                    { condition: { material: 'Corrugated' }, price: 30 }
                ],
                requiresFile: false,
                serviceType: 'design+print',
                isActive: true
            },
            {
                name: 'Custom Gift Wrap',
                description: 'Printed gift wrap rolls available in custom dimensions.',
                category: 'Packaging', subCategory: 'Custom',
                type: 'custom',
                unitType: 'per_piece',
                basePrice: 12,
                minPrice: 80,
                image: 'https://images.unsplash.com/photo-1607344646736-218205efc8d9',
                options: { width: true, height: true, material: ['Matte', 'Glossy'] },
                pricingRules: [
                    { condition: { material: 'Glossy' }, price: 16 }
                ],
                requiresFile: true,
                serviceType: 'design+print',
                isActive: true
            },

            // Hybrid products
            {
                name: 'A4 Poster',
                description: 'Poster with preset A4 pricing and custom size support.',
                category: 'Marketing Materials', subCategory: 'Posters',
                type: 'hybrid',
                unitType: 'per_piece',
                basePrice: 25,
                minPrice: 100,
                image: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc',
                options: { size: ['A4', 'A3', 'Custom'], width: true, height: true },
                pricingRules: [
                    { condition: { size: 'A4' }, price: 10 },
                    { condition: { size: 'A3' }, price: 20 }
                ],
                requiresFile: true,
                serviceType: 'design+print',
                isActive: true
            },
            {
                name: 'A3 Poster',
                description: 'Poster with preset A3 pricing and a custom print option.',
                category: 'Marketing Materials', subCategory: 'Posters',
                type: 'hybrid',
                unitType: 'per_piece',
                basePrice: 28,
                minPrice: 120,
                image: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc',
                options: { size: ['A4', 'A3', 'Custom'], width: true, height: true },
                pricingRules: [
                    { condition: { size: 'A4' }, price: 10 },
                    { condition: { size: 'A3' }, price: 20 }
                ],
                requiresFile: true,
                serviceType: 'design+print',
                isActive: true
            },
            {
                name: 'A2 Poster',
                description: 'Large A2 poster with fixed size pricing and custom production.',
                category: 'Marketing Materials', subCategory: 'Posters',
                type: 'hybrid',
                unitType: 'per_piece',
                basePrice: 30,
                minPrice: 150,
                image: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc',
                options: { size: ['A4', 'A3', 'A2', 'Custom'], width: true, height: true },
                pricingRules: [
                    { condition: { size: 'A4' }, price: 10 },
                    { condition: { size: 'A3' }, price: 20 },
                    { condition: { size: 'A2' }, price: 35 }
                ],
                requiresFile: true,
                serviceType: 'design+print',
                isActive: true
            },
            {
                name: 'Custom Wall Poster',
                description: 'Custom wall poster with preset sizes and manual dimension entry.',
                category: 'Marketing Materials', subCategory: 'Posters',
                type: 'hybrid',
                unitType: 'per_piece',
                basePrice: 32,
                minPrice: 160,
                image: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc',
                options: { size: ['A4', 'A3', 'Custom'], width: true, height: true },
                pricingRules: [
                    { condition: { size: 'A4' }, price: 10 },
                    { condition: { size: 'A3' }, price: 20 }
                ],
                requiresFile: true,
                serviceType: 'design+print',
                isActive: true
            },
            {
                name: 'Custom Photo Print',
                description: 'Photo prints with preset sizes or fully custom dimensions.',
                category: 'Marketing Materials', subCategory: 'Posters',
                type: 'hybrid',
                unitType: 'per_piece',
                basePrice: 22,
                minPrice: 120,
                image: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc',
                options: { size: ['A4', 'A3', 'Custom'], width: true, height: true },
                pricingRules: [
                    { condition: { size: 'A4' }, price: 12 },
                    { condition: { size: 'A3' }, price: 22 }
                ],
                requiresFile: true,
                serviceType: 'design+print',
                isActive: true
            }
        ];

        const processedSeedData = seedData.map(item => ({
            ...item,
            slug: item.slug || item.name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '')
        }));

        const createdProducts = await Product.insertMany(processedSeedData);
        res.json({ success: true, message: 'Comprehensive Products catalog seeded successfully!', count: createdProducts.length, data: createdProducts });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message, data: null });
    }
};

// DELETE /api/products/:id (admin)
const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);
        if (!product) return res.status(404).json({ success: false, message: 'Product not found', data: null });
        res.json({ success: true, message: 'Product deleted successfully', data: product });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message, data: null });
    }
};

module.exports = { getProducts, getProductsAdmin, getProductBySlug, createProduct, updateProduct, deleteProduct, seedProducts };
