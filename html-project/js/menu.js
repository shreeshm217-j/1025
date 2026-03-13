// Menu Page Functionality

let currentCategory = 'All';

document.addEventListener('DOMContentLoaded', function() {
    loadCategoryButtons();
    renderMenuItems();
    updateCartDisplay();
});

function loadCategoryButtons() {
    const categories = getCategories();
    const filterDiv = document.getElementById('category-filter');
    
    // Create All button
    let buttonsHTML = '<button class="category-btn active" data-category="All" onclick="filterCategory(\'All\')" data-testid="category-all">All</button>';
    
    // Add category buttons
    buttonsHTML += categories.map(cat => 
        `<button class="category-btn" data-category="${cat.name}" onclick="filterCategory('${cat.name}')" data-testid="category-${cat.name.toLowerCase().replace(/ /g, '-')}">${cat.name}</button>`
    ).join('');
    
    filterDiv.innerHTML = buttonsHTML;
}

function filterCategory(category) {
    currentCategory = category;
    
    // Update active button
    document.querySelectorAll('.category-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector(`[data-category="${category}"]`).classList.add('active');
    
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
    
    menuGrid.innerHTML = items.map(item => {
        // Get sizes
        const sizes = item.sizes || [];
        const hasMultipleSizes = sizes.length > 1;
        
        return `
        <div class="menu-item" data-testid="menu-item-${item.id}">
            ${item.image_url ? `
                <div class="menu-item-image">
                    <img src="${item.image_url}" alt="${item.name}">
                </div>
            ` : ''}
            <div class="menu-item-content">
                <h3>${item.name}</h3>
                <p>${item.description}</p>
                
                ${hasMultipleSizes ? `
                    <div class="size-options" id="sizes-${item.id}">
                        ${sizes.map((size, idx) => `
                            <label class="size-option">
                                <input type="radio" name="size-${item.id}" value="${idx}" ${idx === 0 ? 'checked' : ''}>
                                <span class="size-label">${size.name}</span>
                                <span class="size-price">₹${size.price}</span>
                            </label>
                        `).join('')}
                    </div>
                ` : sizes.length === 1 ? `
                    <div class="menu-item-footer">
                        <span class="menu-item-price">₹${sizes[0].price}</span>
                    </div>
                ` : ''}
                
                <button 
                    class="add-to-cart-btn" 
                    onclick="handleAddToCart('${item.id}')"
                    data-testid="add-to-cart-${item.id}"
                    ${!item.available ? 'disabled' : ''}
                    style="${hasMultipleSizes ? 'margin-top: 12px;' : ''}"
                >
                    Add to Cart
                </button>
                
                ${!item.available ? '<p style="color: var(--error); font-size: 14px; margin-top: 8px;">Currently unavailable</p>' : ''}
            </div>
        </div>
    `;
    }).join('');
}

function handleAddToCart(itemId) {
    const items = getMenuItems();
    const item = items.find(i => i.id === itemId);
    
    if (item) {
        // Get selected size
        const sizeRadios = document.querySelectorAll(`input[name="size-${itemId}"]`);
        let selectedSizeIndex = 0;
        
        sizeRadios.forEach((radio, idx) => {
            if (radio.checked) {
                selectedSizeIndex = idx;
            }
        });
        
        const selectedSize = item.sizes[selectedSizeIndex];
        
        // Create cart item with size info
        const cartItem = {
            ...item,
            selectedSize: selectedSize.name,
            price: selectedSize.price,
            cartItemId: `${item.id}-${selectedSize.name}` // Unique ID for cart
        };
        
        addToCartWithSize(cartItem);
        showToast(`${item.name} (${selectedSize.name}) added to cart`);
        
        // Update cart count
        const count = getCartCount();
        const cartCountEl = document.getElementById('cart-count');
        cartCountEl.textContent = count;
        cartCountEl.style.display = count > 0 ? 'flex' : 'none';
    }
}

// Modified addToCart to handle sizes
function addToCartWithSize(item) {
    const cart = getCart();
    const existing = cart.find(i => i.cartItemId === item.cartItemId);
    
    if (existing) {
        existing.quantity += 1;
    } else {
        cart.push({ ...item, quantity: 1 });
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
}
