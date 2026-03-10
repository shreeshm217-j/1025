// Admin Dashboard Functionality

let currentTab = 'menu';
let editingItemId = null;

// Check if user is logged in
document.addEventListener('DOMContentLoaded', function() {
    const isLoggedIn = localStorage.getItem('isAdminLoggedIn');
    if (!isLoggedIn) {
        window.location.href = 'admin-login.html';
        return;
    }
    
    loadMenuItems();
    loadOrders();
    loadSettings();
});

function logout() {
    localStorage.removeItem('isAdminLoggedIn');
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
    document.querySelector(`[data-testid=\"tab-${tab}\"]`).classList.add('active');
    
    // Show/hide tab content
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
    });
    document.getElementById(`${tab}-tab`).classList.add('active');
    
    // Refresh content
    if (tab === 'menu') {
        loadMenuItems();
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
    
    grid.innerHTML = items.map(item => `
        <div class=\"admin-menu-item\" data-testid=\"admin-menu-item-${item.id}\">
            ${item.image_url ? `
                <div class=\"admin-item-image\">
                    <img src=\"${item.image_url}\" alt=\"${item.name}\">
                </div>
            ` : ''}
            <div class=\"admin-item-content\">
                <div class=\"admin-item-header\">
                    <h3>${item.name}</h3>
                    <span class=\"menu-item-price\">₹${item.price}</span>
                </div>
                <p>${item.description}</p>
                <div class=\"category-tag\">${item.category}</div>
                <div class=\"admin-item-actions\">
                    <button 
                        class=\"btn btn-outline btn-sm\" 
                        onclick=\"openEditItemModal('${item.id}')\"
                        data-testid=\"edit-item-${item.id}\"
                    >
                        ✏️ Edit
                    </button>
                    <button 
                        class=\"btn btn-outline btn-sm\" 
                        onclick=\"handleDeleteItem('${item.id}')\"
                        data-testid=\"delete-item-${item.id}\"
                        style=\"border-color: var(--error); color: var(--error);\"
                    >
                        🗑️ Delete
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

function openAddItemModal() {
    editingItemId = null;
    document.getElementById('modal-title').textContent = 'Add Menu Item';
    document.getElementById('item-form').reset();
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
        document.getElementById('item-price').value = item.price;
        document.getElementById('item-category').value = item.category;
        document.getElementById('item-image').value = item.image_url || '';
        
        document.getElementById('item-modal').classList.add('active');
    }
}

function closeItemModal() {
    document.getElementById('item-modal').classList.remove('active');
    editingItemId = null;
}

function saveItem(event) {
    event.preventDefault();
    
    const itemData = {
        name: document.getElementById('item-name').value,
        description: document.getElementById('item-description').value,
        price: parseFloat(document.getElementById('item-price').value),
        category: document.getElementById('item-category').value,
        image_url: document.getElementById('item-image').value,
        available: true
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
        <div class=\"order-card\" data-testid=\"order-${order.id}\">
            <div class=\"order-header\">
                <div class=\"order-date\">${new Date(order.created_at).toLocaleString()}</div>
                <div class=\"order-total\">₹${order.total}</div>
            </div>
            <div class=\"order-items\">
                ${order.items.map(item => `
                    <div class=\"order-item-row\">
                        <span>${item.name} x${item.quantity}</span>
                        <span>₹${item.price * item.quantity}</span>
                    </div>
                `).join('')}
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
