const jwt = require('jsonwebtoken')

// Allow only requests with a valid employee JWT in Authorization header.
module.exports = function (req, res, next) {
  const auth = req.headers.authorization
  if (!auth || !auth.startsWith('Bearer ')) return res.status(401).json({ message: 'No token' })
  const token = auth.split(' ')[1]
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET)
    if (!payload.employeeId) return res.status(403).json({ message: 'Employee only' })
    req.user = payload
    next()
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token' })
  }
}
