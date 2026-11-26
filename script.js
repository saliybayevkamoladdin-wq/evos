const products = [
  { id: 1, name: "Klasik burger", price: 29000, category: "burger", emoji: "🍔" },
  { id: 2, name: "Big EVOS burger", price: 39000, category: "burger", emoji: "🍔" },
  { id: 3, name: "Cheese burger", price: 33000, category: "burger", emoji: "🍔" },
  { id: 4, name: "Lavash klasik", price: 30000, category: "lavash", emoji: "🌯" },
  { id: 5, name: "Pishloqli lavash", price: 34000, category: "lavash", emoji: "🌯" },
  { id: 6, name: "Achchiq lavash", price: 32000, category: "lavash", emoji: "🌯" },
  { id: 7, name: "Donar tandir", price: 35000, category: "donar", emoji: "🥙" },
  { id: 8, name: "Mini donar", price: 24000, category: "donar", emoji: "🥙" },
  { id: 9, name: "Coca-Cola 0.5", price: 10000, category: "drink", emoji: "🥤" },
  { id: 10, name: "Fanta 0.5", price: 10000, category: "drink", emoji: "🥤" },
  { id: 11, name: "Fresh apelsin", price: 18000, category: "drink", emoji: "🧃" },
  { id: 12, name: "Kartoshka fri", price: 18000, category: "donar", emoji: "🍟" }
];

let cart = {};
let activeCategory = "all";

const grid = document.getElementById("product-grid");
const drawer = document.getElementById("cart-drawer");
const overlay = document.getElementById("overlay");
const cartItems = document.getElementById("cart-items");
const cartCount = document.getElementById("cart-count");
const cartTotal = document.getElementById("cart-total");
const adminDialog = document.getElementById("admin-dialog");

function formatPrice(price) {
  return `${price.toLocaleString("uz-UZ")} so'm`;
}

function renderProducts() {
  const visible = activeCategory === "all"
    ? products
    : products.filter(product => product.category === activeCategory);

  grid.innerHTML = visible.map(product => `
    <article class="product-card">
      <div class="product-image" role="img" aria-label="${product.name}">${product.emoji}</div>
      <h3>${product.name}</h3>
      <div class="product-footer">
        <span class="price">${formatPrice(product.price)}</span>
        <button class="add-btn" data-id="${product.id}" aria-label="${product.name} qo'shish">+</button>
      </div>
    </article>
  `).join("");
}

function renderCart() {
  const ids = Object.keys(cart).map(Number);
  if (!ids.length) {
    cartItems.innerHTML = '<p class="cart-empty">Savatcha bo‘sh</p>';
  } else {
    cartItems.innerHTML = ids.map(id => {
      const product = products.find(item => item.id === id);
      return `
        <div class="cart-item">
          <div class="mini">${product.emoji}</div>
          <div>
            <div class="cart-item-name">${product.name}</div>
            <div class="cart-item-price">${formatPrice(product.price * cart[id])}</div>
          </div>
          <div class="quantity">
            <button data-action="minus" data-id="${id}" aria-label="Kamaytirish">−</button>
            <b>${cart[id]}</b>
            <button data-action="plus" data-id="${id}" aria-label="Ko'paytirish">+</button>
          </div>
        </div>
      `;
    }).join("");
  }

  const count = ids.reduce((sum, id) => sum + cart[id], 0);
  const total = ids.reduce((sum, id) => {
    const product = products.find(item => item.id === id);
    return sum + product.price * cart[id];
  }, 0);
  cartCount.textContent = count;
  cartTotal.textContent = formatPrice(total);
}

function openCart() {
  drawer.classList.add("open");
  drawer.setAttribute("aria-hidden", "false");
  overlay.classList.add("show");
}

function closeCart() {
  drawer.classList.remove("open");
  drawer.setAttribute("aria-hidden", "true");
  overlay.classList.remove("show");
}

function showToast(message) {
  const toast = document.getElementById("toast");
  toast.textContent = message;
  toast.classList.add("show");
  window.setTimeout(() => toast.classList.remove("show"), 2200);
}

grid.addEventListener("click", event => {
  const button = event.target.closest(".add-btn");
  if (!button) return;
  const id = Number(button.dataset.id);
  cart[id] = (cart[id] || 0) + 1;
  renderCart();
  showToast("Savatchaga qo‘shildi");
});

document.getElementById("categories").addEventListener("click", event => {
  const button = event.target.closest(".category");
  if (!button) return;
  document.querySelectorAll(".category").forEach(item => item.classList.remove("active"));
  button.classList.add("active");
  activeCategory = button.dataset.category;
  renderProducts();
});

cartItems.addEventListener("click", event => {
  const button = event.target.closest("button[data-action]");
  if (!button) return;
  const id = Number(button.dataset.id);
  if (button.dataset.action === "plus") cart[id]++;
  if (button.dataset.action === "minus") {
    cart[id]--;
    if (cart[id] <= 0) delete cart[id];
  }
  renderCart();
});

document.getElementById("cart-header-btn").addEventListener("click", openCart);
document.getElementById("cart-close-btn").addEventListener("click", closeCart);
overlay.addEventListener("click", closeCart);

document.getElementById("checkout-form").addEventListener("submit", event => {
  event.preventDefault();
  const count = Object.values(cart).reduce((sum, value) => sum + value, 0);
  if (!count) {
    showToast("Avval taom tanlang");
    return;
  }
  const phone = document.getElementById("phone").value.trim();
  const address = document.getElementById("address").value.trim();
  if (!phone || !address) return;
  showToast("Buyurtma qabul qilindi!");
  cart = {};
  renderCart();
  event.target.reset();
  closeCart();
});

document.getElementById("admin-open-btn").addEventListener("click", () => adminDialog.showModal());
document.getElementById("admin-login-form").addEventListener("submit", event => {
  event.preventDefault();
  const password = document.getElementById("admin-password").value;
  const error = document.getElementById("admin-error");
  if (password !== "1234") {
    error.textContent = "Parol noto'g'ri";
    return;
  }
  error.textContent = "";
  document.getElementById("admin-password").value = "";
  adminDialog.close();
  showToast("Admin panel ochildi");
});

document.getElementById("location-btn").addEventListener("click", () => {
  openCart();
  document.getElementById("address").focus();
});

document.getElementById("brand-btn").addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

renderProducts();
renderCart();
