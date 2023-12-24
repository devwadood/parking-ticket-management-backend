require('dotenv').config();

const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../../models/user');
const authenticateMiddleware = require('../../middlewares/authMiddleware');
const bcrypt = require('bcrypt');

// Signup
router.post('/signup', async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const newUser = await User.createUser({ username, email, password });
    res.json(newUser);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (user) {
      // Compare the provided password with the hashed password in the database
      const isMatch = await bcrypt.compare(password, user.password);

      if (isMatch) {
        // Generate a JWT token
        const token = jwt.sign({ userId: user._id, username: user.username }, process.env.JWT_SECRET);
        res.json({ token });
      } else {
        res.status(401).json({ error: 'Invalid credentials' });
      }
    } else {
      res.status(401).json({ error: 'Invalid credentials' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Profile (Protected by JWT)
router.get('/profile', authenticateMiddleware, (req, res) => {
  // The authenticated user's information is available in req.user
  res.json({ user: req.user });
});

// Logout (Assuming you have a middleware for authentication)
router.post('/logout', authenticateMiddleware, (req, res) => {
  // Perform logout actions (e.g., token invalidation)
  res.json({ message: 'Logout successful!' });
});

// Add other authentication-related routes as needed

module.exports = router;