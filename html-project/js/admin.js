// Admin Dashboard Functionality

let currentTab = 'menu';
let editingItemId = null;
let editingCategoryId = null;

// Check if user is logged in with session validation
document.addEventListener('DOMContentLoaded', function() {
    const isLoggedIn = localStorage.getItem('isAdminLoggedIn');
    const loginTimestamp = localStorage.getItem('loginTimestamp');
    
    // Check if logged in
    if (!isLoggedIn) {
        window.location.href = 'admin-login.html';
        return;
    }
    
    // Check session expiry (24 hours)
    if (loginTimestamp) {
        const loginTime = new Date(loginTimestamp);
        const now = new Date();
        const hoursDiff = (now - loginTime) / (1000 * 60 * 60);
        
        if (hoursDiff > 24) {
            // Session expired
            logout();
            return;
        }
    }
    
    loadMenuItems();
    loadCategories();
    loadGalleryImages();
    loadOrders();
    loadSettings();
});

function logout() {
    localStorage.removeItem('isAdminLoggedIn');
    localStorage.removeItem('adminUsername');
    localStorage.removeItem('loginTimestamp');
    showToast('Logged out successfully');
    setTimeout(() => {
        window.location.href = 'index.html';
    }, 1000);
}

// Tab Switching
function switchTab(tab) {
    currentTab = tab;
    
    // Update active tab button
    document.querySelectorAll('.admin-tab').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector(`[data-testid="tab-${tab}"]`).classList.add('active');
    
    // Show/hide tab content
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
    });
    document.getElementById(`${tab}-tab`).classList.add('active');
    
    // Refresh content
    if (tab === 'menu') {
        loadMenuItems();
    } else if (tab === 'categories') {
        loadCategories();
    } else if (tab === 'gallery') {
        loadGalleryImages();
    } else if (tab === 'orders') {
        loadOrders();
    } else if (tab === 'settings') {
        loadSettings();
    }
}

// Menu Management
function loadMenuItems() {
    const items = getMenuItems();
    const grid = document.getElementById('admin-menu-grid');
    
    grid.innerHTML = items.map(item => {
        const priceDisplay = item.sizes && item.sizes.length > 0 
            ? item.sizes.map(s => `${s.name}: ₹${s.price}`).join(', ')
            : 'No sizes';
            
        return `
        <div class="admin-menu-item" data-testid="admin-menu-item-${item.id}">
            ${item.image_url ? `
                <div class="admin-item-image">
                    <img src="${item.image_url}" alt="${item.name}">
                </div>
            ` : ''}
            <div class="admin-item-content">
                <div class="admin-item-header">
                    <h3>${item.name}</h3>
                </div>
                <p>${item.description}</p>
                <div class="category-tag">${item.category}</div>
                <div class="sizes-display">${priceDisplay}</div>
                <div class="admin-item-actions">
                    <button 
                        class="btn btn-outline btn-sm" 
                        onclick="openEditItemModal('${item.id}')"
                        data-testid="edit-item-${item.id}"
                    >
                        ✏️ Edit
                    </button>
                    <button 
                        class="btn btn-outline btn-sm" 
                        onclick="handleDeleteItem('${item.id}')"
                        data-testid="delete-item-${item.id}"
                        style="border-color: var(--error); color: var(--error);"
                    >
                        🗑️ Delete
                    </button>
                </div>
            </div>
        </div>
    `;
    }).join('');
}

function loadCategoriesIntoSelect() {
    const categories = getCategories();
    const select = document.getElementById('item-category');
    if (select) {
        select.innerHTML = categories.map(cat => 
            `<option value="${cat.name}">${cat.name}</option>`
        ).join('');
    }
}

function addSizeField(name = '', price = '') {
    const container = document.getElementById('sizes-container');
    const sizeId = 'size-' + Date.now();
    
    const sizeDiv = document.createElement('div');
    sizeDiv.className = 'size-field';
    sizeDiv.id = sizeId;
    sizeDiv.innerHTML = `
        <div class="form-row" style="gap: 8px; align-items: flex-end;">
            <div class="form-group" style="flex: 1; margin-bottom: 0;">
                <input type="text" class="size-name" placeholder="Size (e.g., Small, Medium, Large)" value="${name}" required>
            </div>
            <div class="form-group" style="flex: 1; margin-bottom: 0;">
                <input type="number" class="size-price" placeholder="Price" step="0.01" value="${price}" required>
            </div>
            <button type="button" class="btn btn-outline btn-sm" onclick="removeSizeField('${sizeId}')" style="border-color: var(--error); color: var(--error);">
                🗑️
            </button>
        </div>
    `;
    
    container.appendChild(sizeDiv);
}

function removeSizeField(sizeId) {
    const field = document.getElementById(sizeId);
    if (field) {
        field.remove();
    }
}

function openAddItemModal() {
    editingItemId = null;
    document.getElementById('modal-title').textContent = 'Add Menu Item';
    document.getElementById('item-form').reset();
    document.getElementById('sizes-container').innerHTML = '';
    loadCategoriesIntoSelect();
    
    // Add default size field
    addSizeField('Regular', '');
    
    document.getElementById('item-modal').classList.add('active');
}

function openEditItemModal(itemId) {
    editingItemId = itemId;
    const items = getMenuItems();
    const item = items.find(i => i.id === itemId);
    
    if (item) {
        document.getElementById('modal-title').textContent = 'Edit Menu Item';
        document.getElementById('item-name').value = item.name;
        document.getElementById('item-description').value = item.description;
        document.getElementById('item-image').value = item.image_url || '';
        
        loadCategoriesIntoSelect();
        document.getElementById('item-category').value = item.category;
        
        // Load sizes
        const sizesContainer = document.getElementById('sizes-container');
        sizesContainer.innerHTML = '';
        if (item.sizes && item.sizes.length > 0) {
            item.sizes.forEach(size => {
                addSizeField(size.name, size.price);
            });
        } else {
            addSizeField('Regular', '');
        }
        
        document.getElementById('item-modal').classList.add('active');
    }
}

function closeItemModal() {
    document.getElementById('item-modal').classList.remove('active');
    editingItemId = null;
}

function saveItem(event) {
    event.preventDefault();
    
    // Collect sizes
    const sizeFields = document.querySelectorAll('.size-field');
    const sizes = [];
    sizeFields.forEach(field => {
        const name = field.querySelector('.size-name').value;
        const price = parseFloat(field.querySelector('.size-price').value);
        if (name && price) {
            sizes.push({ name, price });
        }
    });
    
    if (sizes.length === 0) {
        showToast('Please add at least one size', 'error');
        return;
    }
    
    const itemData = {
        name: document.getElementById('item-name').value,
        description: document.getElementById('item-description').value,
        category: document.getElementById('item-category').value,
        image_url: document.getElementById('item-image').value,
        available: true,
        sizes: sizes
    };
    
    if (editingItemId) {
        updateMenuItem(editingItemId, itemData);
        showToast('Item updated successfully');
    } else {
        addMenuItem(itemData);
        showToast('Item added successfully');
    }
    
    closeItemModal();
    loadMenuItems();
}

function handleDeleteItem(itemId) {
    if (confirm('Are you sure you want to delete this item?')) {
        deleteMenuItem(itemId);
        showToast('Item deleted successfully');
        loadMenuItems();
    }
}

// Category Management
function loadCategories() {
    const categories = getCategories();
    const list = document.getElementById('categories-list');
    
    if (!list) return;
    
    list.innerHTML = categories.map(cat => `
        <div class="category-item" data-testid="category-${cat.id}">
            <div class="category-info">
                <h3>${cat.name}</h3>
                <p class="category-count">${getMenuItems().filter(i => i.category === cat.name).length} items</p>
            </div>
            <div class="category-actions">
                <button 
                    class="btn btn-outline btn-sm" 
                    onclick="openEditCategoryModal('${cat.id}')"
                    data-testid="edit-category-${cat.id}"
                >
                    ✏️ Edit
                </button>
                <button 
                    class="btn btn-outline btn-sm" 
                    onclick="handleDeleteCategory('${cat.id}')"
                    data-testid="delete-category-${cat.id}"
                    style="border-color: var(--error); color: var(--error);"
                >
                    🗑️ Delete
                </button>
            </div>
        </div>
    `).join('');
}

function openAddCategoryModal() {
    editingCategoryId = null;
    document.getElementById('category-modal-title').textContent = 'Add Category';
    document.getElementById('category-form').reset();
    document.getElementById('category-modal').classList.add('active');
}

function openEditCategoryModal(categoryId) {
    editingCategoryId = categoryId;
    const categories = getCategories();
    const category = categories.find(c => c.id === categoryId);
    
    if (category) {
        document.getElementById('category-modal-title').textContent = 'Edit Category';
        document.getElementById('category-name').value = category.name;
        document.getElementById('category-modal').classList.add('active');
    }
}

function closeCategoryModal() {
    document.getElementById('category-modal').classList.remove('active');
    editingCategoryId = null;
}

function saveCategory(event) {
    event.preventDefault();
    
    const name = document.getElementById('category-name').value;
    
    if (editingCategoryId) {
        updateCategory(editingCategoryId, name);
        showToast('Category updated successfully');
    } else {
        addCategory(name);
        showToast('Category added successfully');
    }
    
    closeCategoryModal();
    loadCategories();
}

function handleDeleteCategory(categoryId) {
    if (confirm('Are you sure? Items in this category will be moved to Uncategorized.')) {
        deleteCategory(categoryId);
        showToast('Category deleted successfully');
        loadCategories();
        loadMenuItems();
    }
}

// Orders Management
function loadOrders() {
    const orders = getOrders();
    const ordersList = document.getElementById('orders-list');
    const noOrders = document.getElementById('no-orders');
    
    if (orders.length === 0) {
        ordersList.innerHTML = '';
        noOrders.style.display = 'block';
        return;
    }
    
    noOrders.style.display = 'none';
    
    ordersList.innerHTML = orders.map(order => `
        <div class="order-card" data-testid="order-${order.id}">
            <div class="order-header">
                <div class="order-date">${new Date(order.created_at).toLocaleString()}</div>
                <div class="order-total">₹${order.total}</div>
            </div>
            <div class="order-items">
                ${order.items.map(item => {
                    const sizeInfo = item.selectedSize ? ` (${item.selectedSize})` : '';
                    return `
                    <div class="order-item-row">
                        <span>${item.name}${sizeInfo} x${item.quantity}</span>
                        <span>₹${item.price * item.quantity}</span>
                    </div>
                `;
                }).join('')}
            </div>
        </div>
    `).join('');
}

// Settings Management
function loadSettings() {
    const settings = getSettings();
    
    document.getElementById('setting-hours').value = settings.opening_hours;
    document.getElementById('setting-phone').value = settings.phone;
    document.getElementById('setting-address').value = settings.address;
    document.getElementById('setting-price').value = settings.price_range;
}

function saveSettings(event) {
    event.preventDefault();
    
    const settingsData = {
        opening_hours: document.getElementById('setting-hours').value,
        phone: document.getElementById('setting-phone').value,
        address: document.getElementById('setting-address').value,
        price_range: document.getElementById('setting-price').value
    };
    
    updateSettings(settingsData);
    showToast('Settings updated successfully');
}

// Gallery Management
function loadGalleryImages() {
    const images = getGalleryImages();
    const grid = document.getElementById('admin-gallery-grid');
    
    if (!grid) return;
    
    grid.innerHTML = images.map(image => `
        <div class="admin-gallery-item" data-testid="gallery-item-${image.id}">
            <img src="${image.url}" alt="${image.alt}">
            <div class="admin-gallery-overlay">
                <button 
                    class="btn btn-outline btn-sm" 
                    onclick="handleDeleteGalleryImage('${image.id}')"
                    data-testid="delete-gallery-${image.id}"
                    style="border-color: var(--error); color: var(--error);"
                >
                    🗑️ Delete
                </button>
            </div>
        </div>
    `).join('');
}

function openAddGalleryModal() {
    document.getElementById('gallery-form').reset();
    document.getElementById('gallery-modal').classList.add('active');
}

function closeGalleryModal() {
    document.getElementById('gallery-modal').classList.remove('active');
}

function saveGalleryImage(event) {
    event.preventDefault();
    
    const url = document.getElementById('gallery-image-url').value;
    const alt = document.getElementById('gallery-image-alt').value || 'Cafe Image';
    
    addGalleryImage(url, alt);
    showToast('Image added to gallery successfully');
    
    closeGalleryModal();
    loadGalleryImages();
}

function handleDeleteGalleryImage(imageId) {
    if (confirm('Are you sure you want to delete this image?')) {
        deleteGalleryImage(imageId);
        showToast('Image deleted successfully');
        loadGalleryImages();
    }
}
