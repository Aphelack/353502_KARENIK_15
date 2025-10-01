// Custom JavaScript for Medical Center

document.addEventListener('DOMContentLoaded', function() {
    // Initialize tooltips
    var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });

    // Initialize popovers
    var popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'));
    var popoverList = popoverTriggerList.map(function (popoverTriggerEl) {
        return new bootstrap.Popover(popoverTriggerEl);
    });

    // Cart functionality
    initCartFunctionality();
    
    // Search functionality
    initSearchFunctionality();
    
    // Rating stars
    initRatingStars();
});

// Cart functionality
function initCartFunctionality() {
    // Add to cart buttons
    document.querySelectorAll('.add-to-cart-btn').forEach(function(btn) {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            
            const serviceId = this.dataset.serviceId;
            const url = `/orders/cart/add/${serviceId}/`;
            
            // Show loading state
            const originalText = this.innerHTML;
            this.innerHTML = '<span class="spinner-border spinner-border-sm" role="status"></span> Добавление...';
            this.disabled = true;
            
            fetch(url, {
                method: 'POST',
                headers: {
                    'X-CSRFToken': getCsrfToken(),
                    'X-Requested-With': 'XMLHttpRequest'
                }
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    showToast('success', data.message);
                    updateCartCounter(data.cart_items_count);
                } else {
                    showToast('error', 'Ошибка при добавлении в корзину');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                showToast('error', 'Произошла ошибка');
            })
            .finally(() => {
                // Restore button state
                this.innerHTML = originalText;
                this.disabled = false;
            });
        });
    });

    // Update cart quantity
    document.querySelectorAll('.cart-quantity-input').forEach(function(input) {
        input.addEventListener('change', function() {
            updateCartItemQuantity(this.dataset.itemId, this.value);
        });
    });

    // Remove from cart
    document.querySelectorAll('.remove-from-cart-btn').forEach(function(btn) {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            
            if (confirm('Удалить товар из корзины?')) {
                removeFromCart(this.dataset.itemId);
            }
        });
    });
}

// Update cart item quantity
function updateCartItemQuantity(itemId, quantity) {
    const url = `/orders/cart/update/${itemId}/`;
    
    fetch(url, {
        method: 'POST',
        headers: {
            'X-CSRFToken': getCsrfToken(),
            'X-Requested-With': 'XMLHttpRequest',
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: `quantity=${quantity}`
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            updateCartCounter(data.cart_items_count);
            // Update total price in UI
            location.reload(); // Simple reload for now
        }
    })
    .catch(error => {
        console.error('Error:', error);
        showToast('error', 'Ошибка при обновлении корзины');
    });
}

// Remove from cart
function removeFromCart(itemId) {
    const url = `/orders/cart/remove/${itemId}/`;
    
    fetch(url, {
        method: 'POST',
        headers: {
            'X-CSRFToken': getCsrfToken(),
            'X-Requested-With': 'XMLHttpRequest'
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            showToast('success', data.message);
            updateCartCounter(data.cart_items_count);
            // Remove item from DOM
            const itemRow = document.querySelector(`[data-item-id="${itemId}"]`).closest('tr');
            if (itemRow) {
                itemRow.remove();
            }
        }
    })
    .catch(error => {
        console.error('Error:', error);
        showToast('error', 'Ошибка при удалении из корзины');
    });
}

// Update cart counter in navigation
function updateCartCounter(count) {
    const counter = document.querySelector('.cart-counter');
    if (counter) {
        if (count > 0) {
            counter.textContent = count;
            counter.style.display = 'inline';
        } else {
            counter.style.display = 'none';
        }
    }
}

// Search functionality
function initSearchFunctionality() {
    const searchInput = document.querySelector('#search-input');
    if (searchInput) {
        let searchTimeout;
        
        searchInput.addEventListener('input', function() {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                if (this.value.length >= 3 || this.value.length === 0) {
                    performSearch(this.value);
                }
            }, 300);
        });
    }
}

// Perform search
function performSearch(query) {
    // This would typically make an AJAX request to search endpoint
    console.log('Searching for:', query);
    // Implementation depends on specific search requirements
}

// Rating stars functionality
function initRatingStars() {
    document.querySelectorAll('.rating-input').forEach(function(container) {
        const stars = container.querySelectorAll('.star');
        const input = container.querySelector('input[type="hidden"]');
        
        stars.forEach(function(star, index) {
            star.addEventListener('click', function() {
                const rating = index + 1;
                input.value = rating;
                
                // Update visual state
                stars.forEach(function(s, i) {
                    if (i < rating) {
                        s.classList.remove('bi-star');
                        s.classList.add('bi-star-fill');
                    } else {
                        s.classList.remove('bi-star-fill');
                        s.classList.add('bi-star');
                    }
                });
            });
            
            star.addEventListener('mouseenter', function() {
                const rating = index + 1;
                
                // Update visual state on hover
                stars.forEach(function(s, i) {
                    if (i < rating) {
                        s.classList.add('text-warning');
                    } else {
                        s.classList.remove('text-warning');
                    }
                });
            });
        });
        
        container.addEventListener('mouseleave', function() {
            stars.forEach(function(s) {
                s.classList.remove('text-warning');
            });
        });
    });
}

// Show toast notification
function showToast(type, message) {
    // Create toast element
    const toastContainer = document.querySelector('.toast-container') || createToastContainer();
    
    const toastId = 'toast-' + Date.now();
    const toastClass = type === 'success' ? 'bg-success' : 'bg-danger';
    
    const toastHtml = `
        <div id="${toastId}" class="toast ${toastClass} text-white" role="alert">
            <div class="toast-header">
                <strong class="me-auto">${type === 'success' ? 'Успешно' : 'Ошибка'}</strong>
                <button type="button" class="btn-close btn-close-white" data-bs-dismiss="toast"></button>
            </div>
            <div class="toast-body">
                ${message}
            </div>
        </div>
    `;
    
    toastContainer.insertAdjacentHTML('beforeend', toastHtml);
    
    const toastEl = document.getElementById(toastId);
    const toast = new bootstrap.Toast(toastEl);
    toast.show();
    
    // Remove toast after it's hidden
    toastEl.addEventListener('hidden.bs.toast', function() {
        toastEl.remove();
    });
}

// Create toast container if it doesn't exist
function createToastContainer() {
    const container = document.createElement('div');
    container.className = 'toast-container position-fixed top-0 end-0 p-3';
    container.style.zIndex = '9999';
    document.body.appendChild(container);
    return container;
}

// Get CSRF token
function getCsrfToken() {
    const tokenElement = document.querySelector('[name=csrfmiddlewaretoken]');
    return tokenElement ? tokenElement.value : '';
}

// Smooth scroll to anchor links
document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});

// Auto-hide alerts after 5 seconds
document.querySelectorAll('.alert').forEach(function(alert) {
    setTimeout(function() {
        const bsAlert = new bootstrap.Alert(alert);
        bsAlert.close();
    }, 5000);
});