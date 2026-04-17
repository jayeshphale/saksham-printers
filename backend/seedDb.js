const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Category = require('./models/Category');
const Product = require('./models/Product');

dotenv.config();

const seedCategories = [
    { name: 'Business Essentials', slug: 'business-essentials', image: '/images/Visiting%20Cards.jpeg' },
    { name: 'Marketing Materials', slug: 'marketing-materials', image: '/images/A4%20Flyers.jpeg' },
    { name: 'Banners & Large Format', slug: 'large-format', image: '/images/Frontlit%20Flex%20Banner.jpeg' },
    { name: 'Stickers & Labels', slug: 'stickers-labels', image: '/images/Product%20Labels.jpeg' },
    { name: 'Packaging', slug: 'packaging', image: '/images/Product%20Boxes.jpeg' },
    { name: 'Office & Corporate Printing', slug: 'corporate-printing', image: '/images/Notepads.jpeg' },
    { name: 'Signage & Boards', slug: 'signage-boards', image: '/images/Acrylic%20Boards.jpeg' }
];

const imageMap = {
    'Visiting Cards': '/images/Visiting%20Cards.jpeg',
    'Premium Visiting Cards': '/images/Premium%20Visiting%20Cards.jpeg',
    'Rounded Visiting Cards': '/images/Rounded%20Visiting%20Cards.jpeg',
    'Letterheads': '/images/Letterheads.jpeg',
    'Envelopes': '/images/Envelopes.jpeg',
    'ID Cards': '/images/ID%20Cards.jpeg',

    'A4 Flyers': '/images/A4%20Flyers.jpeg',
    'A5 Flyers': '/images/A5%20Flyers.jpeg',
    'Bi-Fold Brochures': '/images/Bi-Fold%20Brochures.jpeg',
    'Tri-Fold Brochures': '/images/Tri-Fold%20Brochures.jpeg',
    'A3 Posters': '/images/A3%20Posters.jpeg',
    'A2 Posters': '/images/A2%20Posters.jpeg',
    'Product Catalogs': '/images/Product%20Catalogs.jpeg',
    'Door Hangers': '/images/Door%20Hangers.jpeg',

    'Frontlit Flex Banner': '/images/Frontlit%20Flex%20Banner.jpeg',
    'Backlit Flex Banner': '/images/Backlit%20Flex%20Banner.jpeg',
    'Vinyl Printing': '/images/Vinyl%20Printing.jpeg',
    'One Way Vision': '/images/One%20Way%20Vision.jpeg',
    'Sunboard Printing': '/images/Sunboard%20Printing.jpeg',
    'Foam Board Printing': '/images/Foam%20Board%20Printing.jpeg',
    'Roll-up Standee': '/images/Roll-up%20Standee.jpeg',

    'Product Labels': '/images/Product%20Labels.jpeg',
    'Barcode Stickers': '/images/Barcode%20Stickers.jpeg',
    'QR Code Stickers': '/images/QR%20Code%20Stickers.jpeg',
    'Die-cut Stickers': '/images/Die-cut%20Stickers.jpeg',
    'Transparent Stickers': '/images/Transparent%20Stickers.jpeg',
    'Vinyl Stickers': '/images/Vinyl%20Stickers.jpeg',

    'Product Boxes': '/images/Product%20Boxes.jpeg',
    'Corrugated Boxes': '/images/Corrugated%20Boxes.jpeg',
    'Paper Bags': '/images/Paper%20Bags.jpeg',
    'Carry Bags': '/images/Carry%20Bags.jpeg',
    'Food Packaging': '/images/Food%20Packaging.jpeg',

    'Notepads': '/images/Notepads.jpeg',
    'Diaries': '/images/Diaries.jpeg',
    'Calendars': '/images/Calendars.jpeg',
    'Office Files': '/images/Office%20Files.jpeg',
    'Company Profiles': '/images/Company%20Profiles.jpeg',

    'Acrylic Boards': '/images/Acrylic%20Boards.jpeg',
    'LED Sign Boards': '/images/LED%20Sign%20Boards.jpeg',
    'Shop Boards': '/images/Shop%20Boards.jpeg',
    'Name Plates': '/images/Name%20Plates.jpeg',
    'Direction Boards': '/images/Direction%20Boards.jpeg'
};

const generateProducts = () => {
    let products = [];

    // 1. Business Essentials (6 products)
    const essentials = ['Visiting Cards', 'Premium Visiting Cards', 'Rounded Visiting Cards', 'Letterheads', 'Envelopes', 'ID Cards'];
    essentials.forEach(name => {
        products.push({
            name,
            category: 'Business Essentials',
            subCategory: 'Cards & Stationery',
            basePrice: name.includes('Premium') ? 10 : (name.includes('ID') ? 150 : 5),
            unitType: name.includes('ID') ? 'per piece' : 'per piece',
            description: `Professional ${name.toLowerCase()} for your business.`,
            image: imageMap[name],
            options: { quantity: [100, 500, 1000], finish: ['Matte', 'Glossy'], paperType: ['300gsm', '350gsm'] },
            pricingRules: [{ condition: { quantity: { $gte: 1000 } }, price: 2 }],
            isActive: true
        });
    });

    // 2. Marketing Materials (8 products)
    const marketing = ['A4 Flyers', 'A5 Flyers', 'Bi-Fold Brochures', 'Tri-Fold Brochures', 'A3 Posters', 'A2 Posters', 'Product Catalogs', 'Door Hangers'];
    marketing.forEach(name => {
        products.push({
            name,
            category: 'Marketing Materials',
            subCategory: name.includes('Brochure') ? 'Brochures' : (name.includes('Poster') ? 'Posters' : 'Flyers'),
            basePrice: name.includes('Brochure') ? 15 : 3,
            unitType: 'per piece',
            description: `High-quality printed ${name.toLowerCase()} for marketing campaigns.`,
            image: imageMap[name],
            options: { quantity: [500, 1000, 5000], paperType: ['100gsm Glossy', '130gsm Matte'] },
            pricingRules: [{ condition: { quantity: { $gte: 5000 } }, price: 1.5 }],
            isActive: true
        });
    });

    // 3. Banners & Large Format (7 products)
    const largeFormat = ['Frontlit Flex Banner', 'Backlit Flex Banner', 'Vinyl Printing', 'One Way Vision', 'Sunboard Printing', 'Foam Board Printing', 'Roll-up Standee'];
    largeFormat.forEach(name => {
        products.push({
            name,
            category: 'Banners & Large Format',
            subCategory: name.includes('Standee') ? 'Standees' : (name.includes('Board') ? 'Boards' : 'Banners'),
            basePrice: name.includes('Standee') ? 1200 : 15,
            unitType: name.includes('Standee') ? 'per piece' : 'per sq.ft',
            description: `Durable ${name.toLowerCase()} for outdoor and indoor advertising.`,
            image: imageMap[name],
            options: { size: ['2x3 ft', '3x4 ft', '4x6 ft'] },
            pricingRules: [{ condition: { size: '4x6 ft' }, price: name.includes('Standee') ? 1500 : 18 }],
            isActive: true
        });
    });

    // 4. Stickers & Labels (6 products)
    const stickers = ['Product Labels', 'Barcode Stickers', 'QR Code Stickers', 'Die-cut Stickers', 'Transparent Stickers', 'Vinyl Stickers'];
    stickers.forEach(name => {
        products.push({
            name,
            category: 'Stickers & Labels',
            subCategory: 'Labels',
            basePrice: 2,
            unitType: 'per piece',
            description: `Adhesive ${name.toLowerCase()} on premium material.`,
            image: imageMap[name],
            options: { quantity: [1000, 5000, 10000], material: ['Paper', 'Vinyl'] },
            pricingRules: [{ condition: { quantity: { $gte: 10000 } }, price: 0.8 }],
            isActive: true
        });
    });

    // 5. Packaging (5 products)
    const packaging = ['Product Boxes', 'Corrugated Boxes', 'Paper Bags', 'Carry Bags', 'Food Packaging'];
    packaging.forEach(name => {
        products.push({
            name,
            category: 'Packaging',
            subCategory: name.includes('Bag') ? 'Bags' : 'Boxes',
            basePrice: name.includes('Corrugated') ? 25 : 15,
            unitType: 'per piece',
            description: `Custom branded ${name.toLowerCase()} for retail.`,
            image: imageMap[name],
            options: { quantity: [100, 500, 1000], size: ['Small', 'Medium', 'Large'] },
            pricingRules: [{ condition: { quantity: { $gte: 1000 } }, price: 10 }],
            isActive: true
        });
    });

    // 6. Office & Corporate Printing (5 products)
    const corporate = ['Notepads', 'Diaries', 'Calendars', 'Office Files', 'Company Profiles'];
    corporate.forEach(name => {
        products.push({
            name,
            category: 'Office & Corporate Printing',
            subCategory: 'Office',
            basePrice: name.includes('Diaries') ? 250 : 50,
            unitType: 'per piece',
            description: `Corporate branded ${name.toLowerCase()}.`,
            image: imageMap[name],
            options: { quantity: [50, 100, 500] },
            pricingRules: [{ condition: { quantity: { $gte: 500 } }, price: 40 }],
            isActive: true
        });
    });

    // 7. Signage & Boards (5 products)
    const signage = ['Acrylic Boards', 'LED Sign Boards', 'Shop Boards', 'Name Plates', 'Direction Boards'];
    signage.forEach(name => {
        products.push({
            name,
            category: 'Signage & Boards',
            subCategory: 'Signage',
            basePrice: name.includes('LED') ? 5000 : 800,
            unitType: 'per piece',
            description: `Premium ${name.toLowerCase()} for stores and offices.`,
            image: imageMap[name],
            options: { size: ['1x2 ft', '2x4 ft', '3x6 ft'] },
            pricingRules: [],
            isActive: true
        });
    });

    return products;
};

const runSeeder = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB connected for seeding...');

        await Category.deleteMany();
        await Product.deleteMany();

        // Ensure slugs are mapped automatically for products (which pre-validate handles mostly, but just to be safe for bulk insert)
        const categories = await Category.insertMany(seedCategories);
        console.log(`${categories.length} Categories seeded!`);

        const rawProducts = generateProducts();
        const processedProducts = rawProducts.map(p => ({
            ...p,
            slug: p.name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '')
        }));

        const products = await Product.insertMany(processedProducts);
        console.log(`${products.length} Products seeded!`);

        console.log('Database successfully scaled with 40+ products!');
        process.exit();
    } catch (error) {
        console.error('Seeding failed:', error);
        process.exit(1);
    }
};

runSeeder();
