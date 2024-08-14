const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
  const token = req.cookies.token;
  
  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    console.error("JWT Verification failed:", error);
    res.status(401).json({ message: 'Token is not valid' });
  }
};

module.exports = auth;
