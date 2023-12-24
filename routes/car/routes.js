const express = require('express');
const router = express.Router();
const Car = require('../../models/car');
const authenticateMiddleware = require('../../middlewares/authMiddleware');

// Get all cars with pagination and search
router.get('/', authenticateMiddleware, async (req, res) => {
  const { page, pageSize, search } = req.query;

  try {
    const result = await Car.getAllCars(parseInt(page), parseInt(pageSize), search);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get a car by ID
router.get('/:id', authenticateMiddleware, async (req, res) => {
  const carId = req.params.id;

  try {
    const car = await Car.getCarById(carId);

    if (car) {
      res.json(car);
    } else {
      res.status(404).json({ error: 'Car not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create a new car
router.post('/', authenticateMiddleware, async (req, res) => {
  const { number, qr_code, status } = req.body;

  try {
    const newCar = await Car.createCar({ number, qr_code, status });
    res.json(newCar);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update a car by ID
router.put('/:id', authenticateMiddleware, async (req, res) => {
  const carId = req.params.id;
  const { number, qr_code, status } = req.body;

  try {
    const updatedCar = await Car.updateCarById(carId, { number, qr_code, status });
    res.json(updatedCar);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete a car by ID
router.delete('/:id', authenticateMiddleware, async (req, res) => {
  const carId = req.params.id;

  try {
    const deletedCar = await Car.deleteCarById(carId);

    if (deletedCar) {
      res.json({ message: 'Car deleted successfully' });
    } else {
      res.status(404).json({ error: 'Car not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
