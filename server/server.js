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

// Serve Admin Frontend
app.use('/admin', express.static(path.join(__dirname, '../admin/dist')))
app.get('/admin/*', (req, res) => {
    res.sendFile(path.join(__dirname, '../admin/dist/index.html'))
})

// Serve Employee Frontend (Root)
app.use(express.static(path.join(__dirname, '../employee/dist')))
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../employee/dist/index.html'))
})

const PORT = process.env.PORT || 7000
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`)
    console.log(`Admin Panel: http://localhost:${PORT}/admin`)
    console.log(`Employee Portal: http://localhost:${PORT}/`)
})
