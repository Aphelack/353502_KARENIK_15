import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ordersAPI } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { 
  formatPrice, 
  formatDateForTimezone, 
  getOrderStatusColor, 
  getOrderStatusText 
} from '../utils/helpers';
import './OrdersPage.css';

function OrdersPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    loadOrders();
  }, [filter]);

  const loadOrders = async () => {
    setLoading(true);
    try {
      const params = {};
      if (filter !== 'all') {
        params.status = filter;
      }
      
      const response = await ordersAPI.getAll(params);
      setOrders(response.data.orders);
    } catch (error) {
      console.error('Load orders error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Event Handler 21: onFilterChange
  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
  };

  // Event Handler 22: onCancelOrder
  const handleCancelOrder = async (orderId) => {
    if (!window.confirm('Are you sure you want to cancel this order?')) {
      return;
    }

    try {
      await ordersAPI.cancel(orderId);
      alert('Order cancelled successfully');
      loadOrders();
    } catch (error) {
      console.error('Cancel order error:', error);
      alert(error.response?.data?.message || 'Failed to cancel order');
    }
  };

  if (loading) {
    return <div className="loading">Loading orders...</div>;
  }

  return (
    <div className="orders-page">
      <div className="orders-header">
        <h1>My Orders</h1>
        <p>Track and manage your pizza orders</p>
      </div>

      <div className="orders-filters">
        <button 
          className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
          onClick={() => handleFilterChange('all')}
        >
          All Orders
        </button>
        <button 
          className={`filter-btn ${filter === 'pending' ? 'active' : ''}`}
          onClick={() => handleFilterChange('pending')}
        >
          Pending
        </button>
        <button 
          className={`filter-btn ${filter === 'confirmed' ? 'active' : ''}`}
          onClick={() => handleFilterChange('confirmed')}
        >
          Confirmed
        </button>
        <button 
          className={`filter-btn ${filter === 'delivering' ? 'active' : ''}`}
          onClick={() => handleFilterChange('delivering')}
        >
          In Delivery
        </button>
        <button 
          className={`filter-btn ${filter === 'delivered' ? 'active' : ''}`}
          onClick={() => handleFilterChange('delivered')}
        >
          Delivered
        </button>
      </div>

      {orders.length === 0 ? (
        <div className="no-orders">
          <h2>No orders found</h2>
          <p>Start by ordering your favorite pizza!</p>
          <Link to="/menu" className="btn btn-primary">
            Browse Menu
          </Link>
        </div>
      ) : (
        <div className="orders-list">
          {orders.map(order => (
            <div key={order._id} className="order-card">
              <div className="order-card-header">
                <div>
                  <h3>Order #{order.orderNumber}</h3>
                  <span className="order-date">
                    {formatDateForTimezone(order.createdAt, user?.timezone || 'UTC')}
                  </span>
                </div>
                <div 
                  className="order-status"
                  style={{ backgroundColor: getOrderStatusColor(order.status) }}
                >
                  {getOrderStatusText(order.status)}
                </div>
              </div>

              <div className="order-items">
                {order.items.map((item, idx) => (
                  <div key={idx} className="order-item">
                    <span>{item.pizza?.name || 'Pizza'}</span>
                    <span>x{item.quantity}</span>
                    <span>{formatPrice(item.price * item.quantity)}</span>
                  </div>
                ))}
              </div>

              <div className="order-card-footer">
                <div className="order-total">
                  <strong>Total:</strong>
                  <strong>{formatPrice(order.totalPrice)}</strong>
                </div>

                <div className="order-actions">
                  <Link 
                    to={`/track/${order._id}`}
                    className="btn btn-sm btn-primary"
                  >
                    Track Order
                  </Link>
                  
                  {['pending', 'confirmed'].includes(order.status) && (
                    <button 
                      onClick={() => handleCancelOrder(order._id)}
                      className="btn btn-sm btn-danger"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </div>

              {order.estimatedDeliveryTime && order.status !== 'delivered' && (
                <div className="order-eta">
                  ⏱️ Est. Delivery: {formatDateForTimezone(order.estimatedDeliveryTime, user?.timezone || 'UTC')}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default OrdersPage;
