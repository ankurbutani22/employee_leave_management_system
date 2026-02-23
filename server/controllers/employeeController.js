const Employee = require('../models/Employee')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const cloudinary = require('../config/cloudinary')
const streamifier = require('streamifier')

// 1. SIGNUP - Create new employee
const create = async (req, res) => {
  try {
    const { name, email, password } = req.body

    const existing = await Employee.findOne({ email })
    if (existing) return res.status(400).json({ success: false, message: 'Employee already exists' })

    const hash = await bcrypt.hash(password, 10)

    let avatarUrl = ''
    if (req.file) {
      const result = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: 'employees' },
          (error, result) => {
            if (result) resolve(result)
            else reject(error)
          }
        )
        streamifier.createReadStream(req.file.buffer).pipe(stream)
      })
      avatarUrl = result.secure_url
    }

    const employee = await Employee.create({
      name,
      email,
      password: hash,
      avatar: avatarUrl
    })

    res.status(201).json({
      success: true,
      message: "Registration successful! Please login."
    })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
}

// 2. LOGIN - Employee login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const employee = await Employee.findOne({ email });

    if (!employee) {
      return res.status(404).json({ success: false, message: 'Employee not found' });
    }

    const isMatch = await bcrypt.compare(password, employee.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { employeeId: employee._id },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.json({
      success: true,
      token,
      name: employee.name,
      email: employee.email,
      avatar: employee.avatar
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

// 3. LIST - Admin only
const list = async (req, res) => {
  try {
    const emps = await Employee.find().select('-password')
    res.json(emps)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

// 4. UPDATE PROFILE - Employee only
const updateProfile = async (req, res) => {
  try {
    const { employeeId } = req.user
    const { name } = req.body

    let employee = await Employee.findById(employeeId)
    if (!employee) return res.status(404).json({ message: 'Employee not found' })

    if (name) employee.name = name

    if (req.file) {
      const result = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: 'employees' },
          (error, result) => {
            if (result) resolve(result)
            else reject(error)
          }
        )
        streamifier.createReadStream(req.file.buffer).pipe(stream)
      })
      employee.avatar = result.secure_url
    }

    await employee.save()

    res.json({
      success: true,
      user: {
        name: employee.name,
        email: employee.email,
        avatar: employee.avatar
      }
    })

  } catch (err) {
    console.error(err)
    res.status(500).json({ message: err.message })
  }
}

// 5. REMOVE - Admin only
const remove = async (req, res) => {
  try {
    const { id } = req.params
    const deleted = await Employee.findByIdAndDelete(id)
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Employee not found' })
    }
    res.json({ success: true, message: 'Employee deleted successfully' })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
}

// Exports
module.exports = {
  create,
  login,
  list,
  updateProfile,
  remove
}

console.log('Employee Controller Loaded Successfully')