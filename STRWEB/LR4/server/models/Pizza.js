const mongoose = require('mongoose');

const pizzaSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Pizza name is required'],
    trim: true,
    minlength: [3, 'Name must be at least 3 characters'],
    maxlength: [100, 'Name cannot exceed 100 characters'],
  },
  description: {
    type: String,
    required: true,
    maxlength: [500, 'Description cannot exceed 500 characters'],
  },
  basePrice: {
    type: Number,
    required: [true, 'Base price is required'],
    min: [0, 'Price cannot be negative'],
  },
  size: {
    type: String,
    required: true,
    enum: ['small', 'medium', 'large', 'xlarge'],
    default: 'medium',
  },
  ingredients: [{
    ingredient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Ingredient',
      required: true,
    },
    quantity: {
      type: Number,
      default: 1,
      min: [1, 'Quantity must be at least 1'],
    }
  }],
  category: {
    type: String,
    enum: ['classic', 'premium', 'vegetarian', 'meat', 'seafood', 'custom'],
    default: 'classic',
  },
  image: {
    type: String,
    default: '/images/pizzas/default.jpg',
  },
  available: {
    type: Boolean,
    default: true,
  },
  preparationTime: {
    type: Number,
    default: 20,
    min: [10, 'Preparation time must be at least 10 minutes'],
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5,
  },
  reviews: {
    type: Number,
    default: 0,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
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

// Virtual for total price calculation
pizzaSchema.virtual('totalPrice').get(function() {
  let total = this.basePrice;
  this.ingredients.forEach(ing => {
    if (ing.ingredient && ing.ingredient.price) {
      total += ing.ingredient.price * ing.quantity;
    }
  });
  return total;
});

// Ensure virtuals are included in JSON
pizzaSchema.set('toJSON', { virtuals: true });
pizzaSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Pizza', pizzaSchema);
