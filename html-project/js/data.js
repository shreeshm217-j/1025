// Data Management with localStorage

// Generate unique ID
function generateId() {
    return 'id-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
}

// Initialize data if not exists
function initializeData() {
    // Initialize categories
    if (!localStorage.getItem('categories')) {
        const defaultCategories = [
            { id: generateId(), name: "Pizzas", order: 1 },
            { id: generateId(), name: "Garlic Bread", order: 2 },
            { id: generateId(), name: "Burgers", order: 3 },
            { id: generateId(), name: "Pasta", order: 4 },
            { id: generateId(), name: "Fries & Sides", order: 5 },
            { id: generateId(), name: "Beverages", order: 6 }
        ];
        localStorage.setItem('categories', JSON.stringify(defaultCategories));
    }

    if (!localStorage.getItem('menuItems')) {
        const sampleMenu = [
            // Pizzas
            {
                id: generateId(),
                name: "Margherita Pizza",
                description: "Classic pizza with fresh mozzarella, basil, and tomato sauce",
                category: "Pizzas",
                image_url: "https://images.unsplash.com/photo-1772494047822-d0375853f7fd?w=800&q=80",
                available: true,
                sizes: [
                    { name: "Small", price: 200 },
                    { name: "Medium", price: 250 },
                    { name: "Large", price: 320 }
                ]
            },
            {
                id: generateId(),
                name: "Pepperoni Pizza",
                description: "Loaded with pepperoni slices and extra cheese",
                category: "Pizzas",
                image_url: "https://images.unsplash.com/photo-1595708684082-a173bb3a06c5?w=800&q=80",
                available: true,
                sizes: [
                    { name: "Small", price: 250 },
                    { name: "Medium", price: 320 },
                    { name: "Large", price: 400 }
                ]
            },
            {
                id: generateId(),
                name: "Veggie Supreme Pizza",
                description: "Topped with fresh vegetables, olives, and cheese",
                category: "Pizzas",
                image_url: "https://images.unsplash.com/photo-1772494047822-d0375853f7fd?w=800&q=80",
                available: true,
                sizes: [
                    { name: "Small", price: 220 },
                    { name: "Medium", price: 290 },
                    { name: "Large", price: 360 }
                ]
            },
            {
                id: generateId(),
                name: "Paneer Tikka Pizza",
                description: "Indian style pizza with paneer tikka and special spices",
                category: "Pizzas",
                image_url: "https://images.unsplash.com/photo-1595708684082-a173bb3a06c5?w=800&q=80",
                available: true,
                sizes: [
                    { name: "Small", price: 240 },
                    { name: "Medium", price: 310 },
                    { name: "Large", price: 380 }
                ]
            },
            // Garlic Bread
            {
                id: generateId(),
                name: "Classic Garlic Bread",
                description: "Crispy bread with garlic butter and herbs",
                category: "Garlic Bread",
                image_url: "",
                available: true,
                sizes: [
                    { name: "Regular", price: 120 }
                ]
            },
            {
                id: generateId(),
                name: "Cheese Garlic Bread",
                description: "Garlic bread topped with melted mozzarella cheese",
                category: "Garlic Bread",
                image_url: "",
                available: true,
                sizes: [
                    { name: "Regular", price: 150 }
                ]
            },
            // Burgers
            {
                id: generateId(),
                name: "Chicken Burger",
                description: "Juicy chicken patty with lettuce, tomato, and mayo",
                category: "Burgers",
                image_url: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&q=80",
                available: true,
                sizes: [
                    { name: "Regular", price: 180 }
                ]
            },
            {
                id: generateId(),
                name: "Veg Cheese Burger",
                description: "Veggie patty with cheese, lettuce, and special sauce",
                category: "Burgers",
                image_url: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&q=80",
                available: true,
                sizes: [
                    { name: "Regular", price: 150 }
                ]
            },
            // Pasta
            {
                id: generateId(),
                name: "White Sauce Pasta",
                description: "Creamy pasta with vegetables in white sauce",
                category: "Pasta",
                image_url: "https://images.unsplash.com/photo-1611270629569-8b357cb88da9?w=800&q=80",
                available: true,
                sizes: [
                    { name: "Regular", price: 200 }
                ]
            },
            {
                id: generateId(),
                name: "Red Sauce Pasta",
                description: "Tangy pasta in tomato-based red sauce",
                category: "Pasta",
                image_url: "https://images.unsplash.com/photo-1611270629569-8b357cb88da9?w=800&q=80",
                available: true,
                sizes: [
                    { name: "Regular", price: 190 }
                ]
            },
            // Fries & Sides
            {
                id: generateId(),
                name: "French Fries",
                description: "Crispy golden french fries",
                category: "Fries & Sides",
                image_url: "",
                available: true,
                sizes: [
                    { name: "Regular", price: 100 }
                ]
            },
            {
                id: generateId(),
                name: "Cheese Fries",
                description: "French fries loaded with melted cheese",
                category: "Fries & Sides",
                image_url: "",
                available: true,
                sizes: [
                    { name: "Regular", price: 130 }
                ]
            },
            // Beverages
            {
                id: generateId(),
                name: "Coca Cola",
                description: "Chilled Coca Cola (330ml)",
                category: "Beverages",
                image_url: "",
                available: true,
                sizes: [
                    { name: "Regular", price: 50 }
                ]
            },
            {
                id: generateId(),
                name: "Fresh Lime Soda",
                description: "Refreshing lime soda with mint",
                category: "Beverages",
                image_url: "",
                available: true,
                sizes: [
                    { name: "Regular", price: 60 }
                ]
            },
            {
                id: generateId(),
                name: "Mango Shake",
                description: "Thick and creamy mango shake",
                category: "Beverages",
                image_url: "",
                available: true,
                sizes: [
                    { name: "Regular", price: 90 }
                ]
            }
        ];
        localStorage.setItem('menuItems', JSON.stringify(sampleMenu));
    }

    if (!localStorage.getItem('settings')) {
        const defaultSettings = {
            opening_hours: "11:00 AM – 10:00 PM",
            phone: "+91 99564 07087",
            address: "Unnao - Hardoi Rd, opposite Government Hospital, near Sudheer Mishthan Bhandar, Guddey Market, Mallawan, Uttar Pradesh 241303, India",
            rating: 4.9,
            total_reviews: 67,
            price_range: "₹200 – ₹400"
        };
        localStorage.setItem('settings', JSON.stringify(defaultSettings));
    }

    if (!localStorage.getItem('cart')) {
        localStorage.setItem('cart', JSON.stringify([]));
    }

    if (!localStorage.getItem('orders')) {
        localStorage.setItem('orders', JSON.stringify([]));
    }
}

// Menu Items CRUD
function getMenuItems() {
    return JSON.parse(localStorage.getItem('menuItems') || '[]');
}

function getMenuItemsByCategory(category) {
    const items = getMenuItems();
    if (category === 'All') return items;
    return items.filter(item => item.category === category);
}

function addMenuItem(item) {
    const items = getMenuItems();
    item.id = generateId();
    items.push(item);
    localStorage.setItem('menuItems', JSON.stringify(items));
    return item;
}

function updateMenuItem(id, updates) {
    const items = getMenuItems();
    const index = items.findIndex(item => item.id === id);
    if (index !== -1) {
        items[index] = { ...items[index], ...updates };
        localStorage.setItem('menuItems', JSON.stringify(items));
        return items[index];
    }
    return null;
}

function deleteMenuItem(id) {
    const items = getMenuItems();
    const filtered = items.filter(item => item.id !== id);
    localStorage.setItem('menuItems', JSON.stringify(filtered));
}

// Settings
function getSettings() {
    return JSON.parse(localStorage.getItem('settings') || '{}');
}

function updateSettings(updates) {
    const settings = getSettings();
    const newSettings = { ...settings, ...updates };
    localStorage.setItem('settings', JSON.stringify(newSettings));
    return newSettings;
}

// Cart
function getCart() {
    return JSON.parse(localStorage.getItem('cart') || '[]');
}

function addToCart(item) {
    const cart = getCart();
    const existing = cart.find(i => i.id === item.id);
    if (existing) {
        existing.quantity += 1;
    } else {
        cart.push({ ...item, quantity: 1 });
    }
    localStorage.setItem('cart', JSON.stringify(cart));
    return cart;
}

function updateCartQuantity(itemId, quantity) {
    const cart = getCart();
    if (quantity <= 0) {
        removeFromCart(itemId);
        return;
    }
    const item = cart.find(i => (i.cartItemId || i.id) === itemId);
    if (item) {
        item.quantity = quantity;
        localStorage.setItem('cart', JSON.stringify(cart));
    }
}

function removeFromCart(itemId) {
    const cart = getCart();
    const filtered = cart.filter(i => (i.cartItemId || i.id) !== itemId);
    localStorage.setItem('cart', JSON.stringify(filtered));
}

function clearCart() {
    localStorage.setItem('cart', JSON.stringify([]));
}

function getCartTotal() {
    const cart = getCart();
    return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
}

function getCartCount() {
    const cart = getCart();
    return cart.reduce((sum, item) => sum + item.quantity, 0);
}

// Categories Management
function getCategories() {
    return JSON.parse(localStorage.getItem('categories') || '[]');
}

function addCategory(name) {
    const categories = getCategories();
    const newCategory = {
        id: generateId(),
        name: name,
        order: categories.length + 1
    };
    categories.push(newCategory);
    localStorage.setItem('categories', JSON.stringify(categories));
    return newCategory;
}

function updateCategory(id, name) {
    const categories = getCategories();
    const category = categories.find(c => c.id === id);
    if (category) {
        category.name = name;
        localStorage.setItem('categories', JSON.stringify(categories));
        return category;
    }
    return null;
}

function deleteCategory(id) {
    const categories = getCategories();
    const filtered = categories.filter(c => c.id !== id);
    localStorage.setItem('categories', JSON.stringify(filtered));
    
    // Remove category from menu items
    const items = getMenuItems();
    items.forEach(item => {
        const cat = categories.find(c => c.id === id);
        if (cat && item.category === cat.name) {
            item.category = 'Uncategorized';
        }
    });
    localStorage.setItem('menuItems', JSON.stringify(items));
}

// Orders
function getOrders() {
    return JSON.parse(localStorage.getItem('orders') || '[]');
}

function addOrder(order) {
    const orders = getOrders();
    order.id = generateId();
    order.created_at = new Date().toISOString();
    orders.unshift(order);
    localStorage.setItem('orders', JSON.stringify(orders));
    return order;
}

// Initialize data on load
initializeData();