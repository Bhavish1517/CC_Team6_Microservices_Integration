const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const { sequelize } = require('./config/database.cjs');
const tutorialRoutes = require('./routes/tutorials.cjs');
const { authMiddleware } = require('../../shared/authMiddleware');
const path = require('path');

const app = express();
const PORT = 3007;
const HOST = 'localhost';

// Middleware
app.use(cookieParser());
app.use(cors({
  origin: 'http://localhost:3001',
  credentials: true
}));
app.use(express.json());

// Protected static files and routes
app.use(authMiddleware); // Protect all routes below this
app.use(express.static('../frontend/dist')); // Serve frontend files
app.use('/api/tutorials', tutorialRoutes);

// Health check endpoint (unprotected)
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Serve the frontend for all other routes (already protected by middleware above)
app.get('*', (req, res) => {
  res.sendFile('index.html', { root: path.join(__dirname, '../frontend/dist') });
});

// Sync database and start the server
sequelize.sync()
  .then(() => {
    app.listen(PORT, HOST, () => {
      console.log(`Server running on http://${HOST}:${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Error syncing the database:", error);
    process.exit(1);
  });
