// models/user.js

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: false },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  // Add other fields as needed
});

// Hash the user's password before saving
userSchema.pre('save', async function (next) {
  try {
    // Only hash the password if it has been modified (or is new)
    if (!this.isModified('password')) {
      return next();
    }

    // Generate a salt
    const salt = await bcrypt.genSalt(10);

    // Hash the password along with the new salt
    const hashedPassword = await bcrypt.hash(this.password, salt);

    // Replace the plain text password with the hashed password
    this.password = hashedPassword;
    next();
  } catch (error) {
    next(error);
  }
});

// Check if the email already exists before saving
userSchema.pre('save', async function (next) {
  try {
    const existingUser = await mongoose.model('User').findOne({ email: this.email });

    if (existingUser) {
      throw new Error('Email already exists');
    }

    next();
  } catch (error) {
    next(error);
  }
});

const User = mongoose.model('User', userSchema);



// CRUD functions

// Create a new user
User.createUser = async (userData) => {
  try {
    const newUser = new User(userData);
    const savedUser = await newUser.save();
    return savedUser;
  } catch (error) {
    throw error;
  }
};

// Read a user by ID
User.getUserById = async (userId) => {
  try {
    const user = await User.findById(userId);
    return user;
  } catch (error) {
    throw error;
  }
};

// Update a user by ID
User.updateUserById = async (userId, userData) => {
    try {
      // If the update includes a password, hash it
      if (userData.password) {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(userData.password, salt);
        userData.password = hashedPassword;
      }
  
      const updatedUser = await User.findByIdAndUpdate(userId, userData, { new: true });
      return updatedUser;
    } catch (error) {
      throw error;
    }
  };

// Delete a user by ID
User.deleteUserById = async (userId) => {
  try {
    const deletedUser = await User.findByIdAndDelete(userId);
    return deletedUser;
  } catch (error) {
    throw error;
  }
};

// Get a user by ID and password
User.getUserByIdAndPassword = async (userId, password) => {
    try {
      const user = await User.findOne({ _id: userId });
  
      if (user) {
        // Compare the provided password with the stored hashed password
        const isMatch = await bcrypt.compare(password, user.password);
  
        if (isMatch) {
          return user;
        }
      }
  
      return null; // Return null if user not found or password doesn't match
    } catch (error) {
      throw error;
    }
  };

module.exports = User;
