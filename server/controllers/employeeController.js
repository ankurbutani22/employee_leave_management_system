const Employee = require('../models/Employee')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const cloudinary = require('../config/cloudinary')
const streamifier = require('streamifier')
const Leave = require('../models/Leave')

// 1. SIGNUP - નવો કર્મચારી ઉમેરવા માટે
exports.create = async (req, res) => {
  try {
    const { name, email, password } = req.body

    // ઈમેઈલ પહેલેથી છે કે નહીં તે ચેક કરો
    const existing = await Employee.findOne({ email })
    if (existing) return res.status(400).json({ success: false, message: 'Employee already exists' })

    // પાસવર્ડ હેશ કરો
    const hash = await bcrypt.hash(password, 10)

    // ઈમેજ અપલોડ લોજિક (જો ફાઈલ હોય તો)
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

    // ડેટાબેઝમાં સેવ કરો
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

// 2. LOGIN - કર્મચારી લોગિન કરવા માટે
exports.login = async (req, res) => {
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
// બાકીના ફંક્શન (list, updateProfile) જે છે તે જ રહેશે...
exports.list = async (req, res) => {
  try {
    const emps = await Employee.find().select('-password')
    res.json(emps)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}



exports.updateProfile = async (req, res) => {
  try {
    const { employeeId } = req.user // Get ID from the logged-in token
    const { name } = req.body

    // 1. Find the employee
    let employee = await Employee.findById(employeeId)
    if (!employee) return res.status(404).json({ message: 'Employee not found' })

    // 2. Update Name if provided
    if (name) employee.name = name

    // 3. Update Avatar if a file is provided
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

    // 4. Save to Database
    await employee.save()

    // 5. Return updated info (excluding password)
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

exports.getProfile = async (req, res) => {
  try {
    const { employeeId } = req.user
    const employee = await Employee.findById(employeeId).select('-password')
    if (!employee) return res.status(404).json({ message: 'Employee not found' })
    res.json(employee)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}


exports.remove = async (req, res) => {
  try {
    const { id } = req.params

    // 1. Delete the Employee
    const employee = await Employee.findByIdAndDelete(id)
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' })
    }

    // 2. Delete all Leaves associated with this employee
    await Leave.deleteMany({ employee: id })

    res.json({ message: 'Employee and their leave history deleted successfully' })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}