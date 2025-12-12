const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Pizza = require('../models/Pizza');
const { authMiddleware, optionalAuth, adminMiddleware } = require('../middleware/auth');

// Get all pizzas (public, with optional auth for personalization)
router.get('/', optionalAuth, async (req, res) => {
  try {
    const { category, size, minPrice, maxPrice, search, sort } = req.query;
    
    let query = { available: true };

    // Filters
    if (category) query.category = category;
    if (size) query.size = size;
    if (minPrice || maxPrice) {
      query.basePrice = {};
      if (minPrice) query.basePrice.$gte = parseFloat(minPrice);
      if (maxPrice) query.basePrice.$lte = parseFloat(maxPrice);
    }
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    // Sorting
    let sortOption = {};
    if (sort === 'price_asc') sortOption.basePrice = 1;
    else if (sort === 'price_desc') sortOption.basePrice = -1;
    else if (sort === 'name') sortOption.name = 1;
    else if (sort === 'rating') sortOption.rating = -1;
    else sortOption.createdAt = -1;

    const pizzas = await Pizza.find(query)
      .populate('ingredients.ingredient')
      .populate('createdBy', 'name')
      .sort(sortOption);

    res.json({
      count: pizzas.length,
      pizzas,
      userTimezone: req.user?.timezone || 'UTC',
      serverTime: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Get pizzas error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single pizza by ID (public)
router.get('/:id', optionalAuth, async (req, res) => {
  try {
    const pizza = await Pizza.findById(req.params.id)
      .populate('ingredients.ingredient')
      .populate('createdBy', 'name email');

    if (!pizza) {
      return res.status(404).json({ message: 'Pizza not found' });
    }

    res.json({
      pizza,
      userTimezone: req.user?.timezone || 'UTC',
      serverTime: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Get pizza error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create pizza (authenticated users)
router.post('/', authMiddleware, [
  body('name').trim().isLength({ min: 3, max: 100 }),
  body('description').trim().isLength({ min: 10, max: 500 }),
  body('basePrice').isFloat({ min: 0 }),
  body('size').isIn(['small', 'medium', 'large', 'xlarge']),
  body('category').isIn(['classic', 'premium', 'vegetarian', 'meat', 'seafood', 'custom']),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const pizzaData = {
      ...req.body,
      createdBy: req.userId,
    };

    const pizza = new Pizza(pizzaData);
    await pizza.save();

    const populatedPizza = await Pizza.findById(pizza._id)
      .populate('ingredients.ingredient')
      .populate('createdBy', 'name');

    res.status(201).json({
      message: 'Pizza created successfully',
      pizza: populatedPizza,
      createdAt: pizza.createdAt,
      createdAtUTC: pizza.createdAt.toISOString(),
    });
  } catch (error) {
    console.error('Create pizza error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update pizza (authenticated users can update their own, admins can update any)
router.put('/:id', authMiddleware, [
  body('name').optional().trim().isLength({ min: 3, max: 100 }),
  body('description').optional().trim().isLength({ min: 10, max: 500 }),
  body('basePrice').optional().isFloat({ min: 0 }),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const pizza = await Pizza.findById(req.params.id);

    if (!pizza) {
      return res.status(404).json({ message: 'Pizza not found' });
    }

    // Check authorization
    if (pizza.createdBy.toString() !== req.userId && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to update this pizza' });
    }

    Object.assign(pizza, req.body);
    await pizza.save();

    const updatedPizza = await Pizza.findById(pizza._id)
      .populate('ingredients.ingredient')
      .populate('createdBy', 'name');

    res.json({
      message: 'Pizza updated successfully',
      pizza: updatedPizza,
      updatedAt: pizza.updatedAt,
      updatedAtUTC: pizza.updatedAt.toISOString(),
    });
  } catch (error) {
    console.error('Update pizza error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete pizza (authenticated users can delete their own, admins can delete any)
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const pizza = await Pizza.findById(req.params.id);

    if (!pizza) {
      return res.status(404).json({ message: 'Pizza not found' });
    }

    // Check authorization
    if (pizza.createdBy.toString() !== req.userId && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this pizza' });
    }

    await Pizza.findByIdAndDelete(req.params.id);

    res.json({ message: 'Pizza deleted successfully' });
  } catch (error) {
    console.error('Delete pizza error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
