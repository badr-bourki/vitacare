const cartItemsEl = document.getElementById("cartItems");
const emptyCartEl = document.getElementById("emptyCart");
const subtotalEl = document.getElementById("subtotal");
const shippingEl = document.getElementById("shipping");
const totalEl = document.getElementById("total");

const SHIPPING_FEE = 5;

// تنسيق السعر
function money(n) {
  return `$${Number(n).toFixed(2)}`;
}

// عرض السلة
function renderCart() {
  // التحقق من وجود cartStorage
  if (!window.cartStorage) {
    console.error('cartStorage not loaded!');
    cartItemsEl.innerHTML = '<p class="text-red-600">Error loading cart data.</p>';
    return;
  }

  const cart = window.cartStorage.getCart();

  // إذا كانت السلة فارغة
  if (!cart || cart.length === 0) {
    cartItemsEl.innerHTML = "";
    emptyCartEl.classList.remove("hidden");
    subtotalEl.textContent = money(0);
    shippingEl.textContent = money(0);
    totalEl.textContent = money(0);
    
    // إخفاء زر Checkout
    const checkoutBtn = document.querySelector('a[href*="checkout"]');
    if (checkoutBtn) {
      checkoutBtn.classList.add('opacity-50', 'pointer-events-none');
    }
    
    return;
  }

  // إظهار المنتجات
  emptyCartEl.classList.add("hidden");
  
  // تفعيل زر Checkout
  const checkoutBtn = document.querySelector('a[href*="checkout"]');
  if (checkoutBtn) {
    checkoutBtn.classList.remove('opacity-50', 'pointer-events-none');
  }

  cartItemsEl.innerHTML = cart.map(item => `
    <div class="flex gap-4 items-center border rounded-xl p-4 bg-white hover:shadow-md transition-shadow">
      <img src="${item.image}" 
           class="w-20 h-20 object-cover rounded-xl border" 
           alt="${item.name}"
           onerror="this.src='https://via.placeholder.com/80?text=No+Image'" />

      <div class="flex-1">
        <h3 class="font-semibold text-lg">${item.name}</h3>
        <p class="text-sm text-gray-500">${item.category || 'Product'}</p>
        <p class="text-sm text-gray-600 mt-1">Price: ${money(item.price)}</p>

        <div class="flex items-center gap-3 mt-3">
          <!-- زر تقليل الكمية -->
          <button class="qty-btn w-9 h-9 rounded-full border hover:bg-gray-100 active:scale-95 transition font-bold ${item.qty <= 1 ? 'opacity-50 cursor-not-allowed' : ''}" 
                  data-action="dec" 
                  data-id="${item.id}"
                  ${item.qty <= 1 ? 'disabled' : ''}>
            -
          </button>
          
          <!-- عرض الكمية -->
          <span class="min-w-[40px] text-center font-bold text-lg">${item.qty}</span>
          
          <!-- زر زيادة الكمية -->
          <button class="qty-btn w-9 h-9 rounded-full border hover:bg-gray-100 active:scale-95 transition font-bold" 
                  data-action="inc" 
                  data-id="${item.id}">
            +
          </button>

          <!-- زر الحذف -->
          <button class="remove-btn ml-4 text-sm text-red-600 hover:text-red-700 hover:underline font-medium flex items-center gap-1" 
                  data-id="${item.id}">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
            </svg>
            Remove
          </button>
        </div>
      </div>

      <!-- السعر الإجمالي للمنتج -->
      <div class="text-right">
        <div class="font-bold text-green-600 text-xl">
          ${money(item.price * item.qty)}
        </div>
        <div class="text-xs text-gray-500 mt-1">
          ${item.qty} × ${money(item.price)}
        </div>
      </div>
    </div>
  `).join("");

  // حساب المجاميع
  const subtotal = cart.reduce((sum, i) => sum + (i.price * i.qty), 0);
  const shipping = subtotal > 0 ? SHIPPING_FEE : 0;
  const total = subtotal + shipping;
  
  subtotalEl.textContent = money(subtotal);
  shippingEl.textContent = money(shipping);
  totalEl.textContent = money(total);
}

// معالجة الأحداث
cartItemsEl.addEventListener("click", (e) => {
  // حذف منتج
  const removeBtn = e.target.closest(".remove-btn");
  if (removeBtn) {
    const id = Number(removeBtn.dataset.id);
    const cart = window.cartStorage.getCart();
    const item = cart.find(i => i.id === id);
    
    if (item && confirm(`Remove "${item.name}" from cart?`)) {
      window.cartStorage.removeFromCart(id);
      renderCart();
      showNotification(`${item.name} removed from cart`, 'info');
    }
    return;
  }

  // تغيير الكمية
  const qtyBtn = e.target.closest(".qty-btn");
  if (!qtyBtn || qtyBtn.disabled) return;

  const id = Number(qtyBtn.dataset.id);
  const action = qtyBtn.dataset.action;

  const cart = window.cartStorage.getCart();
  const item = cart.find(i => i.id === id);
  if (!item) return;

  let newQty = action === "inc" ? item.qty + 1 : item.qty - 1;
  
  // منع الكمية من أن تكون أقل من 1
  if (newQty < 1) {
    newQty = 1;
    return;
  }
  
  // حد أقصى للكمية (اختياري)
  if (newQty > 99) {
    showNotification('Maximum quantity is 99', 'warning');
    return;
  }

  window.cartStorage.updateQuantity(id, newQty);
  renderCart();
});

// إشعارات
function showNotification(message, type = 'success') {
  const colors = {
    success: 'bg-green-600',
    info: 'bg-blue-600',
    warning: 'bg-yellow-600',
    error: 'bg-red-600'
  };
  
  const notification = document.createElement('div');
  notification.className = `fixed top-24 right-6 ${colors[type]} text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-slide-in`;
  notification.innerHTML = `
    <div class="flex items-center gap-3">
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
      </svg>
      <span>${message}</span>
    </div>
  `;
  
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.style.transform = 'translateX(400px)';
    notification.style.opacity = '0';
    setTimeout(() => notification.remove(), 300);
  }, 3000);
}

// تحديث تلقائي عند التغيير من صفحة أخرى
window.addEventListener('storage', (e) => {
  if (e.key === 'vitacare_cart') {
    renderCart();
  }
});

// تحميل السلة عند فتح الصفحة
document.addEventListener('DOMContentLoaded', () => {
  // انتظار تحميل cartStorage
  setTimeout(renderCart, 100);
});

// إضافة CSS للأنيميشن
const style = document.createElement('style');
style.textContent = `
  @keyframes slide-in {
    from {
      transform: translateX(400px);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
  
  .animate-slide-in {
    animation: slide-in 0.3s ease-out;
  }
`;
document.head.appendChild(style);
