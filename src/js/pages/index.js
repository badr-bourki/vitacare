// Featured Products Data
const featuredProducts = [
    { id: 1, name: 'Vitamin C Serum', category: 'Skincare', price: 19.99, image: '../assets/images/products/p1.jpeg' },
    { id: 2, name: 'Omega 3', category: 'Supplements', price: 14.50, image: '../assets/images/products/p2.jpeg' },
    { id: 3, name: 'Aloe Body Lotion', category: 'Body Care', price: 11.00, image: '../assets/images/products/p3.jpeg' },
    { id: 4, name: 'Multivitamin', category: 'Health', price: 16.75, image: '../assets/images/products/p4.jpeg' }
];

// Load Products - الآن مع روابط صحيحة
function loadFeaturedProducts() {
    const container = document.getElementById('featuredProducts');
    container.innerHTML = featuredProducts.map(p => `
        <div class="border rounded-2xl overflow-hidden hover:shadow-lg transition group">
            <!-- الصورة كلها رابط -->
            <a href="pages/product-details.html?id=${p.id}" class="block">
                <img src="${p.image}" 
                     class="w-full h-52 object-cover group-hover:scale-105 transition duration-300"
                     onerror="this.src='https://via.placeholder.com/300x200?text=${p.name}'">
            </a>
            <div class="p-4">
                <p class="text-sm text-gray-500">${p.category}</p>
                <!-- اسم المنتج كرابط -->
                <a href="pages/product-details.html?id=${p.id}" class="block">
                    <h3 class="font-semibold text-lg mt-1 hover:text-green-600 transition">${p.name}</h3>
                </a>
                <div class="flex justify-between items-center mt-3">
                    <span class="font-bold text-green-600">$${p.price.toFixed(2)}</span>
                    <button onclick="addToCart(${p.id})" 
                            class="bg-green-600 text-white px-4 py-2 rounded-full text-sm hover:bg-green-700 transition">
                        Add to Cart
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

// ✅ تم حذف الدوال القديمة - نستخدم cartStorage الآن

function addToCart(productId) {
    const product = featuredProducts.find(p => p.id === productId);
    if (!product) return;

    // ✅ استخدام cartStorage.addToCart بدلاً من الكود المخصص
    if (window.cartStorage) {
        window.cartStorage.addToCart(product, 1);
    } else {
        console.error('cartStorage not loaded!');
        alert('Error adding to cart. Please refresh the page.');
    }
}

function updateCartCount() {
    // ✅ استخدام cartStorage
    if (window.cartStorage) {
        window.cartStorage.updateCartCount();
    }
}

// ✅ تم حذف showToast - نستخدم cartStorage.showNotification

// Mobile Menu
document.getElementById('mobileMenuBtn').addEventListener('click', () => {
    document.getElementById('mobileMenu').classList.toggle('hidden');
});

// Year
document.getElementById('year').textContent = new Date().getFullYear();

// Initialize
loadFeaturedProducts();
updateCartCount();