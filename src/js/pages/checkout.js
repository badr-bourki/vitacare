const summaryItemsEl = document.getElementById("summaryItems");
const subtotalEl = document.getElementById("subtotal");
const shippingEl = document.getElementById("shipping");
const totalEl = document.getElementById("total");
const emptyCartEl = document.getElementById("emptyCart");

const form = document.getElementById("checkoutForm");
const formMsg = document.getElementById("formMsg");

const SHIPPING_FEE = 5;
const ORDERS_KEY = "vitacare_orders";

function money(n) {
  return `$${Number(n).toFixed(2)}`;
}

function loadOrders() {
  return JSON.parse(localStorage.getItem(ORDERS_KEY)) || [];
}

function saveOrders(orders) {
  localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
}

function renderSummary() {
  const cart = window.cartStorage.getCart();

  if (!cart.length) {
    summaryItemsEl.innerHTML = "";
    emptyCartEl.classList.remove("hidden");
    subtotalEl.textContent = money(0);
    shippingEl.textContent = money(SHIPPING_FEE);
    totalEl.textContent = money(0);
    return;
  }

  emptyCartEl.classList.add("hidden");

  summaryItemsEl.innerHTML = cart.map(item => `
    <div class="flex items-center gap-3">
      <img src="${item.image}" class="w-12 h-12 rounded-xl object-cover" alt="${item.name}" />
      <div class="flex-1">
        <p class="font-medium text-sm">${item.name}</p>
        <p class="text-xs text-gray-500">${item.qty} × ${money(item.price)}</p>
      </div>
      <div class="font-semibold text-sm">${money(item.qty * item.price)}</div>
    </div>
  `).join("");

  const subtotal = cart.reduce((sum, i) => sum + i.price * i.qty, 0);
  subtotalEl.textContent = money(subtotal);
  shippingEl.textContent = money(SHIPPING_FEE);
  totalEl.textContent = money(subtotal + SHIPPING_FEE);
}

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const cart = window.cartStorage.getCart();
  if (!cart.length) {
    alert("Your cart is empty!");
    return;
  }

  const order = {
    id: Date.now(),
    createdAt: new Date().toISOString(),
    customer: {
      firstName: document.getElementById("firstName").value.trim(),
      lastName: document.getElementById("lastName").value.trim(),
      email: document.getElementById("email").value.trim(),
      phone: document.getElementById("phone").value.trim(),
      address: document.getElementById("address").value.trim(),
      city: document.getElementById("city").value.trim(),
      country: document.getElementById("country").value.trim(),
      note: document.getElementById("note").value.trim(),
    },
    items: cart,
    shippingFee: SHIPPING_FEE,
    subtotal: cart.reduce((sum, i) => sum + i.price * i.qty, 0),
  };

  order.total = order.subtotal + order.shippingFee;

  const orders = loadOrders();
  orders.push(order);
  saveOrders(orders);

  // تفريغ السلة
  window.cartStorage.saveCart([]);

 // Redirect لصفحة النجاح مع معلومات الطلب
const redirectUrl = `order-success.html?id=${order.id}&total=${order.total}&date=${encodeURIComponent(order.createdAt)}`;
window.location.href = redirectUrl;


  // optional redirect
  // window.location.href = "order-success.html";
});

// أول تحميل
renderSummary();
