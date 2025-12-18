import axios from 'axios';

const API_URL = '/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Pizzas API
export const pizzasAPI = {
  getAll: (params) => api.get('/pizzas', { params }),
  getById: (id) => api.get(`/pizzas/${id}`),
  create: (data) => api.post('/pizzas', data),
  update: (id, data) => api.put(`/pizzas/${id}`, data),
  delete: (id) => api.delete(`/pizzas/${id}`),
};

// Orders API
export const ordersAPI = {
  getAll: (params) => api.get('/orders', { params }),
  getById: (id) => api.get(`/orders/${id}`),
  create: (data) => api.post('/orders', data),
  updateStatus: (id, status, courierLocation) => 
    api.patch(`/orders/${id}/status`, { status, courierLocation }),
  cancel: (id) => api.delete(`/orders/${id}`),
};

// Ingredients API
export const ingredientsAPI = {
  getAll: (params) => api.get('/ingredients', { params }),
  getById: (id) => api.get(`/ingredients/${id}`),
  create: (data) => api.post('/ingredients', data),
  update: (id, data) => api.put(`/ingredients/${id}`, data),
  delete: (id) => api.delete(`/ingredients/${id}`),
};

// AI API
export const aiAPI = {
  recommendRecipe: (data) => api.post('/ai/recommend-recipe', data),
  analyzeIngredients: (ingredients) => api.post('/ai/analyze-ingredients', { ingredients }),
  generateDescription: (data) => api.post('/ai/generate-description', data),
  getDietarySuggestions: (data) => api.post('/ai/dietary-suggestions', data),
  chat: (message, context) => api.post('/ai/chat', { message, context }),
  recognizeIngredients: (imageFile) => {
    const formData = new FormData();
    formData.append('image', imageFile);
    return api.post('/ai/recognize-ingredients', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },
};

// Auth API
export const authAPI = {
  login: (email, password) => api.post('/auth/login', { email, password }),
  register: (data) => api.post('/auth/register', data),
  getYandexUrl: () => api.get('/auth/yandex/url'),
  yandexCallback: (code, timezone) => api.post('/auth/yandex/callback', { code, timezone }),
  yandexConfirm: (userData, timezone) => api.post('/auth/yandex/confirm', { userData, timezone }),
  getMe: () => api.get('/auth/me'),
};

export default api;
