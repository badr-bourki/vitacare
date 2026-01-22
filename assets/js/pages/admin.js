function initAdminOrders() {
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

  if (!ordersListEl || !emptyOrdersEl) return;

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
}
// ----------------------
// Products (Supabase)
// ----------------------

function initAdminProducts() {
  const supabaseClient = window.VitaCareSupabase?.getClient?.();
  const initError = window.VitaCareSupabase?.initError;

  const listEl = document.getElementById("adminProductsList");
  const emptyEl = document.getElementById("adminProductsEmpty");
  const errorEl = document.getElementById("adminProductsError");
  const addBtn = document.getElementById("adminAddProductBtn");

  const modal = document.getElementById("productModal");
  const modalTitle = document.getElementById("productModalTitle");
  const modalClose = document.getElementById("productModalClose");
  const form = document.getElementById("productForm");
  const formError = document.getElementById("productFormError");
  const saveBtn = document.getElementById("productSaveBtn");
  const cancelBtn = document.getElementById("productCancelBtn");

  if (!listEl || !emptyEl || !addBtn || !modal || !form) return;

  if (!supabaseClient || initError) {
    if (errorEl) {
      errorEl.textContent = "Supabase client not available. Products management is disabled.";
      errorEl.classList.remove("hidden");
    }
    return;
  }

  let products = [];
  let editingId = null;

  function showError(message) {
    if (!errorEl) return;
    errorEl.textContent = message;
    errorEl.classList.remove("hidden");
  }

  function clearError() {
    if (!errorEl) return;
    errorEl.textContent = "";
    errorEl.classList.add("hidden");
  }

  function showFormError(message) {
    if (!formError) return;
    formError.textContent = message;
    formError.classList.remove("hidden");
  }

  function clearFormError() {
    if (!formError) return;
    formError.textContent = "";
    formError.classList.add("hidden");
  }

  function openModal(product) {
    clearFormError();
    editingId = product?.id ?? null;
    modalTitle.textContent = editingId ? "Edit product" : "Add product";

    document.getElementById("productId").value = editingId || "";
    document.getElementById("productName").value = product?.name || "";
    document.getElementById("productDescription").value = product?.description || "";
    document.getElementById("productPrice").value = product?.price ?? "";
    document.getElementById("productStock").value = product?.stock ?? 0;
    document.getElementById("productCategory").value = product?.category || "skincare";
    document.getElementById("productImageUrl").value = product?.image_url || product?.image || "";

    modal.classList.remove("hidden");
    modal.classList.add("flex");
  }

  function closeModal() {
    modal.classList.add("hidden");
    modal.classList.remove("flex");
    editingId = null;
    clearFormError();
    form.reset();
  }

  async function fetchProducts() {
    clearError();
    try {
      const { data, error } = await supabaseClient
        .from("products")
        .select("id, name, description, price, stock, image_url, category, created_at")
        .order("created_at", { ascending: false });

      if (error) throw error;
      products = data || [];
      renderProducts();
    } catch (err) {
      console.error("Failed to load products", err);
      showError("Failed to load products from Supabase.");
    }
  }

  function renderProducts() {
    if (!products.length) {
      listEl.innerHTML = "";
      emptyEl.classList.remove("hidden");
      return;
    }

    emptyEl.classList.add("hidden");

    const rows = products
      .map((p) => {
        return `
          <tr class="border-b last:border-b-0">
            <td class="px-3 py-2 whitespace-nowrap text-xs text-gray-500">${p.id}</td>
            <td class="px-3 py-2">
              <div class="flex items-center gap-3">
                <img src="${p.image_url || p.image || "/assets/images/products/p1.jpeg"}" alt="${
          p.name || "Product"
        }" class="h-10 w-10 rounded object-cover border" onerror="this.src='https://via.placeholder.com/80x80?text=No+Image'" />
                <div>
                  <p class="text-sm font-medium text-gray-900">${p.name}</p>
                  <p class="text-xs text-gray-500">${p.category || "-"}</p>
                </div>
              </div>
            </td>
            <td class="px-3 py-2 whitespace-nowrap text-sm text-gray-700">$${Number(p.price || 0).toFixed(2)}</td>
            <td class="px-3 py-2 whitespace-nowrap text-sm text-gray-700">${p.stock ?? 0}</td>
            <td class="px-3 py-2 whitespace-nowrap text-right text-xs">
              <button
                type="button"
                class="mr-2 rounded-full border border-gray-200 px-3 py-1 text-gray-600 hover:bg-gray-50"
                data-action="edit"
                data-id="${p.id}"
              >
                Edit
              </button>
              <button
                type="button"
                class="rounded-full border border-red-200 px-3 py-1 text-red-600 hover:bg-red-50"
                data-action="delete"
                data-id="${p.id}"
              >
                Delete
              </button>
            </td>
          </tr>
        `;
      })
      .join("");

    listEl.innerHTML = `
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200 text-left">
          <thead class="bg-gray-50 text-xs font-semibold text-gray-500">
            <tr>
              <th class="px-3 py-2">ID</th>
              <th class="px-3 py-2">Product</th>
              <th class="px-3 py-2">Price</th>
              <th class="px-3 py-2">Stock</th>
              <th class="px-3 py-2 text-right">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100 text-sm">
            ${rows}
          </tbody>
        </table>
      </div>
    `;
  }

  async function saveProduct(event) {
    event.preventDefault();
    clearFormError();

    const name = document.getElementById("productName").value.trim();
    const description = document.getElementById("productDescription").value.trim();
    const price = Number(document.getElementById("productPrice").value);
    const stock = Number(document.getElementById("productStock").value);
    const category = document.getElementById("productCategory").value || "skincare";
    const imageUrl = document.getElementById("productImageUrl").value.trim();

    if (!name) {
      showFormError("Name is required.");
      return;
    }
    if (!(price >= 0)) {
      showFormError("Price must be a valid number.");
      return;
    }
    if (!(stock >= 0)) {
      showFormError("Stock must be a non-negative number.");
      return;
    }

    saveBtn.disabled = true;
    saveBtn.textContent = editingId ? "Saving..." : "Creating...";

    try {
      if (editingId) {
        const { error } = await supabaseClient
          .from("products")
          .update({ name, description, price, stock, category, image_url: imageUrl || null })
          .eq("id", editingId);

        if (error) throw error;
      } else {
        const { error } = await supabaseClient.from("products").insert([
          { name, description, price, stock, category, image_url: imageUrl || null },
        ]);

        if (error) throw error;
      }

      closeModal();
      await fetchProducts();
    } catch (err) {
      console.error("Failed to save product", err);
      showFormError(err.message || "Failed to save product.");
    } finally {
      saveBtn.disabled = false;
      saveBtn.textContent = "Save product";
    }
  }

  async function deleteProduct(id) {
    if (!confirm("Delete this product?")) return;
    clearError();

    try {
      const { error } = await supabaseClient.from("products").delete().eq("id", id);
      if (error) throw error;
      await fetchProducts();
    } catch (err) {
      console.error("Failed to delete product", err);
      showError("Failed to delete product.");
    }
  }

  // Events
  addBtn.addEventListener("click", () => openModal(null));
  modalClose?.addEventListener("click", closeModal);
  cancelBtn?.addEventListener("click", (e) => {
    e.preventDefault();
    closeModal();
  });

  modal.addEventListener("click", (e) => {
    if (e.target === modal) closeModal();
  });

  form.addEventListener("submit", saveProduct);

  listEl.addEventListener("click", (e) => {
    const btn = e.target.closest("button[data-action]");
    if (!btn) return;

    const id = btn.getAttribute("data-id");
    const action = btn.getAttribute("data-action");
    const product = products.find((p) => String(p.id) === String(id));

    if (action === "edit" && product) {
      openModal(product);
    }
    if (action === "delete" && product) {
      deleteProduct(product.id);
    }
  });

  // Initial load
  fetchProducts();

  // Optional: realtime updates
  try {
    const channel = supabaseClient
      .channel("products-changes")
      .on("postgres_changes", { event: "*", schema: "public", table: "products" }, () => {
        fetchProducts();
      })
      .subscribe();

    window.__VITACARE_PRODUCTS_CHANNEL__ = channel;
  } catch (err) {
    console.warn("Realtime subscription for products failed", err);
  }
}

if (window.__VITACARE_ADMIN_READY__ === true) {
  initAdminOrders();
  initAdminProducts();
} else {
  window.addEventListener(
    "vitacare:admin-ready",
    () => {
      initAdminOrders();
      initAdminProducts();
    },
    { once: true }
  );
}

