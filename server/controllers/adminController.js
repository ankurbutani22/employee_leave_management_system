// adminController.js
const Admin = require('../models/Admin')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

// Register a new admin account.
exports.register = async (req, res) => {
  try {
    // Add your actual admin registration logic here.
    res.json({ message: "Admin registered" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Authenticate admin and return JWT token with admin role.
exports.login = async (req, res) => {
 try {
    const { email, password } = req.body
    const admin = await Admin.findOne({ email })
    if (!admin) return res.status(400).json({ message: 'Invalid' })
    
    const ok = await bcrypt.compare(password, admin.password)
    if (!ok) return res.status(400).json({ message: 'Invalid' })

    // Include role so admin-only middleware can authorize this token.
    const token = jwt.sign(
      { 
        adminId: admin._id, 
        email: admin.email,
        role: 'admin'
      }, 
      process.env.JWT_SECRET, 
      { expiresIn: '7d' }
    )

    res.json({ token })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}