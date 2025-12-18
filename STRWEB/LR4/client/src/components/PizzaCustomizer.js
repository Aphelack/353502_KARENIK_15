import React, { useState, useEffect, useReducer } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { ingredientsAPI, pizzasAPI, aiAPI } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { formatPrice } from '../utils/helpers';
import './PizzaCustomizer.css';

// Reducer for complex state management (using useReducer hook)
const customizationReducer = (state, action) => {
  switch (action.type) {
    case 'SET_INGREDIENTS':
      return { ...state, availableIngredients: action.payload };
    case 'SET_SELECTED_INGREDIENTS':
      return { ...state, selectedIngredients: action.payload };
    case 'ADD_INGREDIENT':
      return {
        ...state,
        selectedIngredients: [...state.selectedIngredients, action.payload]
      };
    case 'REMOVE_INGREDIENT':
      return {
        ...state,
        selectedIngredients: state.selectedIngredients.filter(
          ing => ing._id !== action.payload
        )
      };
    case 'SET_SIZE':
      return { ...state, size: action.payload };
    case 'SET_BASE':
      return { ...state, base: action.payload };
    case 'RESET':
      return {
        ...state,
        selectedIngredients: [],
        size: 'medium',
        base: 'tomato',
      };
    default:
      return state;
  }
};

// Functional Component with useReducer hook
function PizzaCustomizer() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const editPizzaId = queryParams.get('edit');

  const [state, dispatch] = useReducer(customizationReducer, {
    availableIngredients: [],
    selectedIngredients: [],
    size: 'medium',
    base: 'tomato',
  });

  const [pizzaName, setPizzaName] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState('');
  const [category, setCategory] = useState('cheese');

  // Load ingredients
  useEffect(() => {
    loadIngredients();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category]);

  // Load pizza for edit
  useEffect(() => {
    if (editPizzaId) {
      loadPizzaForEdit(editPizzaId);
    }
  }, [editPizzaId]);

  const loadPizzaForEdit = async (id) => {
    try {
      setLoading(true);
      const response = await pizzasAPI.getById(id);
      const pizza = response.data.pizza;
      
      setPizzaName(pizza.name);
      setDescription(pizza.description);
      dispatch({ type: 'SET_SIZE', payload: pizza.size });
      
      if (pizza.ingredients) {
        const selectedIngs = pizza.ingredients.map(ing => ing.ingredient);
        dispatch({ type: 'SET_SELECTED_INGREDIENTS', payload: selectedIngs });
      }
    } catch (error) {
      console.error('Load pizza error:', error);
      alert('Failed to load pizza for editing');
      navigate('/menu');
    } finally {
      setLoading(false);
    }
  };

  const loadIngredients = async () => {
    try {
      const response = await ingredientsAPI.getAll({ category, available: true });
      dispatch({ type: 'SET_INGREDIENTS', payload: response.data.ingredients });
    } catch (error) {
      console.error('Load ingredients error:', error);
    }
  };

  // Event Handler 5: onIngredientSelect
  const handleIngredientSelect = (ingredient) => {
    const isSelected = state.selectedIngredients.find(ing => ing._id === ingredient._id);
    
    if (isSelected) {
      dispatch({ type: 'REMOVE_INGREDIENT', payload: ingredient._id });
    } else {
      dispatch({ type: 'ADD_INGREDIENT', payload: ingredient });
    }
  };

  // Event Handler 6: onSizeChange
  const handleSizeChange = (e) => {
    dispatch({ type: 'SET_SIZE', payload: e.target.value });
  };

  // Event Handler 7: onBaseChange
  const handleBaseChange = (e) => {
    dispatch({ type: 'SET_BASE', payload: e.target.value });
  };

  // Event Handler 8: onAnalyzeIngredients (AI API call)
  const handleAnalyzeIngredients = async () => {
    if (state.selectedIngredients.length === 0) {
      alert('Please select at least one ingredient');
      return;
    }

    setLoading(true);
    try {
      const ingredientNames = state.selectedIngredients.map(ing => ing.name);
      const response = await aiAPI.analyzeIngredients(ingredientNames);
      setAiAnalysis(response.data.analysis);
    } catch (error) {
      console.error('AI analysis error:', error);
      alert('Failed to analyze ingredients');
    } finally {
      setLoading(false);
    }
  };

  // Event Handler 9: onGenerateDescription (AI API call)
  const handleGenerateDescription = async () => {
    if (!pizzaName || state.selectedIngredients.length === 0) {
      alert('Please provide pizza name and select ingredients');
      return;
    }

    setLoading(true);
    try {
      const ingredientNames = state.selectedIngredients.map(ing => ing.name);
      const response = await aiAPI.generateDescription({
        pizzaName,
        ingredients: ingredientNames,
        category: 'custom',
      });
      setDescription(response.data.description);
    } catch (error) {
      console.error('Generate description error:', error);
      alert('Failed to generate description');
    } finally {
      setLoading(false);
    }
  };

  // Event Handler 10: onSavePizza
  const handleSavePizza = async (e) => {
    e.preventDefault();

    if (!user) {
      alert('Please login to save pizza');
      navigate('/login');
      return;
    }

    if (!pizzaName || state.selectedIngredients.length === 0) {
      alert('Please provide pizza name and select ingredients');
      return;
    }

    setLoading(true);
    try {
      const pizzaData = {
        name: pizzaName,
        description: description || `Custom ${pizzaName} pizza`,
        basePrice: calculateBasePrice(),
        size: state.size,
        category: 'custom',
        ingredients: state.selectedIngredients.map(ing => ({
          ingredient: ing._id,
          quantity: 1,
        })),
      };

      if (editPizzaId) {
        await pizzasAPI.update(editPizzaId, pizzaData);
        alert('Pizza updated successfully!');
      } else {
        await pizzasAPI.create(pizzaData);
        alert('Pizza saved successfully!');
      }

      dispatch({ type: 'RESET' });
      setPizzaName('');
      setDescription('');
      setAiAnalysis('');
      navigate('/menu');
    } catch (error) {
      console.error('Save pizza error:', error);
      alert('Failed to save pizza');
    } finally {
      setLoading(false);
    }
  };

  const calculateBasePrice = () => {
    const sizeMultiplier = {
      small: 0.8,
      medium: 1.0,
      large: 1.3,
      xlarge: 1.6,
    };
    const baseAmount = 10;
    return baseAmount * sizeMultiplier[state.size];
  };

  const calculateTotalPrice = () => {
    let total = calculateBasePrice();
    state.selectedIngredients.forEach(ing => {
      total += ing.price || 0;
    });
    return total;
  };

  return (
    <div className="pizza-customizer">
      <h1>🍕 Build Your Custom Pizza</h1>
      
      <form onSubmit={handleSavePizza} className="customizer-form">
        <div className="form-section">
          <h2>Pizza Details</h2>
          <input
            type="text"
            placeholder="Pizza Name"
            value={pizzaName}
            onChange={(e) => setPizzaName(e.target.value)}
            className="input-field"
            required
          />
          
          <div className="form-row">
            <div className="form-group">
              <label>Size:</label>
              <select value={state.size} onChange={handleSizeChange} className="select-field">
                <option value="small">Small (8")</option>
                <option value="medium">Medium (12")</option>
                <option value="large">Large (14")</option>
                <option value="xlarge">X-Large (16")</option>
              </select>
            </div>

            <div className="form-group">
              <label>Base Sauce:</label>
              <select value={state.base} onChange={handleBaseChange} className="select-field">
                <option value="tomato">Tomato Sauce</option>
                <option value="white">White Sauce</option>
                <option value="pesto">Pesto</option>
                <option value="bbq">BBQ Sauce</option>
              </select>
            </div>
          </div>

          <textarea
            placeholder="Description (or generate with AI)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="textarea-field"
            rows="3"
          />

          <button 
            type="button" 
            onClick={handleGenerateDescription}
            className="btn btn-secondary"
            disabled={loading}
          >
            ✨ Generate Description with AI
          </button>
        </div>

        <div className="form-section">
          <h2>Select Ingredients</h2>
          <div className="category-tabs">
            {['cheese', 'meat', 'vegetable', 'sauce', 'seasoning'].map(cat => (
              <button
                key={cat}
                type="button"
                className={`tab-btn ${category === cat ? 'active' : ''}`}
                onClick={() => setCategory(cat)}
              >
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </button>
            ))}
          </div>

          <div className="ingredients-grid">
            {state.availableIngredients.map(ingredient => {
              const isSelected = state.selectedIngredients.find(
                ing => ing._id === ingredient._id
              );
              return (
                <div
                  key={ingredient._id}
                  className={`ingredient-card ${isSelected ? 'selected' : ''}`}
                  onClick={() => handleIngredientSelect(ingredient)}
                >
                  <div className="ingredient-name">{ingredient.name}</div>
                  <div className="ingredient-price">{formatPrice(ingredient.price)}</div>
                  {isSelected && <div className="checkmark">✓</div>}
                </div>
              );
            })}
          </div>

          {state.selectedIngredients.length > 0 && (
            <>
              <button 
                type="button"
                onClick={handleAnalyzeIngredients}
                className="btn btn-secondary"
                disabled={loading}
              >
                🤖 Analyze Ingredient Combination
              </button>

              {aiAnalysis && (
                <div className="ai-analysis">
                  <h3>AI Analysis:</h3>
                  <div className="markdown-content">
                    <ReactMarkdown>{aiAnalysis}</ReactMarkdown>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        <div className="form-section summary">
          <h2>Pizza Summary</h2>
          <div className="summary-content">
            <p><strong>Size:</strong> {state.size}</p>
            <p><strong>Base:</strong> {state.base}</p>
            <p><strong>Ingredients:</strong> {state.selectedIngredients.length}</p>
            <div className="selected-ingredients">
              {state.selectedIngredients.map(ing => (
                <span key={ing._id} className="ingredient-tag">
                  {ing.name}
                </span>
              ))}
            </div>
            <div className="total-price">
              <strong>Total Price: {formatPrice(calculateTotalPrice())}</strong>
            </div>
          </div>

          <div className="form-actions">
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Saving...' : 'Save Custom Pizza'}
            </button>
            <button 
              type="button" 
              onClick={() => dispatch({ type: 'RESET' })}
              className="btn btn-outline"
            >
              Reset
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default PizzaCustomizer;
