require('dotenv').config()
const express = require('express')
const cors = require('cors')
const path = require('path')
const connectDB = require('./config/mongodb')

const adminRoutes = require('./routes/adminRoutes')
const employeeRoutes = require('./routes/employeeRoutes')
const leaveRoutes = require('./routes/leaveRoutes')

const app = express()
app.use(cors())
app.use(express.json())

connectDB()

// API Routes
app.use('/api/admin', adminRoutes)
app.use('/api/employees', employeeRoutes)
app.use('/api/leaves', leaveRoutes)

// Health Check
app.get('/health', (req, res) => res.status(200).send('OK'))

// Serve Admin Frontend
const adminPath = path.resolve(__dirname, '../admin/dist')
app.use('/admin', express.static(adminPath))
app.get('/admin/*', (req, res) => {
    res.sendFile(path.join(adminPath, 'index.html'))
})

// Serve Employee Frontend (Root)
const employeePath = path.resolve(__dirname, '../employee/dist')
app.use(express.static(employeePath))
app.get('*', (req, res) => {
    res.sendFile(path.join(employeePath, 'index.html'))
})

console.log('Admin Static Path:', adminPath)
console.log('Employee Static Path:', employeePath)

const PORT = process.env.PORT || 7000
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`)
    console.log(`Admin Panel: http://localhost:${PORT}/admin`)
    console.log(`Employee Portal: http://localhost:${PORT}/`)
})
