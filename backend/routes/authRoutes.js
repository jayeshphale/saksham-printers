const express = require('express');
const router = express.Router();
const { loginAdmin, createInitialAdmin } = require('../controllers/authController');

router.post('/login', loginAdmin);
router.post('/seed', createInitialAdmin);

module.exports = router;
