// Data Management with localStorage

// Initialize data if not exists
function initializeData() {
    if (!localStorage.getItem('menuItems')) {
        const sampleMenu = [
            // Pizzas
            {
                id: generateId(),
                name: "Margherita Pizza",
                description: "Classic pizza with fresh mozzarella, basil, and tomato sauce",
                price: 250,
                category: "Pizzas",
                image_url: "https://images.unsplash.com/photo-1772494047822-d0375853f7fd?w=800&q=80",
                available: true
            },
            {
                id: generateId(),
                name: "Pepperoni Pizza",
                description: "Loaded with pepperoni slices and extra cheese",
                price: 320,
                category: "Pizzas",
                image_url: "https://images.unsplash.com/photo-1595708684082-a173bb3a06c5?w=800&q=80",
                available: true
            },
            {
                id: generateId(),
                name: "Veggie Supreme Pizza",
                description: "Topped with fresh vegetables, olives, and cheese",
                price: 290,
                category: "Pizzas",
                image_url: "https://images.unsplash.com/photo-1772494047822-d0375853f7fd?w=800&q=80",
                available: true
            },
            {
                id: generateId(),
                name: "Paneer Tikka Pizza",
                description: "Indian style pizza with paneer tikka and special spices",
                price: 310,
                category: "Pizzas",
                image_url: "https://images.unsplash.com/photo-1595708684082-a173bb3a06c5?w=800&q=80",
                available: true
            },
            // Garlic Bread
            {
                id: generateId(),
                name: "Classic Garlic Bread",
                description: "Crispy bread with garlic butter and herbs",
                price: 120,
                category: "Garlic Bread",
                image_url: "",
                available: true
            },
            {
                id: generateId(),
                name: "Cheese Garlic Bread",
                description: "Garlic bread topped with melted mozzarella cheese",
                price: 150,
                category: "Garlic Bread",
                image_url: "",
                available: true
            },
            // Burgers
            {
                id: generateId(),
                name: "Chicken Burger",
                description: "Juicy chicken patty with lettuce, tomato, and mayo",
                price: 180,
                category: "Burgers",
                image_url: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&q=80",
                available: true
            },
            {
                id: generateId(),
                name: "Veg Cheese Burger",
                description: "Veggie patty with cheese, lettuce, and special sauce",
                price: 150,
                category: "Burgers",
                image_url: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&q=80",
                available: true
            },
            // Pasta
            {
                id: generateId(),
                name: "White Sauce Pasta",
                description: "Creamy pasta with vegetables in white sauce",
                price: 200,
                category: "Pasta",
                image_url: "https://images.unsplash.com/photo-1611270629569-8b357cb88da9?w=800&q=80",
                available: true
            },
            {
                id: generateId(),
                name: "Red Sauce Pasta",
                description: "Tangy pasta in tomato-based red sauce",
                price: 190,
                category: "Pasta",
                image_url: "https://images.unsplash.com/photo-1611270629569-8b357cb88da9?w=800&q=80",
                available: true
            },
            // Fries & Sides
            {
                id: generateId(),
                name: "French Fries",
                description: "Crispy golden french fries",
                price: 100,
                category: "Fries & Sides",
                image_url: "",
                available: true
            },
            {
                id: generateId(),
                name: "Cheese Fries",
                description: "French fries loaded with melted cheese",
                price: 130,
                category: "Fries & Sides",
                image_url: "",
                available: true
            },
            // Beverages
            {
                id: generateId(),
                name: "Coca Cola",
                description: "Chilled Coca Cola (330ml)",
                price: 50,
                category: "Beverages",
                image_url: "",
                available: true
            },
            {
                id: generateId(),
                name: "Fresh Lime Soda",
                description: "Refreshing lime soda with mint",
                price: 60,
                category: "Beverages",
                image_url: "",
                available: true
            },
            {
                id: generateId(),
                name: "Mango Shake",
                description: "Thick and creamy mango shake",
                price: 90,
                category: "Beverages",
                image_url: "",
                available: true
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

// Generate unique ID
function generateId() {
    return 'id-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
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
    const item = cart.find(i => i.id === itemId);
    if (item) {
        item.quantity = quantity;
        localStorage.setItem('cart', JSON.stringify(cart));
    }
}

function removeFromCart(itemId) {
    const cart = getCart();
    const filtered = cart.filter(i => i.id !== itemId);
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