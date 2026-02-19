require('dotenv').config()
const express = require('express')
const cors = require('cors')
const connectDB = require('./config/mongodb')

const adminRoutes = require('./routes/adminRoutes')
const employeeRoutes = require('./routes/employeeRoutes')
const leaveRoutes = require('./routes/leaveRoutes')

const app = express()
app.use(cors())
app.use(express.json())

connectDB()

app.use('/api/admin', adminRoutes)
app.use('/api/employees', employeeRoutes)
app.use('/api/leaves', leaveRoutes)

app.get('/', (req, res) => res.send('Admin backend running'))

const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
