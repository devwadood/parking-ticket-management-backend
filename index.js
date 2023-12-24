require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');
const authRoutes = require('./routes/auth/routes');
const carsRoutes = require('./routes/car/routes');

const app = express();
const PORT = process.env.PORT || 3000;

// Connect to MongoDB
connectDB();

// Express middleware
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/cars', carsRoutes);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
