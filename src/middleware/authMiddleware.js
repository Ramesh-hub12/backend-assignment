// const jwt = require("jsonwebtoken");

// const verifyToken = (req, res, next) => {
//   // Extract token from the "Authorization" header
//   const authHeader = req.headers["authorization"];
//   const token = authHeader && authHeader.split(" ")[1]; // Bearer <token>

//   if (!token) {
//     return res.status(401).json({ message: "Access Denied: No token provided" });
//   }

//   try {
//     // Verify the token using your secret key
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
//     // Attach user info (id, role) to the request object
//     req.user = decoded; 
//     next(); // Proceed to the next function
//   } catch (err) {
//     res.status(401).json({ message: "Invalid or expired token" });
//   }
// };

// module.exports = { verifyToken };

const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.protect = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) return res.status(401).json({ message: 'Not authorized' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select('-password');
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Token invalid' });
  }
};

exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Permission denied' });
    }
    next();
  };
};