const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    // Check if the user's role (from the JWT) is in the allowed list
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ 
        message: "Access Denied: You do not have permission for this action" 
      });
    }
    next();
  };
};

module.exports = { authorizeRoles };