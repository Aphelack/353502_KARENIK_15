import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { pizzasAPI, aiAPI } from '../utils/api';
import './HomePage.css';

// Arrow Function Component for Hero Section
const HeroSection = () => (
  <section className="hero">
    <div className="hero-content">
      <h1 className="hero-title">🍕 Authentic Italian Pizza</h1>
      <p className="hero-subtitle">
        Handcrafted with love, delivered with speed
      </p>
      <div className="hero-actions">
        <Link to="/menu" className="btn btn-primary btn-large">
          View Menu
        </Link>
        <Link to="/customize" className="btn btn-outline btn-large">
          Build Your Own
        </Link>
      </div>
    </div>
    <div className="hero-image">
      <div className="pizza-animation">🍕</div>
    </div>
  </section>
);

// Arrow Function Component for Feature Card
const FeatureCard = ({ icon, title, description }) => (
  <div className="feature-card">
    <div className="feature-icon">{icon}</div>
    <h3>{title}</h3>
    <p>{description}</p>
  </div>
);

// Arrow Function Component for Pizza Card
const PizzaCard = ({ pizza, onClick }) => (
  <div className="pizza-card" onClick={onClick}>
    <div className="pizza-card-header">
      <h3>{pizza.name}</h3>
      <span className="pizza-rating">⭐ {pizza.rating}</span>
    </div>
    <p className="pizza-description">{pizza.description}</p>
    <div className="pizza-card-footer">
      <span className="pizza-price">From ${pizza.basePrice}</span>
      <span className="pizza-category">{pizza.category}</span>
    </div>
  </div>
);

function HomePage() {
  const [featuredPizzas, setFeaturedPizzas] = useState([]);
  const [aiRecommendation, setAiRecommendation] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFeaturedPizzas();
    loadAIRecommendation();
  }, []);

  const loadFeaturedPizzas = async () => {
    try {
      const response = await pizzasAPI.getAll({ sort: 'rating' });
      setFeaturedPizzas(response.data.pizzas.slice(0, 3));
    } catch (error) {
      console.error('Load pizzas error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Async operation with Promise - AI recommendation
  const loadAIRecommendation = async () => {
    try {
      const response = await aiAPI.recommendRecipe({
        preferences: 'popular ingredients',
        dietary: 'none',
      });
      
      // Extract just a brief recommendation
      const text = response.data.recommendation;
      const brief = text.substring(0, 200) + '...';
      setAiRecommendation(brief);
    } catch (error) {
      console.error('AI recommendation error:', error);
    }
  };

  // Event Handler 13: onPizzaClick
  const handlePizzaClick = (pizzaId) => {
    window.location.href = `/pizza/${pizzaId}`;
  };

  return (
    <div className="home-page">
      <HeroSection />

      <section className="features-section">
        <h2>Why Choose Us</h2>
        <div className="features-grid">
          <FeatureCard
            icon="🔥"
            title="Wood-Fired Ovens"
            description="Traditional stone ovens for authentic taste"
          />
          <FeatureCard
            icon="🚀"
            title="Fast Delivery"
            description="Hot pizza at your door in 30 minutes"
          />
          <FeatureCard
            icon="🌟"
            title="Premium Ingredients"
            description="Only the finest Italian ingredients"
          />
          <FeatureCard
            icon="👨‍🍳"
            title="Master Chefs"
            description="Trained in traditional Italian methods"
          />
        </div>
      </section>

      <section className="featured-section">
        <h2>🏆 Customer Favorites</h2>
        {loading ? (
          <div className="loading">Loading pizzas...</div>
        ) : (
          <div className="pizzas-grid">
            {featuredPizzas.map(pizza => (
              <PizzaCard
                key={pizza._id}
                pizza={pizza}
                onClick={() => handlePizzaClick(pizza._id)}
              />
            ))}
          </div>
        )}
      </section>

      {aiRecommendation && (
        <section className="ai-section">
          <h2>🤖 AI Chef's Recommendation</h2>
          <div className="ai-card">
            <p>{aiRecommendation}</p>
            <Link to="/menu" className="btn btn-secondary">
              Explore Full Menu
            </Link>
          </div>
        </section>
      )}

      <section className="cta-section">
        <h2>Ready to Order?</h2>
        <p>Create your perfect pizza or choose from our classic menu</p>
        <div className="cta-actions">
          <Link to="/menu" className="btn btn-primary btn-large">
            Order Now
          </Link>
        </div>
      </section>
    </div>
  );
}

export default HomePage;
