const Leave = require('../models/Leave')

// 1. Create Leave
// 1. Create Leave (Updated)
const create = async (req, res) => {
  try {
    // અહીં આપણે req.body માંથી employeeId લેતા નથી
    const { startDate, endDate, days, reason } = req.body;

    // આપણે Token માંથી employeeId લઈએ છીએ (જે protect middleware એ સેટ કર્યું હોય)
    // જો req.user ન હોય તો એરર આપો
    if (!req.user || !req.user.employeeId) {
      return res.status(401).json({ message: 'User not authenticated properly' });
    }

    const leave = await Leave.create({
      employee: req.user.employeeId, // <--- આ ઓટોમેટિક ID લેશે
      startDate,
      endDate,
      days,
      reason
    });

    res.json(leave);
  } catch (err) {
    console.error(err); // ટર્મિનલમાં એરર જોવા માટે
    res.status(500).json({ message: err.message });
  }
};

// 2. List Leaves (Admin)
const list = async (req, res) => {
  try {
    const leaves = await Leave.find().populate('employee', 'name email')
    res.json(leaves)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

// 3. Update Status (Admin)
const updateStatus = async (req, res) => {
  try {
    const { id } = req.params
    const { status } = req.body
    const allowed = ['approved', 'cancelled', 'pending']
    if (!allowed.includes(status)) return res.status(400).json({ message: 'Invalid status' })
    const leave = await Leave.findByIdAndUpdate(id, { status }, { new: true })
    res.json(leave)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

// 4. Get Status (Employee) - આ ફંક્શનમાં જ પ્રોબ્લેમ હતો
const getStatus = async (req, res) => {
  try {
    if (!req.user || !req.user.employeeId) {
      return res.status(400).json({ message: 'User ID not found in token' })
    }
    const leaves = await Leave.find({ employee: req.user.employeeId })
    res.json(leaves)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

// બધું એકસાથે એક્સપોર્ટ કરો (આનાથી એરર જતી રહેશે)
module.exports = { create, list, updateStatus, getStatus }