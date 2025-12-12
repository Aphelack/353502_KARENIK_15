const mongoose = require('mongoose');

const ingredientSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Ingredient name is required'],
    trim: true,
    unique: true,
    minlength: [2, 'Name must be at least 2 characters'],
    maxlength: [50, 'Name cannot exceed 50 characters'],
  },
  category: {
    type: String,
    required: true,
    enum: ['cheese', 'meat', 'vegetable', 'sauce', 'seasoning', 'other'],
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price cannot be negative'],
  },
  available: {
    type: Boolean,
    default: true,
  },
  image: {
    type: String,
    default: '/images/ingredients/default.jpg',
  },
  allergens: [{
    type: String,
    enum: ['gluten', 'dairy', 'nuts', 'soy', 'eggs', 'fish', 'shellfish', 'none'],
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  }
}, {
  timestamps: true,
});

module.exports = mongoose.model('Ingredient', ingredientSchema);
