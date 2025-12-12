import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';

// Components
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import MenuPage from './pages/MenuPage';
import PizzaDetailPage from './pages/PizzaDetailPage';
import PizzaCustomizer from './components/PizzaCustomizer';
import OrdersPage from './pages/OrdersPage';
import OrderTracker from './components/OrderTracker';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import YandexCallbackPage from './pages/YandexCallbackPage';

// Context
import { AuthProvider, useAuth } from './context/AuthContext';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" />;
};

function AppContent() {
  const [timezone, setTimezone] = useState('UTC');

  useEffect(() => {
    // Get user's timezone
    const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    setTimezone(userTimezone);
  }, []);

  return (
    <Router>
      <div className="App">
        <Navbar timezone={timezone} />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/menu" element={<MenuPage />} />
            <Route path="/pizza/:id" element={<PizzaDetailPage />} />
            <Route path="/customize" element={<PizzaCustomizer />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/auth/yandex/callback" element={<YandexCallbackPage />} />
            <Route 
              path="/orders" 
              element={
                <ProtectedRoute>
                  <OrdersPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/track/:orderId" 
              element={
                <ProtectedRoute>
                  <OrderTracker />
                </ProtectedRoute>
              } 
            />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
