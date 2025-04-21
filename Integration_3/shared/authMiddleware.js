//shared/authMiddleware.js
const jwt = require('jsonwebtoken');

const JWT_SECRET = 'your-super-secret-key-change-this-in-production';

const authMiddleware = (req, res, next) => {
  //Get token from cookies
  const token = req.cookies.auth_token;
  
  // Check if it's an API request (based on path)
  const isApiRequest = req.path.startsWith('/api') || req.path.startsWith('/certificates');
  
  if (!token) {
    if (isApiRequest) {
      return res.status(401).json({ message: 'Authentication required' });
    } else {
      // For browser requests, redirect to login
      return res.redirect('http://localhost:3001/login.html');
    }
  }

  try {
    //Verify token
    const decoded = jwt.verify(token, JWT_SECRET);
    
    //Attach user info to request
    req.user = decoded;
    
    next();
  } catch (error) {
    if (isApiRequest) {
      return res.status(401).json({ message: 'Invalid token' });
    } else {
      // For browser requests, redirect to login
      return res.redirect('http://localhost:3001/login.html');
    }
  }
};

module.exports = { 
  authMiddleware,
  JWT_SECRET 
};