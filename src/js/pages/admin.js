const ORDERS_KEY = "vitacare_orders";

const ordersListEl = document.getElementById("ordersList");
const emptyOrdersEl = document.getElementById("emptyOrders");

const statTotalOrders = document.getElementById("statTotalOrders");
const statRevenue = document.getElementById("statRevenue");
const statPending = document.getElementById("statPending");
const statDelivered = document.getElementById("statDelivered");

const searchInput = document.getElementById("searchInput");
const statusFilter = document.getElementById("statusFilter");

const clearOrdersBtn = document.getElementById("clearOrdersBtn");
const seedBtn = document.getElementById("seedBtn");

function money(n) {
  return `$${Number(n).toFixed(2)}`;
}

function loadOrders() {
  return JSON.parse(localStorage.getItem(ORDERS_KEY)) || [];
}

function saveOrders(orders) {
  localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
}

function formatDate(iso) {
  try {
    return new Date(iso).toLocaleString();
  } catch {
    return iso;
  }
}

function computeStats(orders) {
  statTotalOrders.textContent = orders.length;

  const revenue = orders.reduce((sum, o) => sum + (o.total || 0), 0);
  statRevenue.textContent = money(revenue);

  const pending = orders.filter(o => (o.status || "pending") === "pending").length;
  statPending.textContent = pending;

  const delivered = orders.filter(o => (o.status || "pending") === "delivered").length;
  statDelivered.textContent = delivered;
}

function orderCardHTML(order) {
  const status = order.status || "pending";
  const customer = order.customer || {};
  const fullName = `${customer.firstName || ""} ${customer.lastName || ""}`.trim() || "Customer";

  const itemsCount = (order.items || []).reduce((sum, i) => sum + (i.qty || 0), 0);

  return `
    <div class="border rounded-2xl p-5">
      <div class="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
        <div class="flex-1">
          <div class="flex items-center gap-3">
            <p class="font-bold text-lg">#${order.id}</p>
            <span class="px-3 py-1 rounded-full text-xs font-medium ${
              status === "pending" ? "bg-yellow-50 text-yellow-700 border border-yellow-100" :
              status === "processing" ? "bg-blue-50 text-blue-700 border border-blue-100" :
              status === "delivered" ? "bg-green-50 text-green-700 border border-green-100" :
              "bg-red-50 text-red-700 border border-red-100"
            }">${status}</span>
          </div>

          <p class="text-gray-600 text-sm mt-1">${formatDate(order.createdAt)}</p>

          <div class="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
            <p><span class="text-gray-500">Name:</span> <span class="font-medium">${fullName}</span></p>
            <p><span class="text-gray-500">Email:</span> <span class="font-medium">${customer.email || "-"}</span></p>
            <p><span class="text-gray-500">Phone:</span> <span class="font-medium">${customer.phone || "-"}</span></p>
            <p><span class="text-gray-500">Items:</span> <span class="font-medium">${itemsCount}</span></p>
          </div>

          <details class="mt-4">
            <summary class="cursor-pointer text-green-700 font-medium">View items</summary>
            <div class="mt-3 space-y-2">
              ${(order.items || []).map(i => `
                <div class="flex items-center justify-between text-sm bg-gray-50 border rounded-xl p-3">
                  <span>${i.qty} × ${i.name}</span>
                  <span class="font-semibold">${money(i.qty * i.price)}</span>
                </div>
              `).join("")}
            </div>
          </details>
        </div>

        <div class="w-full lg:w-64">
          <p class="text-sm text-gray-500">Total</p>
          <p class="text-2xl font-extrabold text-green-700">${money(order.total || 0)}</p>

          <div class="mt-4 flex gap-2">
            <select class="status-select border rounded-full px-4 py-2 w-full"
              data-id="${order.id}">
              <option value="pending" ${status === "pending" ? "selected" : ""}>Pending</option>
              <option value="processing" ${status === "processing" ? "selected" : ""}>Processing</option>
              <option value="delivered" ${status === "delivered" ? "selected" : ""}>Delivered</option>
              <option value="cancelled" ${status === "cancelled" ? "selected" : ""}>Cancelled</option>
            </select>
            <button class="delete-btn px-4 py-2 rounded-full border hover:bg-gray-50"
              data-id="${order.id}">
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  `;
}

function matchesSearch(order, query) {
  if (!query) return true;

  const q = query.toLowerCase();
  const c = order.customer || {};
  const fullName = `${c.firstName || ""} ${c.lastName || ""}`.toLowerCase();

  return (
    String(order.id).includes(q) ||
    (c.email || "").toLowerCase().includes(q) ||
    (c.phone || "").toLowerCase().includes(q) ||
    fullName.includes(q)
  );
}

function matchesStatus(order, status) {
  if (status === "all") return true;
  return (order.status || "pending") === status;
}

function render() {
  const orders = loadOrders();

  computeStats(orders);

  const query = searchInput.value.trim();
  const status = statusFilter.value;

  const filtered = orders
    .filter(o => matchesSearch(o, query))
    .filter(o => matchesStatus(o, status))
    .sort((a, b) => (b.createdAt || "").localeCompare(a.createdAt || ""));

  if (!filtered.length) {
    ordersListEl.innerHTML = "";
    emptyOrdersEl.classList.remove("hidden");
    return;
  }

  emptyOrdersEl.classList.add("hidden");
  ordersListEl.innerHTML = filtered.map(orderCardHTML).join("");
}

// Events
ordersListEl.addEventListener("change", (e) => {
  const sel = e.target.closest(".status-select");
  if (!sel) return;

  const id = Number(sel.dataset.id);
  const newStatus = sel.value;

  const orders = loadOrders();
  const order = orders.find(o => o.id === id);
  if (!order) return;

  order.status = newStatus;
  saveOrders(orders);
  render();
});

ordersListEl.addEventListener("click", (e) => {
  const del = e.target.closest(".delete-btn");
  if (!del) return;

  const id = Number(del.dataset.id);
  const orders = loadOrders().filter(o => o.id !== id);
  saveOrders(orders);
  render();
});

searchInput.addEventListener("input", render);
statusFilter.addEventListener("change", render);

clearOrdersBtn.addEventListener("click", () => {
  if (!confirm("Delete ALL orders?")) return;
  saveOrders([]);
  render();
});

// Sample Orders (for demo)
seedBtn.addEventListener("click", () => {
  const existing = loadOrders();
  if (existing.length) {
    alert("You already have orders.");
    return;
  }

  const demo = [
    {
      id: 1111,
      createdAt: new Date().toISOString(),
      status: "pending",
      customer: { firstName: "Amina", lastName: "K.", email: "amina@mail.com", phone: "0600000000" },
      items: [{ id: 1, name: "Vitamin C Serum", price: 19.99, qty: 1 }],
      shippingFee: 5,
      subtotal: 19.99,
      total: 24.99,
    },
    {
      id: 2222,
      createdAt: new Date(Date.now() - 86400000).toISOString(),
      status: "delivered",
      customer: { firstName: "Mohamed", lastName: "B.", email: "mohamed@mail.com", phone: "0700000000" },
      items: [{ id: 2, name: "Omega 3 Capsules", price: 14.5, qty: 2 }],
      shippingFee: 5,
      subtotal: 29,
      total: 34,
    },
  ];

  saveOrders(demo);
  render();
});

// First render
render();
