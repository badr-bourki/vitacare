// ================== SAFETY CHECK ==================
if (!Array.isArray(window.products)) {
  console.error('Products not loaded');
  document.getElementById('details').innerHTML = 'Products data not available.';
  throw new Error('Products missing');
}

// ================== GET PRODUCT ID ==================
const params = new URLSearchParams(window.location.search);
const productId = Number(params.get('id'));

if (!productId) {
  document.getElementById('details').innerHTML = 'Invalid product ID.';
  throw new Error('Invalid product id');
}

// ================== FIND PRODUCT ==================
const product = window.products.find(p => p.id === productId);

// ================== PRODUCT NOT FOUND ==================
if (!product) {
  document.getElementById('details').innerHTML = `
    <div class="col-span-full text-center py-20">
      <h2 class="text-3xl font-bold mb-4">Product Not Found</h2>
      <a href="products.html" class="text-green-600 underline">← Back to Products</a>
    </div>
  `;
  throw new Error('Product not found');
}

// ================== RELATED PRODUCTS ==================
const relatedProducts = window.products
  .filter(p => p.category === product.category && p.id !== product.id)
  .slice(0, 4);

// ================== RENDER PRODUCT ==================
document.getElementById('details').innerHTML = `
<div class="grid md:grid-cols-2 gap-12">

  <div>
    <img src="${product.image}" class="rounded-2xl shadow-lg w-full"
      onerror="this.src='https://via.placeholder.com/600x400?text=No+Image'">
  </div>

  <div>
    <span class="text-green-600 font-bold uppercase">${product.category}</span>
    <h1 class="text-4xl font-bold my-4">${product.name}</h1>

    <div class="flex items-center gap-2 mb-4">
      ${generateStars(product.rating || 4.5)}
      <span>${product.rating || 4.5}</span>
    </div>

    <div class="text-4xl text-green-600 font-bold mb-6">
      ${product.price}
      ${product.oldPrice ? `<span class="text-gray-400 line-through text-xl ml-3">${product.oldPrice}</span>` : ''}
    </div>

    <p class="text-gray-700 mb-6">${product.description}</p>

    <div class="mb-6">
      <label class="font-bold">Quantity</label>
      <div class="flex gap-3 mt-2">
        <button onclick="changeQty(-1)">-</button>
        <input id="quantity" type="number" value="1" min="1" max="99">
        <button onclick="changeQty(1)">+</button>
      </div>
    </div>

    <button
      onclick="addToCart(event, ${product.id})"
      class="bg-green-600 text-white px-6 py-3 rounded-lg"
      ${product.inStock === false ? 'disabled' : ''}>
      ${product.inStock === false ? 'Out of Stock' : 'Add to Cart'}
    </button>

    <button
      onclick="toggleWishlist(event, ${product.id})"
      class="ml-4 border px-6 py-3 rounded-lg">
      ♥
    </button>
  </div>

</div>
`;

// ================== RELATED PRODUCTS ==================
if (relatedProducts.length) {
  const section = document.createElement('div');
  section.className = 'mt-16';
  section.innerHTML = `
    <h2 class="text-3xl font-bold mb-6">Related Products</h2>
    <div class="grid grid-cols-2 md:grid-cols-4 gap-6">
      ${relatedProducts.map(p => `
        <a href="product-details.html?id=${p.id}" class="border rounded-xl p-4 block">
          <img src="${p.image}" class="h-40 w-full object-cover mb-3">
          <h3 class="font-bold">${p.name}</h3>
          <span class="text-green-600">${p.price}</span>
        </a>
      `).join('')}
    </div>
  `;
  document.getElementById('details').appendChild(section);
}

// ================== REVIEWS ==================
addReviewsSection(product);

// ================== FUNCTIONS ==================

function generateStars(rating) {
  let html = '';
  for (let i = 1; i <= 5; i++) {
    html += `<span class="${i <= Math.floor(rating) ? 'text-yellow-400' : 'text-gray-300'}">★</span>`;
  }
  return html;
}

function changeQty(change) {
  const input = document.getElementById('quantity');
  const value = Number(input.value) + change;
  if (value >= 1 && value <= 99) input.value = value;
}

function addToCart(event, id) {
  const qty = Number(document.getElementById('quantity').value);
  const btn = event.currentTarget;
  btn.textContent = 'Added!';
  btn.disabled = true;

  showNotification(`${qty} × ${product.name} added to cart`);
}

function toggleWishlist(event) {
  const btn = event.currentTarget;
  btn.classList.toggle('text-red-500');
  showNotification('Wishlist updated');
}

function showNotification(text) {
  const div = document.createElement('div');
  div.className = 'fixed top-10 right-10 bg-green-600 text-white px-6 py-3 rounded-lg';
  div.textContent = text;
  document.body.appendChild(div);
  setTimeout(() => div.remove(), 3000);
}

function addReviewsSection(product) {
  const div = document.createElement('div');
  div.className = 'mt-20';
  div.innerHTML = `
    <h2 class="text-3xl font-bold mb-6">Customer Reviews</h2>
    <p class="mb-4">${product.reviews || 127} reviews</p>
    ${generateReviews()}
  `;
  document.getElementById('details').appendChild(div);
}

function generateReviews() {
  return `
    <div class="border p-4 rounded-lg mb-4">
      <strong>Sarah M.</strong>
      <p>Great product, highly recommended!</p>
    </div>
    <div class="border p-4 rounded-lg">
      <strong>John D.</strong>
      <p>Worth the price.</p>
    </div>
  `;
}
