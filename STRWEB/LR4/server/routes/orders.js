const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Order = require('../models/Order');
const Pizza = require('../models/Pizza');
const { authMiddleware, optionalAuth } = require('../middleware/auth');

// Get all orders (user gets their own, admin gets all)
router.get('/', authMiddleware, async (req, res) => {
  try {
    const { status, sort } = req.query;
    
    let query = {};
    
    // Regular users can only see their own orders
    if (req.user.role !== 'admin') {
      query.user = req.userId;
    }

    if (status) {
      query.status = status;
    }

    let sortOption = { createdAt: -1 };
    if (sort === 'price_asc') sortOption = { totalPrice: 1 };
    else if (sort === 'price_desc') sortOption = { totalPrice: -1 };
    else if (sort === 'date_asc') sortOption = { createdAt: 1 };

    const orders = await Order.find(query)
      .populate('user', 'name email')
      .populate('items.pizza')
      .sort(sortOption);

    res.json({
      count: orders.length,
      orders,
      userTimezone: req.user.timezone,
      serverTime: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single order
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('user', 'name email timezone')
      .populate('items.pizza');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Check authorization
    if (order.user._id.toString() !== req.userId && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to view this order' });
    }

    res.json({
      order,
      userTimezone: req.user.timezone,
      serverTime: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create order (authenticated users)
router.post('/', authMiddleware, [
  body('items').isArray({ min: 1 }),
  body('items.*.pizza').isMongoId(),
  body('items.*.quantity').isInt({ min: 1 }),
  body('deliveryAddress.street').trim().notEmpty(),
  body('deliveryAddress.city').trim().notEmpty(),
  body('deliveryAddress.zipCode').trim().notEmpty(),
  body('deliveryAddress.phone').trim().notEmpty(),
  body('paymentMethod').isIn(['cash', 'card', 'online']),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { items, deliveryAddress, paymentMethod, notes, promoCode } = req.body;

    // Calculate total price
    let totalPrice = 0;
    const orderItems = [];

    for (const item of items) {
      const pizza = await Pizza.findById(item.pizza).populate('ingredients.ingredient');
      
      if (!pizza || !pizza.available) {
        return res.status(400).json({ message: `Pizza ${pizza?.name || item.pizza} is not available` });
      }

      let itemPrice = pizza.basePrice;
      if (pizza.ingredients) {
        pizza.ingredients.forEach(ing => {
          if (ing.ingredient && ing.ingredient.price) {
            itemPrice += ing.ingredient.price * ing.quantity;
          }
        });
      }

      orderItems.push({
        pizza: pizza._id,
        quantity: item.quantity,
        price: itemPrice,
        customizations: item.customizations,
      });

      totalPrice += itemPrice * item.quantity;
    }

    // Apply discount if promo code exists
    let discount = 0;
    if (promoCode === 'FIRST10') {
      discount = 10;
      totalPrice *= 0.9;
    }

    // Estimate delivery time (30-45 minutes from now)
    const estimatedDeliveryTime = new Date(Date.now() + (30 + Math.random() * 15) * 60000);

    const order = new Order({
      user: req.userId,
      items: orderItems,
      totalPrice,
      deliveryAddress,
      paymentMethod,
      notes,
      promoCode,
      discount,
      estimatedDeliveryTime,
    });

    await order.save();

    const populatedOrder = await Order.findById(order._id)
      .populate('user', 'name email')
      .populate('items.pizza');

    res.status(201).json({
      message: 'Order created successfully',
      order: populatedOrder,
      createdAt: order.createdAt,
      createdAtUTC: order.createdAt.toISOString(),
      estimatedDeliveryTime: order.estimatedDeliveryTime,
      estimatedDeliveryTimeUTC: order.estimatedDeliveryTime.toISOString(),
    });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update order status
router.patch('/:id/status', authMiddleware, async (req, res) => {
  try {
    const { status, courierLocation } = req.body;

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Check authorization
    if (order.user.toString() !== req.userId && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to update this order' });
    }

    order.status = status;
    
    if (courierLocation) {
      order.courierLocation = {
        ...courierLocation,
        lastUpdate: new Date(),
      };
    }

    if (status === 'delivered') {
      order.actualDeliveryTime = new Date();
    }

    await order.save();

    const updatedOrder = await Order.findById(order._id)
      .populate('user', 'name email')
      .populate('items.pizza');

    res.json({
      message: 'Order status updated',
      order: updatedOrder,
      updatedAt: order.updatedAt,
      updatedAtUTC: order.updatedAt.toISOString(),
    });
  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Cancel order
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Check authorization
    if (order.user.toString() !== req.userId && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to cancel this order' });
    }

    // Can only cancel pending or confirmed orders
    if (!['pending', 'confirmed'].includes(order.status)) {
      return res.status(400).json({ message: 'Cannot cancel order in current status' });
    }

    order.status = 'cancelled';
    await order.save();

    res.json({ message: 'Order cancelled successfully' });
  } catch (error) {
    console.error('Cancel order error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
