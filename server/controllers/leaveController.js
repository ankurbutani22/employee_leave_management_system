const Leave = require('../models/Leave')

// Create a leave request for the authenticated employee.
const create = async (req, res) => {
  try {
    const { startDate, endDate, days, reason } = req.body;

    // employeeId must come from validated JWT payload.
    if (!req.user || !req.user.employeeId) {
      return res.status(401).json({ message: 'User not authenticated properly' });
    }

    const leave = await Leave.create({
      employee: req.user.employeeId,
      startDate,
      endDate,
      days,
      reason
    });

    res.json(leave);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

// List all leave requests with basic employee info (admin use).
const list = async (req, res) => {
  try {
    const leaves = await Leave.find().populate('employee', 'name email')
    res.json(leaves)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

// Update leave status to approved, cancelled, or pending.
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

// Return leave history for the logged-in employee.
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

// Export leave controller handlers.
module.exports = { create, list, updateStatus, getStatus }