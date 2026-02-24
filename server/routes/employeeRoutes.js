// server/routes/employeeRoutes.js
const express = require('express')
const router = express.Router()
const empCtrl = require('../controllers/employeeController')
const authAdmin = require('../middleware/authAdmin')
const authEmployee = require('../middleware/authEmployee') // <--- Make sure this is imported
const upload = require('../middleware/multer')

// Existing routes...
router.post('/', upload.single('image'), empCtrl.create)
router.get('/', authAdmin, empCtrl.list)
router.post('/login', empCtrl.login)

router.get('/profile', authEmployee, empCtrl.getProfile)
router.put('/profile', authEmployee, upload.single('image'), empCtrl.updateProfile)
router.delete('/:id', authAdmin, empCtrl.remove)


module.exports = router