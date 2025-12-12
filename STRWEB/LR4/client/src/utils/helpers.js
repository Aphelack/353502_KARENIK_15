// Format date for user's timezone
export const formatDateForTimezone = (date, timezone = 'UTC') => {
  const dateObj = new Date(date);
  return dateObj.toLocaleString('en-US', {
    timeZone: timezone,
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

// Format date for UTC
export const formatDateUTC = (date) => {
  const dateObj = new Date(date);
  return dateObj.toUTCString();
};

// Get current time in timezone
export const getCurrentTime = (timezone = 'UTC') => {
  return new Date().toLocaleString('en-US', {
    timeZone: timezone,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
};

// Format price
export const formatPrice = (price) => {
  return `$${parseFloat(price).toFixed(2)}`;
};

// Calculate total with ingredients
export const calculatePizzaPrice = (pizza) => {
  let total = pizza.basePrice;
  if (pizza.ingredients && Array.isArray(pizza.ingredients)) {
    pizza.ingredients.forEach(ing => {
      if (ing.ingredient?.price) {
        total += ing.ingredient.price * (ing.quantity || 1);
      }
    });
  }
  return total;
};

// Debounce function
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

// Validate email
export const isValidEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

// Validate phone
export const isValidPhone = (phone) => {
  const re = /^\+?[\d\s\-()]+$/;
  return re.test(phone);
};

// Get order status color
export const getOrderStatusColor = (status) => {
  const colors = {
    pending: '#FFA500',
    confirmed: '#4CAF50',
    preparing: '#2196F3',
    baking: '#FF9800',
    ready: '#8BC34A',
    delivering: '#9C27B0',
    delivered: '#4CAF50',
    cancelled: '#F44336',
  };
  return colors[status] || '#757575';
};

// Get order status text
export const getOrderStatusText = (status) => {
  const texts = {
    pending: 'Pending Confirmation',
    confirmed: 'Confirmed',
    preparing: 'Preparing Ingredients',
    baking: 'Baking in Oven',
    ready: 'Ready for Delivery',
    delivering: 'Out for Delivery',
    delivered: 'Delivered',
    cancelled: 'Cancelled',
  };
  return texts[status] || status;
};

// Local storage helpers
export const storage = {
  set: (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('Storage set error:', error);
    }
  },
  get: (key) => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error('Storage get error:', error);
      return null;
    }
  },
  remove: (key) => {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error('Storage remove error:', error);
    }
  },
};
