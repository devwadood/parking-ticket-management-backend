// models/car.js

const mongoose = require('mongoose');
const crypto=require("crypto");

const carSchema = new mongoose.Schema({
  number: { type: String, required: true },
  qr_code: { type: String, required: false },
  status: { type: String, enum: ['parked', 'not-parked'], default: 'parked' },
  // Add other fields as needed
});

// Hash the car's QR code before saving
carSchema.pre('save', function (next) {
  try {
    // Only hash the QR code if it has been modified (or is new)
    if (!this.isModified('qr_code')) {
      return next();
    }

    // Generate a hash for the QR code
    const qrCodeHash = crypto.createHash('sha256')
      .update(`${this.number}-${this._id}-${this.createdAt}`)
      .digest('hex');

    // Replace the plain text QR code with the hashed QR code
    this.qr_code = qrCodeHash;
    next();
  } catch (error) {
    next(error);
  }
});

const Car = mongoose.model('Car', carSchema);

// CRUD functions

// Create a new car with unique car number and status true
Car.createCar = async (carData) => {
    const { number } = carData;
  
    try {
      // Check if a car with the same number and status true already exists
      const existingCar = await Car.findOne({ number, status: true });
  
      if (existingCar) {
        throw new Error('A car with the same number and status true already exists');
      }
  
      const newCar = new Car(carData);
      const savedCar = await newCar.save();
      return savedCar;
    } catch (error) {
      throw error;
    }
  };

// Read all cars with pagination and search by car number
Car.getAllCars = async (page = 1, pageSize = 10, search = '') => {
  try {
    const skip = (page - 1) * pageSize;

    let query = {};
    if (search) {
      query = { number: { $regex: new RegExp(search, 'i') } }; // Case-insensitive search
    }

    const cars = await Car.find(query)
      .skip(skip)
      .limit(pageSize)
      .exec();

    const totalCarsCount = await Car.countDocuments(query);

    return {
      cars,
      totalCarsCount,
      currentPage: page,
      totalPages: Math.ceil(totalCarsCount / pageSize),
    };
  } catch (error) {
    throw error;
  }
};

// Read a car by ID
Car.getCarById = async (carId) => {
  try {
    const car = await Car.findById(carId);
    return car;
  } catch (error) {
    throw error;
  }
};

// Update a car by ID
Car.updateCarById = async (carId, carData) => {
  try {
    const updatedCar = await Car.findByIdAndUpdate(carId, carData, { new: true });
    return updatedCar;
  } catch (error) {
    throw error;
  }
};

// Delete a car by ID
Car.deleteCarById = async (carId) => {
  try {
    const deletedCar = await Car.findByIdAndDelete(carId);
    return deletedCar;
  } catch (error) {
    throw error;
  }
};

module.exports = Car;
