const mongoose = require('mongoose')
require('dotenv').config()
const Admin = require('./models/Admin')
const bcrypt = require('bcryptjs')

// Seed default admin credentials if admin@example.com does not already exist.
async function seedAdmin() {
  try {
    await mongoose.connect(process.env.MONGO_URI)
    console.log('✓ MongoDB connected')

    // Check if admin already exists
    const existing = await Admin.findOne({ email: 'admin@example.com' })
    if (existing) {
      console.log('✓ Admin already exists')
      console.log('\nLogin Credentials:')
      console.log('Email: admin@example.com')
      console.log('Password: admin@123')
      mongoose.disconnect()
      return
    }

    // Create default admin
    const hash = await bcrypt.hash('admin@123', 10)
    const admin = await Admin.create({
      name: 'Admin User',
      email: 'admin@example.com',
      password: hash
    })

    console.log('✓ Admin created successfully!')
    console.log('\n📧 Login Credentials:')
    console.log('Email: admin@example.com')
    console.log('Password: admin@123')
    console.log('\nYou can now login at: http://localhost:5173/login')
    
    mongoose.disconnect()
  } catch (err) {
    console.error('❌ Error:', err.message)
    process.exit(1)
  }
}

seedAdmin()
