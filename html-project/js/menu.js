// Menu Page Functionality

let currentCategory = 'All';

document.addEventListener('DOMContentLoaded', function() {
    renderMenuItems();
    updateCartDisplay();
});

function filterCategory(category) {
    currentCategory = category;
    
    // Update active button
    document.querySelectorAll('.category-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');
    
    renderMenuItems();
}

function renderMenuItems() {
    const menuGrid = document.getElementById('menu-grid');
    const noItems = document.getElementById('no-items');
    const items = getMenuItemsByCategory(currentCategory);
    
    if (items.length === 0) {
        menuGrid.innerHTML = '';
        noItems.style.display = 'block';
        return;
    }
    
    noItems.style.display = 'none';
    
    menuGrid.innerHTML = items.map(item => `
        <div class=\"menu-item\" data-testid=\"menu-item-${item.id}\">
            ${item.image_url ? `
                <div class=\"menu-item-image\">
                    <img src=\"${item.image_url}\" alt=\"${item.name}\">
                </div>
            ` : ''}
            <div class=\"menu-item-content\">
                <h3>${item.name}</h3>
                <p>${item.description}</p>
                <div class=\"menu-item-footer\">
                    <span class=\"menu-item-price\">₹${item.price}</span>
                    <button 
                        class=\"add-to-cart-btn\" 
                        onclick=\"handleAddToCart('${item.id}')\"
                        data-testid=\"add-to-cart-${item.id}\"
                        ${!item.available ? 'disabled' : ''}
                    >
                        Add to Cart
                    </button>
                </div>
                ${!item.available ? '<p style=\"color: var(--error); font-size: 14px; margin-top: 8px;\">Currently unavailable</p>' : ''}
            </div>
        </div>
    `).join('');
}

function handleAddToCart(itemId) {
    const items = getMenuItems();
    const item = items.find(i => i.id === itemId);
    
    if (item) {
        addToCart(item);
        showToast(`${item.name} added to cart`);
        
        // Update cart count
        const count = getCartCount();
        const cartCountEl = document.getElementById('cart-count');
        cartCountEl.textContent = count;
        cartCountEl.style.display = count > 0 ? 'flex' : 'none';
    }
}
