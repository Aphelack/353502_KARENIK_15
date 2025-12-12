import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { pizzasAPI, ordersAPI, aiAPI } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { formatPrice, calculatePizzaPrice, isValidPhone } from '../utils/helpers';
import './PizzaDetailPage.css';

function PizzaDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [pizza, setPizza] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [showOrderForm, setShowOrderForm] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState('');

  // Order form state
  const [orderForm, setOrderForm] = useState({
    street: '',
    city: '',
    zipCode: '',
    phone: '',
    paymentMethod: 'cash',
    notes: '',
  });

  useEffect(() => {
    loadPizza();
  }, [id]);

  const loadPizza = async () => {
    try {
      const response = await pizzasAPI.getById(id);
      setPizza(response.data.pizza);
      
      // Get AI pairing suggestions
      if (response.data.pizza.ingredients) {
        const ingredientNames = response.data.pizza.ingredients
          .map(ing => ing.ingredient?.name)
          .filter(Boolean);
        getAIPairings(ingredientNames);
      }
    } catch (error) {
      console.error('Load pizza error:', error);
    } finally {
      setLoading(false);
    }
  };

  const getAIPairings = async (ingredients) => {
    try {
      const response = await aiAPI.chat(
        `What drinks and sides would pair well with a pizza that has: ${ingredients.join(', ')}? Keep it brief.`,
        'food pairing recommendation'
      );
      setAiSuggestions(response.data.reply);
    } catch (error) {
      console.error('AI pairing error:', error);
    }
  };

  // Event Handler 18: onQuantityChange
  const handleQuantityChange = (delta) => {
    setQuantity(prev => Math.max(1, prev + delta));
  };

  // Event Handler 19: onOrderFormChange
  const handleOrderFormChange = (e) => {
    const { name, value } = e.target;
    setOrderForm(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  // Event Handler 20: onSubmitOrder (with validation)
  const handleSubmitOrder = async (e) => {
    e.preventDefault();

    if (!user) {
      alert('Please login to place an order');
      navigate('/login');
      return;
    }

    // Form validation
    if (!orderForm.street || !orderForm.city || !orderForm.zipCode || !orderForm.phone) {
      alert('Please fill in all delivery address fields');
      return;
    }

    if (!isValidPhone(orderForm.phone)) {
      alert('Please enter a valid phone number');
      return;
    }

    setLoading(true);
    try {
      const orderData = {
        items: [{
          pizza: pizza._id,
          quantity: quantity,
        }],
        deliveryAddress: {
          street: orderForm.street,
          city: orderForm.city,
          zipCode: orderForm.zipCode,
          phone: orderForm.phone,
        },
        paymentMethod: orderForm.paymentMethod,
        notes: orderForm.notes,
      };

      const response = await ordersAPI.create(orderData);
      alert('Order placed successfully!');
      navigate(`/track/${response.data.order._id}`);
    } catch (error) {
      console.error('Order error:', error);
      alert(error.response?.data?.message || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  if (loading && !pizza) {
    return <div className="loading">Loading pizza details...</div>;
  }

  if (!pizza) {
    return <div className="error">Pizza not found</div>;
  }

  const totalPrice = calculatePizzaPrice(pizza) * quantity;

  return (
    <div className="pizza-detail-page">
      <div className="pizza-detail-container">
        <div className="pizza-image-section">
          <div className="pizza-image-large">
            <span className="pizza-emoji-large">🍕</span>
          </div>
          <div className="pizza-meta">
            <span className="badge">{pizza.size}</span>
            <span className="badge">{pizza.category}</span>
            <span className="badge rating">⭐ {pizza.rating} ({pizza.reviews} reviews)</span>
          </div>
        </div>

        <div className="pizza-info-section">
          <h1>{pizza.name}</h1>
          <p className="pizza-description">{pizza.description}</p>

          <div className="pizza-ingredients">
            <h3>Ingredients:</h3>
            <div className="ingredients-list">
              {pizza.ingredients && pizza.ingredients.map((ing, idx) => (
                <div key={idx} className="ingredient-item">
                  <span className="ingredient-name">
                    {ing.ingredient?.name || 'Ingredient'}
                  </span>
                  {ing.ingredient?.price && (
                    <span className="ingredient-price">
                      +{formatPrice(ing.ingredient.price)}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {aiSuggestions && (
            <div className="ai-suggestions">
              <h3>🤖 AI Pairing Suggestions:</h3>
              <div className="markdown-content">
                <ReactMarkdown>{aiSuggestions}</ReactMarkdown>
              </div>
            </div>
          )}

          <div className="pizza-pricing">
            <div className="price-row">
              <span>Base Price:</span>
              <span>{formatPrice(pizza.basePrice)}</span>
            </div>
            <div className="price-row">
              <span>Preparation Time:</span>
              <span>{pizza.preparationTime} minutes</span>
            </div>
            <div className="price-row total">
              <span>Total ({quantity}x):</span>
              <span className="total-price">{formatPrice(totalPrice)}</span>
            </div>
          </div>

          <div className="quantity-selector">
            <label>Quantity:</label>
            <div className="quantity-controls">
              <button onClick={() => handleQuantityChange(-1)}>-</button>
              <span>{quantity}</span>
              <button onClick={() => handleQuantityChange(1)}>+</button>
            </div>
          </div>

          {!showOrderForm ? (
            <button 
              className="btn btn-primary btn-large"
              onClick={() => setShowOrderForm(true)}
            >
              Order Now
            </button>
          ) : (
            <form onSubmit={handleSubmitOrder} className="order-form">
              <h3>Delivery Information</h3>
              
              <div className="form-group">
                <label>Street Address *</label>
                <input
                  type="text"
                  name="street"
                  value={orderForm.street}
                  onChange={handleOrderFormChange}
                  required
                  placeholder="123 Main St"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>City *</label>
                  <input
                    type="text"
                    name="city"
                    value={orderForm.city}
                    onChange={handleOrderFormChange}
                    required
                    placeholder="New York"
                  />
                </div>

                <div className="form-group">
                  <label>Zip Code *</label>
                  <input
                    type="text"
                    name="zipCode"
                    value={orderForm.zipCode}
                    onChange={handleOrderFormChange}
                    required
                    placeholder="10001"
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Phone Number *</label>
                <input
                  type="tel"
                  name="phone"
                  value={orderForm.phone}
                  onChange={handleOrderFormChange}
                  required
                  placeholder="+1234567890"
                />
              </div>

              <div className="form-group">
                <label>Payment Method</label>
                <select
                  name="paymentMethod"
                  value={orderForm.paymentMethod}
                  onChange={handleOrderFormChange}
                >
                  <option value="cash">Cash on Delivery</option>
                  <option value="card">Card on Delivery</option>
                  <option value="online">Online Payment</option>
                </select>
              </div>

              <div className="form-group">
                <label>Special Instructions</label>
                <textarea
                  name="notes"
                  value={orderForm.notes}
                  onChange={handleOrderFormChange}
                  placeholder="Any special requests?"
                  rows="3"
                />
              </div>

              <div className="form-actions">
                <button 
                  type="submit" 
                  className="btn btn-primary"
                  disabled={loading}
                >
                  {loading ? 'Placing Order...' : `Place Order - ${formatPrice(totalPrice)}`}
                </button>
                <button 
                  type="button" 
                  className="btn btn-outline"
                  onClick={() => setShowOrderForm(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export default PizzaDetailPage;
