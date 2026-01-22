// productCard.js - Product Card Component & Cart Management

// Product Card HTML Generator
function createProductCard(product) {
    return `
        <div class="product-card border rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 group bg-white">
            <!-- Product Image -->
            <div class="relative overflow-hidden">
                <img src="${product.image}" 
                     alt="${product.name}" 
                     class="w-full h-52 object-cover group-hover:scale-110 transition-transform duration-500"
                     onerror="this.src='https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=400&h=400&fit=crop'">
                
                <!-- Sale Badge -->
                ${product.salePrice ? `
                    <div class="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                        SALE
                    </div>
                ` : ''}
                
                <!-- Quick View Button -->
                <button onclick="quickView(${product.id})" 
                        class="absolute top-3 right-3 w-10 h-10 bg-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg hover:bg-green-50">
                    <svg class="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                    </svg>
                </button>
            </div>
            
            <!-- Product Info -->
            <div class="p-4">
                <!-- Category -->
                <p class="text-sm text-gray-500 uppercase tracking-wide">${product.category}</p>
                
                <!-- Product Name -->
                <h3 class="font-semibold text-lg mt-1 mb-2 line-clamp-2 hover:text-green-600 transition">
                    <a href="product-detail.html?id=${product.id}">${product.name}</a>
                </h3>
                
                <!-- Rating -->
                ${product.rating ? `
                    <div class="flex items-center gap-1 mb-2">
                        ${generateStars(product.rating)}
                        <span class="text-xs text-gray-500 ml-1">(${product.reviews || 0})</span>
                    </div>
                ` : ''}
                
                <!-- Price & Cart -->
                <div class="flex justify-between items-center mt-3">
                    <div>
                        ${product.salePrice ? `
                            <div class="flex items-center gap-2">
                                <span class="font-bold text-green-600 text-lg">$${product.salePrice}</span>
                                <span class="text-sm text-gray-400 line-through">$${product.price}</span>
                            </div>
                        ` : `
                            <span class="font-bold text-green-600 text-lg">$${product.price}</span>
                        `}
                    </div>
                    
                    <button onclick="addToCart(${product.id})" 
                            class="bg-green-600 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-green-700 transition-all hover:shadow-lg flex items-center gap-1">
                        <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z"/>
                        </svg>
                        Add
                    </button>
                </div>
            </div>
        </div>
    `;
}

// Generate Star Rating
function generateStars(rating) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    let stars = '';
    
    for (let i = 0; i < 5; i++) {
        if (i < fullStars) {
            stars += '<svg class="w-4 h-4 text-yellow-400 inline" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>';
        } else if (i === fullStars && hasHalfStar) {
            stars += '<svg class="w-4 h-4 text-yellow-400 inline" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" opacity="0.5"/></svg>';
        } else {
            stars += '<svg class="w-4 h-4 text-gray-300 inline" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>';
        }
    }
    
    return stars;
}

// Render Products to Container
function renderProducts(products, containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    container.innerHTML = products.map(product => createProductCard(product)).join('');
}

// ==================== CART MANAGEMENT ====================

// Get Cart from LocalStorage
function getCart() {
    return JSON.parse(localStorage.getItem('cart') || '[]');
}

// Save Cart to LocalStorage
function saveCart(cart) {
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    updateCartUI();
}

// Add Product to Cart
function addToCart(productId) {
    // Get product from your products array
    const product = getAllProducts().find(p => p.id === productId);
    if (!product) {
        console.error('Product not found');
        return;
    }

    const cart = getCart();
    const existingItem = cart.find(item => item.id === productId);

    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.salePrice || product.price,
            image: product.image,
            category: product.category,
            quantity: 1
        });
    }

    saveCart(cart);
    showToast('Product added to cart! 🛒');
}

// Remove from Cart
function removeFromCart(productId) {
    let cart = getCart();
    cart = cart.filter(item => item.id !== productId);
    saveCart(cart);
    showToast('Product removed from cart');
}

// Update Cart Item Quantity
function updateCartQuantity(productId, quantity) {
    const cart = getCart();
    const item = cart.find(item => item.id === productId);
    
    if (item) {
        if (quantity <= 0) {
            removeFromCart(productId);
        } else {
            item.quantity = quantity;
            saveCart(cart);
        }
    }
}

// Clear Cart
function clearCart() {
    if (confirm('Are you sure you want to clear your cart?')) {
        localStorage.removeItem('cart');
        updateCartCount();
        updateCartUI();
        showToast('Cart cleared');
    }
}

// Get Cart Total
function getCartTotal() {
    const cart = getCart();
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
}

// Get Cart Item Count
function getCartItemCount() {
    const cart = getCart();
    return cart.reduce((total, item) => total + item.quantity, 0);
}

// Update Cart Count Badge
function updateCartCount() {
    const count = getCartItemCount();
    const cartCountElements = document.querySelectorAll('#cartCount');
    cartCountElements.forEach(el => {
        el.textContent = count;
    });
}

// Update Cart UI (for cart page)
function updateCartUI() {
    const cartContainer = document.getElementById('cartItems');
    if (!cartContainer) return;
    
    const cart = getCart();
    
    if (cart.length === 0) {
        cartContainer.innerHTML = `
            <div class="text-center py-16">
                <svg class="w-24 h-24 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/>
                </svg>
                <h3 class="text-xl font-semibold text-gray-700 mb-2">Your cart is empty</h3>
                <p class="text-gray-500 mb-6">Add some products to get started!</p>
                <a href="products.html" class="inline-block bg-green-600 text-white px-6 py-3 rounded-full hover:bg-green-700 transition">
                    Browse Products
                </a>
            </div>
        `;
        return;
    }
    
    // Render cart items
    cartContainer.innerHTML = cart.map(item => `
        <div class="flex items-center gap-4 p-4 bg-white rounded-lg border">
            <img src="${item.image}" alt="${item.name}" class="w-20 h-20 object-cover rounded">
            <div class="flex-1">
                <h3 class="font-semibold">${item.name}</h3>
                <p class="text-sm text-gray-500">${item.category}</p>
                <p class="font-bold text-green-600 mt-1">$${item.price}</p>
            </div>
            <div class="flex items-center gap-2">
                <button onclick="updateCartQuantity(${item.id}, ${item.quantity - 1})" class="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200">-</button>
                <span class="w-12 text-center font-semibold">${item.quantity}</span>
                <button onclick="updateCartQuantity(${item.id}, ${item.quantity + 1})" class="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200">+</button>
            </div>
            <button onclick="removeFromCart(${item.id})" class="text-red-500 hover:text-red-700">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                </svg>
            </button>
        </div>
    `).join('');
    
    // Update total
    const totalElement = document.getElementById('cartTotal');
    if (totalElement) {
        totalElement.textContent = `$${getCartTotal().toFixed(2)}`;
    }
}

// Show Toast Notification
function showToast(message) {
    const toast = document.getElementById('toast');
    if (toast) {
        toast.textContent = message;
        toast.classList.remove('hidden');
        setTimeout(() => toast.classList.add('hidden'), 3000);
    }
}

// Quick View Modal
function quickView(productId) {
    const product = getAllProducts().find(p => p.id === productId);
    if (!product) return;
    
    // Create modal (you can customize this)
    alert(`Quick View: ${product.name}\nPrice: $${product.price}\nCategory: ${product.category}`);
    // In production, you'd show a proper modal here
}

// Get All Products (This should be defined in your main products data file)
function getAllProducts() {
    // This is a placeholder - replace with your actual products array
    return window.productsData || [];
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    updateCartCount();
    updateCartUI();
});

// Export functions
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        createProductCard,
        renderProducts,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        getCart,
        getCartTotal,
        getCartItemCount
    };
}
