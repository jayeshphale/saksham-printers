// Simple in-memory cache middleware
const cache = {};

const cacheMiddleware = (duration = 60) => {
    return (req, res, next) => {
        if (req.method !== 'GET') {
            return next();
        }

        const key = req.originalUrl || req.url;
        
        // Check if cached and not expired
        if (cache[key] && cache[key].expires > Date.now()) {
            return res.json(cache[key].data);
        }

        // Store original res.json function
        const originalJson = res.json.bind(res);

        // Override res.json to cache the response
        res.json = function(data) {
            cache[key] = {
                data,
                expires: Date.now() + duration * 1000
            };
            return originalJson(data);
        };

        next();
    };
};

module.exports = cacheMiddleware;
