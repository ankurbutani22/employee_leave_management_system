const jwt = require('jsonwebtoken');

// યુઝર લોગીન છે કે નહીં તે ચેક કરવા માટે
exports.protect = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      if (!token || token === 'null' || token === 'undefined') {
        return res.status(401).json({ message: 'Token is missing or null' });
      }
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'greatstack');
      req.user = decoded;
      return next();
    } catch (error) {
      console.error('JWT Verification Error:', error.message);
      return res.status(401).json({ message: 'Invalid or expired token (' + error.message + ')' });
    }
  }

  if (!token) {
    return res.status(401).json({ message: 'Authorization token not found' });
  }
};

// માત્ર એડમિન માટે
exports.adminOnly = (req, res, next) => {
  if (req.user && (req.user.isAdmin || req.user.role === 'admin')) {
    next();
  } else {
    res.status(403).json({ message: 'Admin access required' });
  }
}
