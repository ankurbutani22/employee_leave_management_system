const mongoose = require('mongoose')
require('dotenv').config()
const Leave = require('./models/Leave')
const Employee = require('./models/Employee')
const bcrypt = require('bcryptjs')

// Seed one demo employee and one pending leave request for testing flows.
async function seedTestData() {
  try {
    await mongoose.connect(process.env.MONGO_URI)
    console.log('✓ MongoDB connected')

    // First, create test employee if not exists
    let employee = await Employee.findOne({ email: 'john@example.com' })
    if (!employee) {
      const hash = await bcrypt.hash('john@123', 10)
      employee = await Employee.create({
        name: 'John Doe',
        email: 'john@example.com',
        password: hash
      })
      console.log('✓ Test employee created:', employee._id)
    } else {
      console.log('✓ Test employee exists:', employee._id)
    }

    // Create a test leave request
    const leave = await Leave.create({
      employee: employee._id,
      startDate: new Date('2026-01-20'),
      endDate: new Date('2026-01-25'),
      days: 5,
      reason: 'Personal leave',
      status: 'pending'
    })

    console.log('\n✓ Leave Request Created!')
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log('Employee: John Doe (john@example.com)')
    console.log('Start Date: 01/20/2026')
    console.log('End Date: 01/25/2026')
    console.log('Days: 5')
    console.log('Reason: Personal leave')
    console.log('Status: pending')
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')

    console.log('\n📝 To view this leave:')
    console.log('1. Login with email: john@example.com')
    console.log('2. Password: john@123')
    console.log('3. Go to "Leave Status" to see your request')
    
    mongoose.disconnect()
  } catch (err) {
    console.error('❌ Error:', err.message)
    process.exit(1)
  }
}

seedTestData()
