//auth-service/server.js
const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const path = require('path');
const { JWT_SECRET } = require('../shared/authMiddleware');

const app = express();
const PORT = 3001;

//Middleware
app.use(express.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//Configure CORS to allow credentials
app.use(cors({
  origin: [
    'http://localhost:3002', 
    'http://localhost:3003',
    'http://localhost:3004',
    'http://localhost:3005',
    'http://localhost:3006',
    'http://localhost:3007', // Interactive Tutorials
    'http://localhost:3008'  // Certificate Service
  ],
  credentials: true
}));

// Root route - redirect to login
app.get('/', (req, res) => {
  res.redirect('/login.html');
});

//Hardcoded user for now, need to connect to a DB
const users = [
  { id: 1, email: 'user@example.com', password: 'password123' }
];

//Login route
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  
  //Find user
  const user = users.find(u => u.email === email && u.password === password);
  if (!user) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }
  
  //Create token
  const token = jwt.sign(
    { id: user.id, email: user.email },
    JWT_SECRET,
    { expiresIn: '1h' }
  );
  
  //Set token as HttpOnly cookie
  res.cookie('auth_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production', //Use secure in production
    sameSite: 'lax', 
    maxAge: 3600000 //1 hour
  });
  
  res.json({ success: true, message: 'Login successful' });
});

//Logout route
app.post('/api/auth/logout', (req, res) => {
  res.clearCookie('auth_token');
  res.json({ success: true, message: 'Logout successful' });
});

//User info route (protected)
app.get('/api/auth/user', (req, res) => {
  const token = req.cookies.auth_token;
  
  if (!token) {
    return res.status(401).json({ authenticated: false });
  }
  
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    res.json({ 
      authenticated: true, 
      user: { id: decoded.id, email: decoded.email } 
    });
  } catch (error) {
    res.status(401).json({ authenticated: false });
  }
});

//Check if user is authenticated
app.get('/api/auth/check', (req, res) => {
  const token = req.cookies.auth_token;
  
  if (!token) {
    return res.json({ authenticated: false });
  }
  
  try {
    jwt.verify(token, JWT_SECRET);
    res.json({ authenticated: true });
  } catch (error) {
    res.json({ authenticated: false });
  }
});

app.listen(PORT, () => {
  console.log(`Auth service running on http://localhost:${PORT}`);
});