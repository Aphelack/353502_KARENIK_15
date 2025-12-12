import React, { Component } from 'react';
import { ordersAPI } from '../utils/api';
import { 
  formatDateForTimezone, 
  formatDateUTC, 
  getOrderStatusColor, 
  getOrderStatusText,
  formatPrice 
} from '../utils/helpers';
import './OrderTracker.css';

// Class Component with lifecycle methods
class OrderTracker extends Component {
  constructor(props) {
    super(props);
    this.state = {
      order: null,
      loading: true,
      error: null,
      countdown: null,
      autoRefreshEnabled: true,
      refreshInterval: null,
    };

    // Bind methods
    this.loadOrder = this.loadOrder.bind(this);
    this.startAutoRefresh = this.startAutoRefresh.bind(this);
    this.stopAutoRefresh = this.stopAutoRefresh.bind(this);
    this.handleRefresh = this.handleRefresh.bind(this);
    this.handleToggleAutoRefresh = this.handleToggleAutoRefresh.bind(this);
  }

  componentDidMount() {
    this.loadOrder();
    this.startAutoRefresh();
    this.startCountdown();
  }

  componentWillUnmount() {
    this.stopAutoRefresh();
    if (this.countdownInterval) {
      clearInterval(this.countdownInterval);
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.order !== this.state.order && this.state.order) {
      console.log('Order updated:', this.state.order.status);
    }
  }

  async loadOrder() {
    try {
      const orderId = window.location.pathname.split('/').pop();
      const response = await ordersAPI.getById(orderId);
      this.setState({ order: response.data.order, loading: false, error: null });
    } catch (error) {
      console.error('Load order error:', error);
      this.setState({ 
        error: error.response?.data?.message || 'Failed to load order', 
        loading: false 
      });
    }
  }

  startAutoRefresh() {
    if (this.state.autoRefreshEnabled) {
      const interval = setInterval(() => {
        this.loadOrder();
      }, 10000); // Refresh every 10 seconds
      this.setState({ refreshInterval: interval });
    }
  }

  stopAutoRefresh() {
    if (this.state.refreshInterval) {
      clearInterval(this.state.refreshInterval);
      this.setState({ refreshInterval: null });
    }
  }

  startCountdown() {
    this.countdownInterval = setInterval(() => {
      if (this.state.order && this.state.order.estimatedDeliveryTime) {
        const now = new Date().getTime();
        const delivery = new Date(this.state.order.estimatedDeliveryTime).getTime();
        const distance = delivery - now;

        if (distance > 0) {
          const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
          const seconds = Math.floor((distance % (1000 * 60)) / 1000);
          this.setState({ countdown: `${minutes}m ${seconds}s` });
        } else {
          this.setState({ countdown: 'Should arrive any moment!' });
        }
      }
    }, 1000);
  }

  // Event Handler 11: onRefresh
  handleRefresh() {
    this.setState({ loading: true });
    this.loadOrder();
  }

  // Event Handler 12: onToggleAutoRefresh
  handleToggleAutoRefresh() {
    this.setState(
      prevState => ({ autoRefreshEnabled: !prevState.autoRefreshEnabled }),
      () => {
        if (this.state.autoRefreshEnabled) {
          this.startAutoRefresh();
        } else {
          this.stopAutoRefresh();
        }
      }
    );
  }

  render() {
    const { order, loading, error, countdown, autoRefreshEnabled } = this.state;

    if (loading && !order) {
      return <div className="loading">Loading order details...</div>;
    }

    if (error) {
      return <div className="error">{error}</div>;
    }

    if (!order) {
      return <div className="error">Order not found</div>;
    }

    const timezone = order.user?.timezone || 'UTC';

    return (
      <div className="order-tracker">
        <div className="tracker-header">
          <h1>🚚 Order Tracking</h1>
          <div className="tracker-controls">
            <button onClick={this.handleRefresh} className="btn-refresh">
              🔄 Refresh
            </button>
            <label className="auto-refresh-toggle">
              <input
                type="checkbox"
                checked={autoRefreshEnabled}
                onChange={this.handleToggleAutoRefresh}
              />
              Auto-refresh (10s)
            </label>
          </div>
        </div>

        <div className="order-info-card">
          <div className="order-header">
            <h2>Order #{order.orderNumber}</h2>
            <div 
              className="order-status-badge"
              style={{ backgroundColor: getOrderStatusColor(order.status) }}
            >
              {getOrderStatusText(order.status)}
            </div>
          </div>

          {countdown && order.status !== 'delivered' && order.status !== 'cancelled' && (
            <div className="countdown-banner">
              ⏱️ Estimated arrival: <strong>{countdown}</strong>
            </div>
          )}

          <div className="order-timeline">
            <div className={`timeline-step ${['confirmed', 'preparing', 'baking', 'ready', 'delivering', 'delivered'].includes(order.status) ? 'completed' : ''}`}>
              <div className="timeline-icon">✓</div>
              <div className="timeline-content">
                <h3>Order Confirmed</h3>
                <p>Your order has been received</p>
              </div>
            </div>

            <div className={`timeline-step ${['preparing', 'baking', 'ready', 'delivering', 'delivered'].includes(order.status) ? 'completed' : ''}`}>
              <div className="timeline-icon">🍕</div>
              <div className="timeline-content">
                <h3>Preparing</h3>
                <p>We're gathering fresh ingredients</p>
              </div>
            </div>

            <div className={`timeline-step ${['baking', 'ready', 'delivering', 'delivered'].includes(order.status) ? 'completed' : ''}`}>
              <div className="timeline-icon">🔥</div>
              <div className="timeline-content">
                <h3>Baking</h3>
                <p>Your pizza is in the oven</p>
              </div>
            </div>

            <div className={`timeline-step ${['delivering', 'delivered'].includes(order.status) ? 'completed' : ''}`}>
              <div className="timeline-icon">🚗</div>
              <div className="timeline-content">
                <h3>Out for Delivery</h3>
                <p>On the way to you</p>
                {order.courierLocation && (
                  <small>
                    Last update: {formatDateForTimezone(order.courierLocation.lastUpdate, timezone)}
                  </small>
                )}
              </div>
            </div>

            <div className={`timeline-step ${order.status === 'delivered' ? 'completed' : ''}`}>
              <div className="timeline-icon">🎉</div>
              <div className="timeline-content">
                <h3>Delivered</h3>
                <p>Enjoy your meal!</p>
              </div>
            </div>
          </div>

          <div className="order-details">
            <h3>Order Items</h3>
            <div className="order-items">
              {order.items.map((item, index) => (
                <div key={index} className="order-item">
                  <div className="item-info">
                    <span className="item-name">{item.pizza?.name || 'Pizza'}</span>
                    <span className="item-quantity">x{item.quantity}</span>
                  </div>
                  <span className="item-price">{formatPrice(item.price * item.quantity)}</span>
                </div>
              ))}
            </div>
            <div className="order-total">
              <strong>Total:</strong>
              <strong>{formatPrice(order.totalPrice)}</strong>
            </div>
          </div>

          <div className="order-metadata">
            <div className="metadata-section">
              <h3>Delivery Address</h3>
              <p>{order.deliveryAddress.street}</p>
              <p>{order.deliveryAddress.city}, {order.deliveryAddress.zipCode}</p>
              <p>📞 {order.deliveryAddress.phone}</p>
            </div>

            <div className="metadata-section">
              <h3>Time Information</h3>
              <p><strong>Your Timezone:</strong> {timezone}</p>
              <p><strong>Ordered at:</strong> {formatDateForTimezone(order.createdAt, timezone)}</p>
              <p><strong>Ordered at (UTC):</strong> {formatDateUTC(order.createdAt)}</p>
              {order.estimatedDeliveryTime && (
                <>
                  <p><strong>Est. Delivery:</strong> {formatDateForTimezone(order.estimatedDeliveryTime, timezone)}</p>
                  <p><strong>Est. Delivery (UTC):</strong> {formatDateUTC(order.estimatedDeliveryTime)}</p>
                </>
              )}
              {order.actualDeliveryTime && (
                <>
                  <p><strong>Delivered at:</strong> {formatDateForTimezone(order.actualDeliveryTime, timezone)}</p>
                  <p><strong>Delivered at (UTC):</strong> {formatDateUTC(order.actualDeliveryTime)}</p>
                </>
              )}
            </div>
          </div>

          {order.notes && (
            <div className="order-notes">
              <h3>Notes</h3>
              <p>{order.notes}</p>
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default OrderTracker;
