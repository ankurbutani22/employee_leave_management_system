const express = require('express');
const router = express.Router();
const leaveController = require('../controllers/leaveController');
const { protect } = require('../middleware/authMiddleware');
// Keep getStatus handler name exact to avoid route/controller mismatch.
router.get('/', protect, leaveController.list);
router.post('/', protect, leaveController.create);
router.get('/leave-status', protect, leaveController.getStatus);
router.patch('/:id/status', protect, leaveController.updateStatus);

module.exports = router;