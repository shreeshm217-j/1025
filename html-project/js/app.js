// Shared App Utilities

// WhatsApp Order Functions
function orderWhatsApp() {
    const message = 'Hello DK Pizza Cafe, I want to order...';
    const phoneNumber = '919956407087';
    window.open(`https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`, '_blank');
}

// Toast Notification
function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    if (!toast) return;
    
    toast.textContent = message;
    toast.className = `toast ${type}`;
    
    // Trigger reflow
    void toast.offsetWidth;
    
    toast.classList.add('show');
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// Load Settings on Homepage
if (window.location.pathname.endsWith('index.html') || window.location.pathname === '/') {
    document.addEventListener('DOMContentLoaded', function() {
        const settings = getSettings();
        
        // Update hero section
        if (document.getElementById('hero-rating')) {
            document.getElementById('hero-rating').textContent = settings.rating || '4.9';
        }
        if (document.getElementById('hero-reviews')) {
            document.getElementById('hero-reviews').textContent = settings.total_reviews || '67';
        }
        
        // Update about section
        if (document.getElementById('opening-hours')) {
            document.getElementById('opening-hours').textContent = settings.opening_hours;
        }
        if (document.getElementById('phone-number')) {
            document.getElementById('phone-number').textContent = settings.phone;
        }
        if (document.getElementById('address')) {
            document.getElementById('address').textContent = settings.address;
        }
        
        // Update reviews section
        if (document.getElementById('overall-rating')) {
            document.getElementById('overall-rating').textContent = settings.rating || '4.9';
        }
        if (document.getElementById('total-reviews')) {
            document.getElementById('total-reviews').textContent = settings.total_reviews || '67';
        }
        
        // Update footer
        if (document.getElementById('footer-price-range')) {
            document.getElementById('footer-price-range').textContent = settings.price_range + ' per person';
        }
        if (document.getElementById('footer-phone')) {
            document.getElementById('footer-phone').textContent = settings.phone;
        }
        if (document.getElementById('footer-hours')) {
            document.getElementById('footer-hours').textContent = settings.opening_hours;
        }
        if (document.getElementById('footer-address')) {
            document.getElementById('footer-address').textContent = settings.address;
        }
    });
}

// Cart Management (shared across pages)
function toggleCart() {
    const overlay = document.getElementById('cart-overlay');
    const sidebar = document.getElementById('cart-sidebar');
    
    if (sidebar && overlay) {
        sidebar.classList.toggle('active');
        overlay.classList.toggle('active');
        
        if (sidebar.classList.contains('active')) {
            updateCartDisplay();
        }
    }
}

function updateCartDisplay() {
    const cart = getCart();
    const cartItemsContainer = document.getElementById('cart-items');
    const cartEmpty = document.getElementById('cart-empty');
    const cartFooter = document.getElementById('cart-footer');
    const cartTotal = document.getElementById('cart-total');
    const cartCount = document.getElementById('cart-count');
    
    // Update cart count badge
    if (cartCount) {
        const count = getCartCount();
        cartCount.textContent = count;
        cartCount.style.display = count > 0 ? 'flex' : 'none';
    }
    
    if (!cartItemsContainer) return;
    
    if (cart.length === 0) {
        cartEmpty.style.display = 'block';
        cartItemsContainer.innerHTML = '';
        if (cartFooter) cartFooter.style.display = 'none';
    } else {
        cartEmpty.style.display = 'none';
        if (cartFooter) cartFooter.style.display = 'block';
        
        cartItemsContainer.innerHTML = cart.map(item => {
            const itemId = item.cartItemId || item.id;
            const sizeInfo = item.selectedSize ? ` (${item.selectedSize})` : '';
            return `
            <div class=\"cart-item\" data-testid=\"cart-item-${itemId}\">
                <div class=\"cart-item-header\">
                    <div>
                        <h3>${item.name}${sizeInfo}</h3>
                        <div class=\"cart-item-price\">₹${item.price}</div>
                    </div>
                    <button class=\"remove-btn\" onclick=\"handleRemoveFromCart('${itemId}')\" data-testid=\"remove-item-${itemId}\">
                        🗑️
                    </button>
                </div>
                <div class=\"cart-item-controls\">
                    <button class=\"qty-btn\" onclick=\"handleDecreaseQty('${itemId}')\" data-testid=\"decrease-qty-${itemId}\">−</button>
                    <span class=\"qty-display\">${item.quantity}</span>
                    <button class=\"qty-btn\" onclick=\"handleIncreaseQty('${itemId}')\" data-testid=\"increase-qty-${itemId}\">+</button>
                    <span class=\"cart-item-total\">₹${item.price * item.quantity}</span>
                </div>
            </div>
        `;
        }).join('');
        
        if (cartTotal) {
            cartTotal.textContent = '₹' + getCartTotal();
        }
    }
}

function handleDecreaseQty(itemId) {
    const cart = getCart();
    const item = cart.find(i => (i.cartItemId || i.id) === itemId);
    if (item) {
        updateCartQuantity(itemId, item.quantity - 1);
        updateCartDisplay();
    }
}

function handleIncreaseQty(itemId) {
    const cart = getCart();
    const item = cart.find(i => (i.cartItemId || i.id) === itemId);
    if (item) {
        updateCartQuantity(itemId, item.quantity + 1);
        updateCartDisplay();
    }
}

function handleRemoveFromCart(itemId) {
    removeFromCart(itemId);
    updateCartDisplay();
}

function orderFromCart() {
    const cart = getCart();
    if (cart.length === 0) {
        showToast('Your cart is empty', 'error');
        return;
    }
    
    const orderText = cart.map(item => `- ${item.name} x${item.quantity} (₹${item.price * item.quantity})`).join('\\n');
    const total = getCartTotal();
    const message = `Hello DK Pizza Cafe,\\n\\nI want to order:\\n${orderText}\\n\\nTotal: ₹${total}\\n\\nPlease confirm the order.`;
    
    // Save order
    addOrder({
        items: cart,
        total: total
    });
    
    // Open WhatsApp
    const phoneNumber = '919956407087';
    window.open(`https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`, '_blank');
    
    // Clear cart
    clearCart();
    updateCartDisplay();
    toggleCart();
    showToast('Order sent to WhatsApp!');
}

// Initialize cart display on page load
document.addEventListener('DOMContentLoaded', function() {
    if (document.getElementById('cart-count')) {
        const count = getCartCount();
        const cartCountEl = document.getElementById('cart-count');
        cartCountEl.textContent = count;
        cartCountEl.style.display = count > 0 ? 'flex' : 'none';
    }
});
