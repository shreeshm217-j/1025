import { db } from "./firebase.js";

import {
collection,
addDoc,
getDocs,
updateDoc,
deleteDoc,
doc,
getDoc,
setDoc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

let currentTab = "menu";
let editingItemId = null;
let editingCategoryId = null;

/* ===========================
AUTH CHECK
=========================== */

document.addEventListener("DOMContentLoaded", async () => {

    const isLoggedIn = localStorage.getItem("isAdminLoggedIn");
    const loginTimestamp = localStorage.getItem("loginTimestamp");

    if (!isLoggedIn) {
        window.location.href = "admin-login.html";
        return;
    }

    if (loginTimestamp) {

        const loginTime = new Date(loginTimestamp);
        const now = new Date();

        const hoursDiff = (now - loginTime) / (1000 * 60 * 60);

        if (hoursDiff > 24) {
            logout();
            return;
        }
    }

    await loadMenuItems();
    await loadCategories();
    await loadGalleryImages();
    await loadOrders();
    await loadSettings();

});

function logout() {

    localStorage.removeItem("isAdminLoggedIn");
    localStorage.removeItem("adminUsername");
    localStorage.removeItem("loginTimestamp");

    window.location.href = "index.html";

}

/* ===========================
MENU MANAGEMENT
=========================== */

async function loadMenuItems() {

    const snapshot = await getDocs(collection(db,"menu"));

    const items = [];

    snapshot.forEach(d=>{
        items.push({id:d.id,...d.data()});
    });

    const grid = document.getElementById("admin-menu-grid");

    grid.innerHTML = items.map(item=>{

        const priceDisplay = item.sizes
        ? item.sizes.map(s=>`${s.name}: ₹${s.price}`).join(", ")
        : "";

        return `
        <div class="admin-menu-item">

            ${item.image ? `
            <div class="admin-item-image">
                <img src="${item.image}">
            </div>` : ""}

            <div class="admin-item-content">

                <h3>${item.name}</h3>

                <p>${item.description}</p>

                <div class="category-tag">${item.category}</div>

                <div>${priceDisplay}</div>

                <div class="admin-item-actions">

                    <button onclick="openEditItemModal('${item.id}')">
                    ✏️ Edit
                    </button>

                    <button onclick="handleDeleteItem('${item.id}')">
                    🗑️ Delete
                    </button>

                </div>

            </div>

        </div>
        `;

    }).join("");

}

async function addMenuItem(data){

    await addDoc(collection(db,"menu"),data);

}

async function updateMenuItem(id,data){

    await updateDoc(doc(db,"menu",id),data);

}

async function deleteMenuItem(id){

    await deleteDoc(doc(db,"menu",id));

}

async function handleDeleteItem(id){

    if(confirm("Delete item?")){

        await deleteMenuItem(id);
        loadMenuItems();

    }

}

/* ===========================
CATEGORY MANAGEMENT
=========================== */

async function loadCategories(){

    const snapshot = await getDocs(collection(db,"categories"));

    const categories=[];

    snapshot.forEach(d=>{
        categories.push({id:d.id,...d.data()});
    });

    const list=document.getElementById("categories-list");

    if(!list) return;

    list.innerHTML=categories.map(cat=>`

        <div class="category-item">

            <h3>${cat.name}</h3>

            <button onclick="handleDeleteCategory('${cat.id}')">
            Delete
            </button>

        </div>

    `).join("");

}

async function addCategory(name){

    await addDoc(collection(db,"categories"),{name});

}

async function updateCategory(id,name){

    await updateDoc(doc(db,"categories",id),{name});

}

async function deleteCategory(id){

    await deleteDoc(doc(db,"categories",id));

}

/* ===========================
GALLERY MANAGEMENT
=========================== */

async function loadGalleryImages(){

    const snapshot=await getDocs(collection(db,"gallery"));

    const images=[];

    snapshot.forEach(d=>{
        images.push({id:d.id,...d.data()});
    });

    const grid=document.getElementById("admin-gallery-grid");

    if(!grid) return;

    grid.innerHTML=images.map(img=>`

        <div class="admin-gallery-item">

            <img src="${img.url}">

            <button onclick="handleDeleteGalleryImage('${img.id}')">
            Delete
            </button>

        </div>

    `).join("");

}

async function addGalleryImage(url,alt){

    await addDoc(collection(db,"gallery"),{
        url,
        alt
    });

}

async function deleteGalleryImage(id){

    await deleteDoc(doc(db,"gallery",id));

}

/* ===========================
ORDERS
=========================== */

async function loadOrders(){

    const snapshot=await getDocs(collection(db,"orders"));

    const orders=[];

    snapshot.forEach(d=>{
        orders.push({id:d.id,...d.data()});
    });

    const list=document.getElementById("orders-list");

    if(!list) return;

    list.innerHTML=orders.map(order=>`

        <div class="order-card">

            <div>${new Date(order.created_at).toLocaleString()}</div>

            <div>₹${order.total}</div>

        </div>

    `).join("");

}

/* ===========================
SETTINGS
=========================== */

async function loadSettings(){

    const ref=doc(db,"settings","restaurant");

    const snap=await getDoc(ref);

    if(!snap.exists()) return;

    const settings=snap.data();

    document.getElementById("setting-hours").value=settings.opening_hours || "";
    document.getElementById("setting-phone").value=settings.phone || "";
    document.getElementById("setting-address").value=settings.address || "";
    document.getElementById("setting-price").value=settings.price_range || "";

}

async function saveSettings(event){

    event.preventDefault();

    const data={

        opening_hours:document.getElementById("setting-hours").value,
        phone:document.getElementById("setting-phone").value,
        address:document.getElementById("setting-address").value,
        price_range:document.getElementById("setting-price").value

    };

    await setDoc(doc(db,"settings","restaurant"),data);

}
