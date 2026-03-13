import { db } from "./firebase.js";
import {
collection,
onSnapshot
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

let currentCategory = "All";
let allMenuItems = [];

document.addEventListener("DOMContentLoaded", function () {
    loadMenuFromFirebase();
    updateCartDisplay();
});

function loadMenuFromFirebase() {

    const menuRef = collection(db, "menu");

    onSnapshot(menuRef, (snapshot) => {

        allMenuItems = [];

        snapshot.forEach((doc) => {
            const item = doc.data();
            item.id = doc.id;
            allMenuItems.push(item);
        });

        loadCategoryButtons();
        renderMenuItems();

    });
}

function getCategories() {

    const categories = new Set();

    allMenuItems.forEach(item => {
        if (item.category) {
            categories.add(item.category);
        }
    });

    return Array.from(categories).map(name => ({ name }));
}

function getMenuItemsByCategory(category) {

    if (category === "All") return allMenuItems;

    return allMenuItems.filter(item => item.category === category);
}

function loadCategoryButtons() {

    const categories = getCategories();
    const filterDiv = document.getElementById("category-filter");

    let buttonsHTML =
        `<button class="category-btn active"
        data-category="All"
        onclick="filterCategory('All')">All</button>`;

    buttonsHTML += categories.map(cat =>

        `<button class="category-btn"
        data-category="${cat.name}"
        onclick="filterCategory('${cat.name}')">
        ${cat.name}
        </button>`

    ).join("");

    filterDiv.innerHTML = buttonsHTML;
}

function filterCategory(category) {

    currentCategory = category;

    document.querySelectorAll(".category-btn").forEach(btn => {
        btn.classList.remove("active");
    });

    document.querySelector(`[data-category="${category}"]`).classList.add("active");

    renderMenuItems();
}

function renderMenuItems() {

    const menuGrid = document.getElementById("menu-grid");
    const noItems = document.getElementById("no-items");

    const items = getMenuItemsByCategory(currentCategory);

    if (items.length === 0) {

        menuGrid.innerHTML = "";
        noItems.style.display = "block";
        return;

    }

    noItems.style.display = "none";

    menuGrid.innerHTML = items.map(item => {

        const sizes = item.sizes || [];
        const hasMultipleSizes = sizes.length > 1;

        return `
        <div class="menu-item">

            ${item.image ? `
            <div class="menu-item-image">
                <img src="${item.image}" alt="${item.name}">
            </div>` : ""}

            <div class="menu-item-content">

                <h3>${item.name}</h3>
                <p>${item.description || ""}</p>

                ${hasMultipleSizes ? `
                <div class="size-options">

                    ${sizes.map((size, idx) => `

                    <label class="size-option">

                        <input
                        type="radio"
                        name="size-${item.id}"
                        value="${idx}"
                        ${idx === 0 ? "checked" : ""}>

                        <span>${size.name}</span>
                        <span>₹${size.price}</span>

                    </label>

                    `).join("")}

                </div>` :

                sizes.length === 1 ?

                `<div class="menu-item-footer">
                    <span class="menu-item-price">
                    ₹${sizes[0].price}
                    </span>
                </div>` : ""}

                <button
                class="add-to-cart-btn"
                onclick="handleAddToCart('${item.id}')"
                ${item.available === false ? "disabled" : ""}>

                Add to Cart

                </button>

                ${item.available === false ?
                `<p style="color:red;">Currently unavailable</p>`
                : ""}

            </div>

        </div>
        `;

    }).join("");
}

function handleAddToCart(itemId) {

    const item = allMenuItems.find(i => i.id === itemId);

    if (!item) return;

    const sizeRadios = document.querySelectorAll(`input[name="size-${itemId}"]`);

    let selectedSizeIndex = 0;

    sizeRadios.forEach((radio, idx) => {
        if (radio.checked) selectedSizeIndex = idx;
    });

    const selectedSize = item.sizes[selectedSizeIndex];

    const cartItem = {
        ...item,
        selectedSize: selectedSize.name,
        price: selectedSize.price,
        cartItemId: `${item.id}-${selectedSize.name}`
    };

    addToCartWithSize(cartItem);

    showToast(`${item.name} (${selectedSize.name}) added to cart`);

    updateCartDisplay();
}

function addToCartWithSize(item) {

    const cart = getCart();

    const existing = cart.find(i => i.cartItemId === item.cartItemId);

    if (existing) {
        existing.quantity += 1;
    } else {
        cart.push({ ...item, quantity: 1 });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
}

function updateCartDisplay() {

    const count = getCartCount();

    const cartCountEl = document.getElementById("cart-count");

    if (!cartCountEl) return;

    cartCountEl.textContent = count;
    cartCountEl.style.display = count > 0 ? "flex" : "none";
}
