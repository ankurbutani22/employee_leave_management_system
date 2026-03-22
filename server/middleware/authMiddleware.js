const jwt = require('jsonwebtoken');

// Validate JWT and attach decoded user payload to req.user.
exports.protect = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
      req.user = decoded;
      next();
    } catch (error) {
      res.status(401).json({ message: 'near token not found ' });
    }
  }
  if (!token) {
    res.status(401).json({ message: 'token not found ' });
  }
};

// Allow access only when authenticated user has admin role.
exports.adminOnly = (req, res, next) => {
 if (req.user && req.user.role === 'admin') { // <--- Checks for 'role'
   next();
}
 
else {
    res.status(403).json({ message: 'not a show a stutes' });
  }
}