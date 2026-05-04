const express = require('express');
const router = express.Router();
const { generateProductDescription } = require('../controllers/aiController');

router.post('/description', generateProductDescription);

module.exports = router;
