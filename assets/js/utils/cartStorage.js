// ================== CART STORAGE SYSTEM ==================
// نظام موحد لإدارة السلة في جميع الصفحات

const CART_NAMESPACE = 'vitacare_cart';
let activeUserId = null;
let activeCartKey = `${CART_NAMESPACE}_guest`;
let authBindingInitialized = false;
let authRetryCount = 0;

function buildCartKey(userId) {
  return `${CART_NAMESPACE}_${userId || 'guest'}`;
}

function switchCartKey(userId) {
  const newKey = buildCartKey(userId);
  if (newKey === activeCartKey) return;

  const previousCart = readCartByKey(activeCartKey);
  const previousKey = activeCartKey;
  activeUserId = userId || null;
  activeCartKey = newKey;

  if (userId && previousCart.length) {
    const userCart = readCartByKey(activeCartKey);
    const merged = mergeCartItems(userCart, previousCart);
    saveCartByKey(activeCartKey, merged);
    if (previousKey.endsWith('_guest')) {
      localStorage.removeItem(previousKey);
    }
  } else {
    updateCartCount();
  }
}

function readCartByKey(key) {
  try {
    const raw = JSON.parse(localStorage.getItem(key)) || [];
    return normalizeCart(raw);
  } catch (e) {
    console.error('Error reading cart key', key, e);
    return [];
  }
}

function saveCartByKey(key, cart) {
  try {
    localStorage.setItem(key, JSON.stringify(normalizeCart(cart)));
    if (key === activeCartKey) {
      updateCartCount();
      window.dispatchEvent(new Event('cartUpdated'));
    }
  } catch (e) {
    console.error('Error saving cart key', key, e);
  }
}

function normalizeCart(items) {
  return (items || []).map(item => ({
    id: item.id,
    name: item.name,
    price: Number(item.price),
    image: item.image,
    category: item.category || 'Product',
    qty: item.qty || item.quantity || 1
  }));
}

function mergeCartItems(target, incoming) {
  const map = new Map();
  normalizeCart(target).forEach(item => map.set(item.id, { ...item }));
  normalizeCart(incoming).forEach(item => {
    if (map.has(item.id)) {
      map.get(item.id).qty += item.qty;
    } else {
      map.set(item.id, { ...item });
    }
  });
  return Array.from(map.values());
}

function ensureAuthBinding() {
  if (authBindingInitialized) return;

  const client = window.VitaCareSupabase?.getClient?.();
  if (!client) {
    if (authRetryCount < 5) {
      authRetryCount += 1;
      setTimeout(ensureAuthBinding, 500 * authRetryCount);
    }
    return;
  }

  authBindingInitialized = true;

  client.auth.onAuthStateChange((_event, session) => {
    switchCartKey(session?.user?.id || null);
  });

  client.auth.getSession()
    .then(({ data }) => switchCartKey(data?.session?.user?.id || null))
    .catch((err) => console.warn('Cart session detection failed', err));
}

ensureAuthBinding();

// ================== GET CART ==================
function getCart() {
  return readCartByKey(activeCartKey);
}

// ================== SAVE CART ==================
function saveCart(cart) {
  saveCartByKey(activeCartKey, cart);
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
  cartToast(`${product.name} added to cart!`, 'success');
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
function cartToast(message, type = 'success') {
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
  updateCartCount,
  syncUserCart: ensureAuthBinding,
  cartToast
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
