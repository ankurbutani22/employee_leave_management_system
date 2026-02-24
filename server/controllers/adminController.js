// adminController.js
const Admin = require('../models/Admin')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')


// ખાતરી કરો કે અહીં exports.register લખેલું છે
exports.register = async (req, res) => {
  try {
    // તમારો રજીસ્ટર કોડ...
    res.json({ message: "Admin registered" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.login = async (req, res) => {
 try {
    const { email, password } = req.body
    const admin = await Admin.findOne({ email })
    if (!admin) return res.status(400).json({ message: 'Invalid' })
    
    const ok = await bcrypt.compare(password, admin.password)
    if (!ok) return res.status(400).json({ message: 'Invalid' })

    // અહીં સુધારો કરો: 'role: admin' ઉમેરો
    const token = jwt.sign(
      { 
        adminId: admin._id, 
        email: admin.email,
        role: 'admin' // <--- આ લાઈન ઉમેરવી ખૂબ જરૂરી છે
      }, 
      process.env.JWT_SECRET, 
      { expiresIn: '7d' }
    )

    res.json({ token })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}