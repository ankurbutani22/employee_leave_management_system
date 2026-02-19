const mongoose = require('mongoose')

const LeaveSchema = new mongoose.Schema({
  employee: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee', required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  days: { type: Number, required: true },
  reason: { type: String },
  status: { type: String, enum: ['pending', 'approved', 'cancelled'], default: 'pending' },
}, { timestamps: true })

module.exports = mongoose.model('Leave', LeaveSchema)
