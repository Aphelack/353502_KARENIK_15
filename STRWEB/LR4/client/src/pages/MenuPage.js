import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { pizzasAPI } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { formatPrice, debounce } from '../utils/helpers';
import './MenuPage.css';

// Arrow Function Component for Filter Section
const FilterSection = ({ filters, onFilterChange }) => (
  <div className="filters">
    <div className="filter-group">
      <label>Category:</label>
      <select 
        value={filters.category} 
        onChange={(e) => onFilterChange('category', e.target.value)}
      >
        <option value="">All</option>
        <option value="classic">Classic</option>
        <option value="premium">Premium</option>
        <option value="vegetarian">Vegetarian</option>
        <option value="meat">Meat</option>
        <option value="custom">Custom</option>
      </select>
    </div>

    <div className="filter-group">
      <label>Size:</label>
      <select 
        value={filters.size} 
        onChange={(e) => onFilterChange('size', e.target.value)}
      >
        <option value="">All</option>
        <option value="small">Small</option>
        <option value="medium">Medium</option>
        <option value="large">Large</option>
        <option value="xlarge">X-Large</option>
      </select>
    </div>

    <div className="filter-group">
      <label>Sort by:</label>
      <select 
        value={filters.sort} 
        onChange={(e) => onFilterChange('sort', e.target.value)}
      >
        <option value="">Default</option>
        <option value="price_asc">Price: Low to High</option>
        <option value="price_desc">Price: High to Low</option>
        <option value="rating">Rating</option>
        <option value="name">Name</option>
      </select>
    </div>
  </div>
);

// Arrow Function Component for Pizza Grid Item
const PizzaGridItem = ({ pizza, onView, onQuickOrder, user, onEdit, onDelete }) => {
  const totalPrice = pizza.totalPrice || pizza.basePrice;
  const isOwner = user && pizza.createdBy && (pizza.createdBy._id === user.id || pizza.createdBy === user.id);
  const isAdmin = user && user.role === 'admin';
  const canModify = isOwner || isAdmin;
  
  return (
    <div className="menu-pizza-card">
      <div className="pizza-image-placeholder">
        <span className="pizza-emoji">🍕</span>
      </div>
      <div className="pizza-info">
        <h3>{pizza.name}</h3>
        <p className="pizza-desc">{pizza.description}</p>
        
        <div className="pizza-badges">
          <span className="badge">{pizza.size}</span>
          <span className="badge">{pizza.category}</span>
          <span className="badge rating">⭐ {pizza.rating}</span>
        </div>

        <div className="pizza-ingredients-preview">
          {pizza.ingredients && pizza.ingredients.slice(0, 3).map((ing, idx) => (
            <span key={idx} className="ingredient-tag">
              {ing.ingredient?.name || 'Ingredient'}
            </span>
          ))}
          {pizza.ingredients && pizza.ingredients.length > 3 && (
            <span className="ingredient-tag">+{pizza.ingredients.length - 3} more</span>
          )}
        </div>

        <div className="pizza-footer">
          <span className="pizza-price">{formatPrice(totalPrice)}</span>
          <div className="pizza-actions">
            <button onClick={onView} className="btn btn-sm btn-outline">
              View
            </button>
            <button onClick={onQuickOrder} className="btn btn-sm btn-primary">
              Order
            </button>
            {canModify && (
              <>
                <button onClick={onEdit} className="btn btn-sm btn-secondary" style={{marginLeft: '5px'}}>Edit</button>
                <button onClick={onDelete} className="btn btn-sm btn-danger" style={{marginLeft: '5px', backgroundColor: '#d32f2f', color: 'white', border: 'none'}}>Delete</button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

function MenuPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [pizzas, setPizzas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    category: '',
    size: '',
    sort: '',
  });

  useEffect(() => {
    loadPizzas();
  }, [filters]);

  // Debounced search with XMLHttpRequest (async operation)
  useEffect(() => {
    const debouncedSearch = debounce(() => {
      if (searchTerm) {
        performSearch(searchTerm);
      } else {
        loadPizzas();
      }
    }, 500);

    debouncedSearch();
  }, [searchTerm]);

  const loadPizzas = async () => {
    setLoading(true);
    try {
      const params = {};
      if (filters.category) params.category = filters.category;
      if (filters.size) params.size = filters.size;
      if (filters.sort) params.sort = filters.sort;

      const response = await pizzasAPI.getAll(params);
      setPizzas(response.data.pizzas);
    } catch (error) {
      console.error('Load pizzas error:', error);
    } finally {
      setLoading(false);
    }
  };

  // XMLHttpRequest for search (demonstrates async operation)
  const performSearch = (term) => {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      const token = localStorage.getItem('token');
      
      xhr.open('GET', `/api/pizzas?search=${encodeURIComponent(term)}`, true);
      if (token) {
        xhr.setRequestHeader('Authorization', `Bearer ${token}`);
      }
      
      xhr.onload = function() {
        if (xhr.status === 200) {
          const data = JSON.parse(xhr.responseText);
          setPizzas(data.pizzas);
          setLoading(false);
          resolve(data);
        } else {
          reject(new Error('Search failed'));
          setLoading(false);
        }
      };
      
      xhr.onerror = function() {
        reject(new Error('Network error'));
        setLoading(false);
      };
      
      xhr.send();
    });
  };

  // Event Handler 14: onFilterChange
  const handleFilterChange = (filterName, value) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: value,
    }));
  };

  // Event Handler 15: onSearch
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  // Event Handler 16: onViewDetails
  const handleViewDetails = (pizzaId) => {
    navigate(`/pizza/${pizzaId}`);
  };

  // Event Handler 17: onQuickOrder (with timeout for demo)
  const handleQuickOrder = (pizza) => {
    // Simulate adding to cart with setTimeout (async operation)
    const notification = document.createElement('div');
    notification.className = 'quick-order-notification';
    notification.textContent = `${pizza.name} will be prepared!`;
    document.body.appendChild(notification);

    setTimeout(() => {
      notification.classList.add('show');
    }, 10);

    setTimeout(() => {
      notification.classList.remove('show');
      setTimeout(() => {
        document.body.removeChild(notification);
        navigate(`/pizza/${pizza._id}`);
      }, 300);
    }, 2000);
  };

  // Event Handler: onDeletePizza
  const handleDeletePizza = async (pizzaId) => {
    if (window.confirm('Are you sure you want to delete this pizza?')) {
      try {
        await pizzasAPI.delete(pizzaId);
        setPizzas(pizzas.filter(p => p._id !== pizzaId));
        alert('Pizza deleted successfully');
      } catch (error) {
        console.error('Delete pizza error:', error);
        alert('Failed to delete pizza');
      }
    }
  };

  // Event Handler: onEditPizza
  const handleEditPizza = (pizzaId) => {
    navigate(`/customize?edit=${pizzaId}`);
  };

  return (
    <div className="menu-page">
      <div className="menu-header">
        <h1>🍕 Our Menu</h1>
        <p>Discover our delicious selection of handcrafted pizzas</p>
      </div>

      <div className="menu-controls">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search pizzas..."
            value={searchTerm}
            onChange={handleSearch}
            className="search-input"
          />
          <span className="search-icon">🔍</span>
        </div>

        <FilterSection 
          filters={filters} 
          onFilterChange={handleFilterChange}
        />
      </div>

      {loading ? (
        <div className="loading">Loading menu...</div>
      ) : pizzas.length === 0 ? (
        <div className="no-results">
          <p>No pizzas found matching your criteria</p>
        </div>
      ) : (
        <div className="menu-grid">
          {pizzas.map(pizza => (
            <PizzaGridItem
              key={pizza._id}
              pizza={pizza}
              user={user}
              onView={() => handleViewDetails(pizza._id)}
              onQuickOrder={() => handleQuickOrder(pizza)}
              onEdit={() => handleEditPizza(pizza._id)}
              onDelete={() => handleDeletePizza(pizza._id)}
            />
          ))}
        </div>
      )}

      <div className="menu-footer">
        <p>Can't find what you're looking for?</p>
        <button 
          onClick={() => navigate('/customize')} 
          className="btn btn-primary"
        >
          Create Your Own Pizza
        </button>
      </div>
    </div>
  );
}

export default MenuPage;
