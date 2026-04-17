const { calculatePrice } = require('./utils/pricingEngine');

const runTests = () => {
    console.log("\n=== 🚀 DYNAMIC PRICING ENGINE TESTS ===\n");

    // Test 1: Quantity-based pricing
    console.log("🟢 1. Testing Quantity-Based Pricing (Pamphlets)");
    const pamphlets = {
        name: 'Promotional Pamphlets',
        basePrice: 2,
        unitType: 'per piece',
        pricingRules: [
            { condition: { quantity: { $gte: 5000 } }, price: 0.8 },
        ]
    };

    const cost1 = calculatePrice(pamphlets, {}, 1000); // Base price: 2 * 1000 = 2000
    const cost2 = calculatePrice(pamphlets, {}, 5000); // 5000+ rule applies: 0.8 * 5000 = 4000

    console.log(`-> Qty 1000: Expected 2000, Got ${cost1}  | [${cost1 === 2000 ? 'PASS' : 'FAIL'}]`);
    console.log(`-> Qty 5000: Expected 4000, Got ${cost2}  | [${cost2 === 4000 ? 'PASS' : 'FAIL'}]`);

    // Test 2: Area-based pricing (sq.ft)
    console.log("\n🟢 2. Testing Area-Based Pricing (Flex Banner)");
    const flexBanner = {
        name: 'Flex Banner',
        basePrice: 15,
        unitType: 'per sq.ft',
        pricingRules: [
            { condition: { size: '4x6 ft' }, price: 18 } // Premium finish rule 
        ]
    };

    const cost3 = calculatePrice(flexBanner, { size: '2x3 ft' }, 1); // 2*3 = 6 sqft * 15 = 90
    console.log(`-> Size 2x3 ft (Base), Qty 1: Expected 90, Got ${cost3}  | [${cost3 === 90 ? 'PASS' : 'FAIL'}]`);

    // Applying rule: size="4x6 ft" triggers rule (price changes from 15 to 18 per sq ft)
    // sqft = 4*6 = 24. 24 sqft * 18 = 432. Qty = 2. 432*2 = 864
    const cost4 = calculatePrice(flexBanner, { size: '4x6 ft' }, 2);
    console.log(`-> Size 4x6 ft (Premium Rule), Qty 2: Expected 864, Got ${cost4}  | [${cost4 === 864 ? 'PASS' : 'FAIL'}]`);

    console.log("\n=== ✅ ALL TESTS COMPLETED SUCCESSFULLY ===");
};

runTests();
