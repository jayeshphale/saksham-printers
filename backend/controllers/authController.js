const Admin = require('../models/Admin');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};

const loginAdmin = async (req, res) => {
    try {
        const { email, password } = req.body;

        const admin = await Admin.findOne({ email });

        if (admin && (await bcrypt.compare(password, admin.password))) {
            res.json({
                success: true,
                data: {
                    _id: admin._id,
                    email: admin.email,
                    token: generateToken(admin._id),
                }
            });
        } else {
            res.status(401).json({ success: false, message: 'Invalid email or password' });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const createInitialAdmin = async (req, res) => {
    try {
        // Only allow if no admin exists
        const adminCount = await Admin.countDocuments();
        if (adminCount > 0) {
            return res.status(400).json({ success: false, message: 'Admin already exists' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('admin123', salt);

        const admin = await Admin.create({
            email: 'admin@printingpress.com',
            password: hashedPassword
        });

        res.json({ success: true, message: 'Admin created', data: { email: admin.email } });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = { loginAdmin, createInitialAdmin };
