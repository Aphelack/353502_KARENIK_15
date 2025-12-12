const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  orderNumber: {
    type: String,
    unique: true,
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  items: [{
    pizza: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Pizza',
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: [1, 'Quantity must be at least 1'],
    },
    price: {
      type: Number,
      required: true,
    },
    customizations: {
      type: String,
      maxlength: 200,
    }
  }],
  totalPrice: {
    type: Number,
    required: true,
    min: [0, 'Total price cannot be negative'],
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'preparing', 'baking', 'ready', 'delivering', 'delivered', 'cancelled'],
    default: 'pending',
  },
  deliveryAddress: {
    street: { type: String, required: true },
    city: { type: String, required: true },
    zipCode: { type: String, required: true },
    phone: { 
      type: String, 
      required: true,
      validate: {
        validator: function(v) {
          return /^\+?[\d\s\-()]+$/.test(v);
        },
        message: props => `${props.value} is not a valid phone number!`
      }
    },
  },
  paymentMethod: {
    type: String,
    enum: ['cash', 'card', 'online'],
    default: 'cash',
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed'],
    default: 'pending',
  },
  estimatedDeliveryTime: {
    type: Date,
  },
  actualDeliveryTime: {
    type: Date,
  },
  courierLocation: {
    lat: Number,
    lng: Number,
    lastUpdate: Date,
  },
  notes: {
    type: String,
    maxlength: 500,
  },
  promoCode: {
    type: String,
  },
  discount: {
    type: Number,
    default: 0,
    min: 0,
    max: 100,
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

// Generate unique order number
orderSchema.pre('save', async function(next) {
  if (this.isNew) {
    const count = await mongoose.model('Order').countDocuments();
    this.orderNumber = `ORD-${Date.now()}-${count + 1}`;
  }
  next();
});

module.exports = mongoose.model('Order', orderSchema);
