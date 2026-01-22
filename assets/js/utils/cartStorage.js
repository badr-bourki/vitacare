// ================== CART STORAGE SYSTEM ==================
// نظام موحد لإدارة السلة في جميع الصفحات

const CART_KEY = 'vitacare_cart';

// ================== GET CART ==================
function getCart() {
  try {
    const cart = JSON.parse(localStorage.getItem(CART_KEY)) || [];
    // تطبيع البيانات: تحويل quantity إلى qty
    return cart.map(item => ({
      id: item.id,
      name: item.name,
      price: Number(item.price),
      image: item.image,
      category: item.category || 'Product',
      qty: item.qty || item.quantity || 1  // ✅ دعم كلا المفتاحين
    }));
  } catch (e) {
    console.error('Error reading cart:', e);
    return [];
  }
}

// ================== SAVE CART ==================
function saveCart(cart) {
  try {
    // تأكد أن جميع العناصر تستخدم qty
    const normalizedCart = cart.map(item => ({
      id: item.id,
      name: item.name,
      price: Number(item.price),
      image: item.image,
      category: item.category || 'Product',
      qty: item.qty || item.quantity || 1
    }));
    
    localStorage.setItem(CART_KEY, JSON.stringify(normalizedCart));
    updateCartCount();
    
    // إرسال حدث للصفحات الأخرى
    window.dispatchEvent(new Event('cartUpdated'));
  } catch (e) {
    console.error('Error saving cart:', e);
  }
}

// ================== ADD TO CART ==================
function addToCart(product, quantity = 1) {
  const cart = getCart();
  const existing = cart.find(item => item.id === product.id);
  
  if (existing) {
    existing.qty += quantity;
  } else {
    cart.push({
      id: product.id,
      name: product.name,
      price: Number(product.price),
      image: product.image,
      category: product.category || 'Product',
      qty: quantity
    });
  }
  
  saveCart(cart);
  showNotification(`${product.name} added to cart!`, 'success');
  return cart;
}

// ================== UPDATE QUANTITY ==================
function updateQuantity(productId, quantity) {
  const cart = getCart();
  const item = cart.find(i => i.id === productId);
  
  if (item) {
    item.qty = Math.max(1, Math.min(99, quantity)); // بين 1 و 99
    saveCart(cart);
  }
  
  return cart;
}

// ================== REMOVE FROM CART ==================
function removeFromCart(productId) {
  let cart = getCart();
  cart = cart.filter(item => item.id !== productId);
  saveCart(cart);
  return cart;
}

// ================== CLEAR CART ==================
function clearCart() {
  saveCart([]);
}

// ================== GET TOTAL ==================
function getCartTotal() {
  const cart = getCart();
  return cart.reduce((total, item) => total + (item.price * item.qty), 0);
}

// ================== GET COUNT ==================
function getCartCount() {
  const cart = getCart();
  return cart.reduce((count, item) => count + item.qty, 0);
}

// ================== UPDATE CART BADGE ==================
function updateCartCount() {
  const count = getCartCount();
  const badge = document.getElementById('cartCount');
  
  if (badge) {
    badge.textContent = count;
    
    // تأثير بصري
    if (count > 0) {
      badge.classList.remove('hidden');
      badge.classList.add('animate-bounce');
      setTimeout(() => badge.classList.remove('animate-bounce'), 500);
    }
  }
}

// ================== NOTIFICATIONS ==================
function showNotification(message, type = 'success') {
  // البحث عن toast موجود أو إنشاء واحد جديد
  let toast = document.getElementById('toast');
  
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toast';
    document.body.appendChild(toast);
  }
  
  const colors = {
    success: 'bg-green-600',
    error: 'bg-red-600',
    info: 'bg-blue-600',
    warning: 'bg-yellow-600'
  };
  
  toast.className = `fixed bottom-8 right-8 ${colors[type]} text-white px-6 py-3 rounded-lg shadow-lg z-[9999] transition-all duration-300`;
  toast.textContent = message;
  toast.style.display = 'block';
  toast.style.opacity = '1';
  toast.style.transform = 'translateY(0)';
  
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(20px)';
    setTimeout(() => {
      toast.style.display = 'none';
    }, 300);
  }, 3000);
}

// ================== EXPORT TO WINDOW ==================
window.cartStorage = {
  getCart,
  saveCart,
  addToCart,
  updateQuantity,
  removeFromCart,
  clearCart,
  getCartTotal,
  getCartCount,
  updateCartCount
};

// ================== INIT ON LOAD ==================
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', updateCartCount);
} else {
  updateCartCount();
}

// ================== LOG للتأكد ==================
console.log('✅ cartStorage loaded successfully');
console.log('📦 Current cart:', getCart());
