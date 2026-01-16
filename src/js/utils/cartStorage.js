const CART_KEY = "vitacare_cart";

function getCart() {
  return JSON.parse(localStorage.getItem(CART_KEY)) || [];
}

function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

function addToCart(product) {
  const cart = getCart();

  const existing = cart.find((item) => item.id === product.id);

  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ ...product, qty: 1 });
  }

  saveCart(cart);
  return cart;
}

function removeFromCart(id) {
  const cart = getCart().filter((item) => item.id !== id);
  saveCart(cart);
  return cart;
}

function updateQty(id, qty) {
  const cart = getCart();
  const item = cart.find((i) => i.id === id);

  if (!item) return cart;

  item.qty = qty;

  // إذا qty = 0 نحذف
  const cleaned = cart.filter((i) => i.qty > 0);

  saveCart(cleaned);
  return cleaned;
}

function cartCount() {
  const cart = getCart();
  return cart.reduce((sum, item) => sum + item.qty, 0);
}

// نجعلهم Global للاستعمال في صفحات HTML العادية
window.cartStorage = {
  getCart,
  saveCart,
  addToCart,
  removeFromCart,
  updateQty,
  cartCount,
};
