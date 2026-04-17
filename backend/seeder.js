const http = require('http');

function makeReq(path) {
    return new Promise((resolve, reject) => {
        const req = http.request({
            hostname: 'localhost',
            port: 5000,
            path: path,
            method: 'POST'
        }, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => resolve({statusCode: res.statusCode, data}));
        });
        req.on('error', reject);
        req.end();
    });
}

async function run() {
    try {
        console.log("Seeding Products...");
        const pRes = await makeReq('/api/products/seed');
        console.log("Products Result:", pRes);

        console.log("Seeding Admin...");
        const aRes = await makeReq('/api/admin/seed');
        console.log("Admin Result:", aRes);
    } catch (err) {
        console.error("Error:", err);
    }
}
run();
