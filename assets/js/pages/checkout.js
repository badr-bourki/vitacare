const summaryItemsEl = document.getElementById("summaryItems");
const subtotalEl = document.getElementById("subtotal");
const shippingEl = document.getElementById("shipping");
const totalEl = document.getElementById("total");
const emptyCartEl = document.getElementById("emptyCart");

const form = document.getElementById("checkoutForm");
const formMsg = document.getElementById("formMsg");

const SHIPPING_FEE = 5;
const ORDERS_KEY = "vitacare_orders";

// تنسيق السعر
function money(n) {
  return `$${Number(n).toFixed(2)}`;
}

// تحميل الطلبات السابقة
function loadOrders() {
  try {
    return JSON.parse(localStorage.getItem(ORDERS_KEY)) || [];
  } catch (e) {
    console.error('Error loading orders:', e);
    return [];
  }
}

// حفظ الطلبات
function saveOrders(orders) {
  try {
    localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
  } catch (e) {
    console.error('Error saving orders:', e);
  }
}

// عرض ملخص الطلب
function renderSummary() {
  // التحقق من وجود cartStorage
  if (!window.cartStorage) {
    console.error('cartStorage not loaded!');
    emptyCartEl.classList.remove("hidden");
    return;
  }

  const cart = window.cartStorage.getCart();

  // إذا كانت السلة فارغة
  if (!cart || cart.length === 0) {
    summaryItemsEl.innerHTML = "";
    emptyCartEl.classList.remove("hidden");
    subtotalEl.textContent = money(0);
    shippingEl.textContent = money(0);
    totalEl.textContent = money(0);
    
    // إخفاء زر الطلب
    const submitBtn = form.querySelector('button[type="submit"]');
    if (submitBtn) submitBtn.disabled = true;
    
    return;
  }

  // إخفاء رسالة السلة الفارغة
  emptyCartEl.classList.add("hidden");
  
  // تفعيل زر الطلب
  const submitBtn = form.querySelector('button[type="submit"]');
  if (submitBtn) submitBtn.disabled = false;

  // عرض المنتجات
  summaryItemsEl.innerHTML = cart.map(item => `
    <div class="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
      <img src="${item.image}" 
           class="w-16 h-16 rounded-xl object-cover border" 
           alt="${item.name}"
           onerror="this.src='https://via.placeholder.com/64?text=No+Image'" />
      <div class="flex-1">
        <p class="font-semibold text-sm">${item.name}</p>
        <p class="text-xs text-gray-500">${item.category || 'Product'}</p>
        <p class="text-xs text-gray-600 mt-1">
          <span class="font-medium">${item.qty}</span> × 
          <span>${money(item.price)}</span>
        </p>
      </div>
      <div class="font-bold text-green-600">${money(item.qty * item.price)}</div>
    </div>
  `).join("");

  // حساب المجموع
  const subtotal = cart.reduce((sum, i) => sum + (i.price * i.qty), 0);
  const shipping = subtotal > 0 ? SHIPPING_FEE : 0;
  const total = subtotal + shipping;
  
  subtotalEl.textContent = money(subtotal);
  shippingEl.textContent = money(shipping);
  totalEl.textContent = money(total);
}

// معالجة إرسال الطلب
form.addEventListener("submit", (e) => {
  e.preventDefault();

  // التحقق من السلة
  const cart = window.cartStorage.getCart();
  if (!cart || cart.length === 0) {
    alert("Your cart is empty! Please add products first.");
    window.location.href = "products.html";
    return;
  }

  // جمع بيانات المستخدم
  const formData = {
    firstName: document.getElementById("firstName").value.trim(),
    lastName: document.getElementById("lastName").value.trim(),
    email: document.getElementById("email").value.trim(),
    phone: document.getElementById("phone").value.trim(),
    address: document.getElementById("address").value.trim(),
    city: document.getElementById("city").value.trim(),
    country: document.getElementById("country").value.trim(),
    note: document.getElementById("note").value.trim(),
  };

  // التحقق من البيانات
  if (!formData.firstName || !formData.email || !formData.phone || !formData.address) {
    alert("Please fill all required fields!");
    return;
  }

  // إنشاء الطلب
  const subtotal = cart.reduce((sum, i) => sum + (i.price * i.qty), 0);
  const order = {
    id: Date.now(),
    orderNumber: `VC-${Date.now().toString().slice(-8)}`,
    createdAt: new Date().toISOString(),
    customer: formData,
    items: cart,
    shippingFee: SHIPPING_FEE,
    subtotal: subtotal,
    total: subtotal + SHIPPING_FEE,
    status: 'pending'
  };

  // حفظ الطلب
  const orders = loadOrders();
  orders.push(order);
  saveOrders(orders);

  // تفريغ السلة
  window.cartStorage.clearCart();

  // إظهار رسالة نجاح
  formMsg.classList.remove("hidden");
  
  // الانتقال لصفحة النجاح بعد ثانيتين
  setTimeout(() => {
    const params = new URLSearchParams({
      id: order.id,
      orderNumber: order.orderNumber,
      total: order.total.toFixed(2),
      date: order.createdAt
    });
    window.location.href = `order-success.html?${params.toString()}`;
  }, 1500);
});

// تحميل الملخص عند فتح الصفحة
document.addEventListener('DOMContentLoaded', () => {
  // الانتظار قليلاً لضمان تحميل cartStorage
  setTimeout(renderSummary, 100);
});

// إعادة التحميل إذا تغيرت السلة في تاب آخر
window.addEventListener('storage', (e) => {
  if (e.key === 'vitacare_cart') {
    renderSummary();
  }
});
