const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Ingredient = require('../models/Ingredient');
const { authMiddleware, optionalAuth, adminMiddleware } = require('../middleware/auth');

// Get all ingredients (public)
router.get('/', optionalAuth, async (req, res) => {
  try {
    const { category, available, search } = req.query;
    
    let query = {};

    if (category) query.category = category;
    if (available !== undefined) query.available = available === 'true';
    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }

    const ingredients = await Ingredient.find(query).sort({ name: 1 });

    res.json({
      count: ingredients.length,
      ingredients,
    });
  } catch (error) {
    console.error('Get ingredients error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single ingredient (public)
router.get('/:id', async (req, res) => {
  try {
    const ingredient = await Ingredient.findById(req.params.id);

    if (!ingredient) {
      return res.status(404).json({ message: 'Ingredient not found' });
    }

    res.json(ingredient);
  } catch (error) {
    console.error('Get ingredient error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create ingredient (authenticated users)
router.post('/', authMiddleware, [
  body('name').trim().isLength({ min: 2, max: 50 }),
  body('category').isIn(['cheese', 'meat', 'vegetable', 'sauce', 'seasoning', 'other']),
  body('price').isFloat({ min: 0 }),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const ingredient = new Ingredient(req.body);
    await ingredient.save();

    res.status(201).json({
      message: 'Ingredient created successfully',
      ingredient,
    });
  } catch (error) {
    console.error('Create ingredient error:', error);
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Ingredient already exists' });
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update ingredient (authenticated users)
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const ingredient = await Ingredient.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!ingredient) {
      return res.status(404).json({ message: 'Ingredient not found' });
    }

    res.json({
      message: 'Ingredient updated successfully',
      ingredient,
    });
  } catch (error) {
    console.error('Update ingredient error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete ingredient (admin only)
router.delete('/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const ingredient = await Ingredient.findByIdAndDelete(req.params.id);

    if (!ingredient) {
      return res.status(404).json({ message: 'Ingredient not found' });
    }

    res.json({ message: 'Ingredient deleted successfully' });
  } catch (error) {
    console.error('Delete ingredient error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
