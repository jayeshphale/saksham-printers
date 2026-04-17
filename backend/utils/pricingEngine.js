/**
 * Dynamic Pricing Engine
 * Calculates the exact price of an order based on product type behavior,
 * selected options, and bulk or dimension pricing rules.
 */

const parseNumber = (value) => {
    if (value === undefined || value === null || value === '') return 0;
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : 0;
};

const parseSizeString = (size = '') => {
    const match = String(size).match(/(\d+(?:\.\d+)?)\s*x\s*(\d+(?:\.\d+)?)(?:\s*x\s*(\d+(?:\.\d+)?))?/i);
    if (!match) return { width: 0, height: 0, length: 0 };
    return {
        width: parseFloat(match[1]),
        height: parseFloat(match[2]),
        length: match[3] ? parseFloat(match[3]) : 0
    };
};

const getMaterialMultiplier = (material) => {
    if (!material) return 1;
    const normalized = String(material).toLowerCase();
    if (normalized.includes('vinyl')) return 1.4;
    if (normalized.includes('corrugated')) return 1.6;
    if (normalized.includes('kraft')) return 1.35;
    if (normalized.includes('paper')) return 1.1;
    if (normalized.includes('premium')) return 1.5;
    return 1;
};

const evaluateCondition = (condition, selectedOptions) => {
    for (const key in condition) {
        const expected = condition[key];
        const actual = selectedOptions[key];

        if (typeof expected === 'object' && expected !== null) {
            if (expected.$gte !== undefined && !(actual >= expected.$gte)) return false;
            if (expected.$lte !== undefined && !(actual <= expected.$lte)) return false;
            if (expected.$gt !== undefined && !(actual > expected.$gt)) return false;
            if (expected.$lt !== undefined && !(actual < expected.$lt)) return false;
            if (expected.$in !== undefined && !expected.$in.includes(actual)) return false;
        } else {
            if (actual !== expected) return false;
        }
    }
    return true;
};

const findMatchedPrice = (product, selectedOptions, quantity) => {
    let matchedPrice = product.basePrice;
    if (!product.pricingRules || !product.pricingRules.length) return matchedPrice;

    for (const rule of product.pricingRules) {
        const evalState = { ...selectedOptions, quantity };
        if (evaluateCondition(rule.condition, evalState)) {
            matchedPrice = rule.price;
        }
    }

    return matchedPrice;
};

const calcDimensions = (selectedOptions) => {
    const width = parseNumber(selectedOptions.width);
    const height = parseNumber(selectedOptions.height);
    const length = parseNumber(selectedOptions.length);
    let sizeWidth = width;
    let sizeHeight = height;
    let sizeLength = length;

    if ((!width || !height) && selectedOptions.size) {
        const parsed = parseSizeString(selectedOptions.size);
        sizeWidth = sizeWidth || parsed.width;
        sizeHeight = sizeHeight || parsed.height;
        sizeLength = sizeLength || parsed.length;
    }

    const area = Math.ceil(Math.max(1, sizeWidth * sizeHeight));
    const volume = Math.ceil(Math.max(1, sizeWidth * sizeHeight * (sizeLength || 1)));

    return { width: sizeWidth, height: sizeHeight, length: sizeLength, area, volume };
};

const calculatePrice = (product, selectedOptions = {}, quantity = 1) => {
    quantity = Math.max(1, Number(quantity) || 1);
    const normalizedOptions = {
        ...selectedOptions,
        size: selectedOptions.size ?? '',
        material: selectedOptions.material ?? '',
        shape: selectedOptions.shape ?? ''
    };

    const dimensions = calcDimensions(normalizedOptions);
    const materialMultiplier = getMaterialMultiplier(normalizedOptions.material);
    const rate = findMatchedPrice(product, normalizedOptions, quantity);

    let total = 0;

    switch (product.type) {
        case 'fixed': {
            const unitPrice = rate;
            total = unitPrice * quantity;
            break;
        }
        case 'dimension': {
            const area = dimensions.area;
            total = area * rate * quantity;
            if (product.minPrice && total < product.minPrice) {
                total = product.minPrice * quantity;
            }
            break;
        }
        case 'shape': {
            const unitPrice = rate;
            total = unitPrice * quantity;
            break;
        }
        case 'custom': {
            const volumeFactor = dimensions.volume > 1 ? dimensions.volume : dimensions.area;
            const normalizedFactor = Math.max(1, Math.ceil(volumeFactor / 100));
            total = rate * normalizedFactor * quantity * materialMultiplier;
            if (product.minPrice && total < product.minPrice) {
                total = product.minPrice * quantity;
            }
            break;
        }
        case 'hybrid': {
            const selectedSize = normalizedOptions.size;
            if (selectedSize && String(selectedSize).toLowerCase().includes('custom')) {
                const area = dimensions.area;
                total = area * rate * quantity * materialMultiplier;
                if (product.minPrice && total < product.minPrice) total = product.minPrice * quantity;
            } else {
                const unitPrice = rate;
                total = unitPrice * quantity;
            }
            break;
        }
        default: {
            total = rate * quantity;
            break;
        }
    }

    return Math.max(0, Math.round(total));
};

const calculateDeliveryCharge = (orderValue, deliveryType = 'Home Delivery') => {
    if (String(deliveryType).toLowerCase() !== 'home delivery') return 0;
    if (orderValue >= 2000) return 0;
    if (orderValue >= 500) return 30;
    return 50;
};

module.exports = {
    calculatePrice,
    evaluateCondition,
    calculateDeliveryCharge
};

