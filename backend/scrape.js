const axios = require('axios');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product');
dotenv.config();

async function getImageUrl(query) {
    try {
        // Bing search for Creative Commons images matching our exact print products
        const url = `https://www.bing.com/images/search?q=${encodeURIComponent(query + " print product")}&qft=+filterui:license-L2_L3_L4_L5_L6_L7`;
        const res = await axios.get(url, {
            headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36"
            }
        });

        // Bing injects data inside `murl&quot;:&quot;...&quot;` in raw HTML
        const match = res.data.match(/murl&quot;:&quot;(https?:?[^&]+?)&quot;/i);
        if (match && match[1]) {
            return match[1];
        }

        // Fallback to Yahoo if bing yields nothing
        const yahooUrl = `https://images.search.yahoo.com/search/images?p=${encodeURIComponent(query + " mockup")}`;
        const yahooRes = await axios.get(yahooUrl, {
            headers: { "User-Agent": "Mozilla/5.0" }
        });
        const yMatch = yahooRes.data.match(/imgurl=([^&]+)&/);
        if (yMatch && yMatch[1]) return decodeURIComponent(yMatch[1]);

    } catch (e) {
        console.error("Error fetching:", e.message);
    }
    return null;
}

async function run() {
    await mongoose.connect(process.env.MONGO_URI);
    const products = await Product.find();
    let updated = 0;

    console.log(`Starting dynamic scrape for ${products.length} products...`);
    for (let p of products) {
        process.stdout.write(`Fetching -> [${p.name}]: `);
        const img = await getImageUrl(p.name);
        if (img) {
            console.log(`OK`);
            p.image = img;
            await p.save();
            updated++;
        } else {
            console.log("FAILED (Keeping original fallback)");
        }

        // Add a slight delay to prevent IP block
        await new Promise(r => setTimeout(r, 600));
    }

    console.log(`\nSuccessfully linked ${updated} specific copyright-free images!`);
    process.exit();
}

run();
