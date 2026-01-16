const cartItemsEl = document.getElementById("cartItems");
const emptyCartEl = document.getElementById("emptyCart");

const subtotalEl = document.getElementById("subtotal");
const shippingEl = document.getElementById("shipping");
const totalEl = document.getElementById("total");

const SHIPPING_FEE = 5;

function money(n) {
  return `$${Number(n).toFixed(2)}`;
}

function renderCart() {
  const cart = window.cartStorage.getCart();

  if (!cart.length) {
    cartItemsEl.innerHTML = "";
    emptyCartEl.classList.remove("hidden");
    subtotalEl.textContent = money(0);
    totalEl.textContent = money(0);
    return;
  }

  emptyCartEl.classList.add("hidden");

  cartItemsEl.innerHTML = cart.map(item => `
    <div class="flex gap-4 items-center border rounded-xl p-4">
      <img src="${item.image}" class="w-20 h-20 object-cover rounded-xl" alt="${item.name}" />

      <div class="flex-1">
        <h3 class="font-semibold">${item.name}</h3>
        <p class="text-sm text-gray-600">${money(item.price)}</p>

        <div class="flex items-center gap-3 mt-3">
          <button class="qty-btn w-9 h-9 rounded-full border hover:bg-gray-50" data-action="dec" data-id="${item.id}">-</button>
          <span class="min-w-8 text-center font-medium">${item.qty}</span>
          <button class="qty-btn w-9 h-9 rounded-full border hover:bg-gray-50" data-action="inc" data-id="${item.id}">+</button>

          <button class="remove-btn ml-4 text-sm text-red-600 hover:underline" data-id="${item.id}">
            Remove
          </button>
        </div>
      </div>

      <div class="font-bold text-green-600">
        ${money(item.price * item.qty)}
      </div>
    </div>
  `).join("");

  const subtotal = cart.reduce((sum, i) => sum + i.price * i.qty, 0);
  subtotalEl.textContent = money(subtotal);
  shippingEl.textContent = money(SHIPPING_FEE);
  totalEl.textContent = money(subtotal + SHIPPING_FEE);
}

cartItemsEl.addEventListener("click", (e) => {
  const removeBtn = e.target.closest(".remove-btn");
  if (removeBtn) {
    const id = Number(removeBtn.dataset.id);
    window.cartStorage.removeFromCart(id);
    renderCart();
    return;
  }

  const qtyBtn = e.target.closest(".qty-btn");
  if (!qtyBtn) return;

  const id = Number(qtyBtn.dataset.id);
  const action = qtyBtn.dataset.action;

  const cart = window.cartStorage.getCart();
  const item = cart.find(i => i.id === id);
  if (!item) return;

  const newQty = action === "inc" ? item.qty + 1 : item.qty - 1;
  window.cartStorage.updateQty(id, newQty);
  renderCart();
});

// أول تحميل
renderCart();
