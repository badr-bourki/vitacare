// التأكد من تحميل المنتجات
if (!window.products) {
  console.error('Products data not loaded!');
}

const grid = document.getElementById('productsGrid');
const filterBtns = document.querySelectorAll('.filter-btn');
const searchInput = document.getElementById('searchInput');
const sortSelect = document.getElementById('sortSelect');

let currentFilter = 'all';
let currentSearch = '';
let currentSort = 'default';

// ✨ عرض المنتجات مع أنيميشن
function renderProducts(filter = 'all', searchTerm = '', sortBy = 'default') {
  grid.style.opacity = '0';
  
  setTimeout(() => {
    grid.innerHTML = '';
    
    let filtered = filter === 'all' 
      ? [...window.products] 
      : window.products.filter(p => p.category === filter);
    
    // البحث
    if (searchTerm) {
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // الترتيب
    switch(sortBy) {
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'name':
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
    }

    // رسالة إذا لم يوجد منتجات
    if (filtered.length === 0) {
      grid.innerHTML = `
        <div class="col-span-full text-center py-20">
          <svg class="w-24 h-24 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <h3 class="text-xl font-semibold text-gray-600">No products found</h3>
          <p class="text-gray-400 mt-2">Try adjusting your search or filters</p>
        </div>
      `;
      grid.style.opacity = '1';
      return;
    }

    filtered.forEach((product, index) => {
      const card = document.createElement('div');
      card.className = 'bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2';
      card.style.animation = `fadeInUp 0.5s ease-out ${index * 0.1}s both`;
      
      // ✨ شارة "New" للمنتجات الجديدة
      const isNew = product.id > 12;
      
      card.innerHTML = `
        <div class="relative overflow-hidden group">
          <img src="${product.image}" alt="${product.name}" 
               class="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
               onerror="this.src='https://via.placeholder.com/300x200?text=No+Image'">
          ${isNew ? '<span class="absolute top-2 right-2 bg-green-600 text-white text-xs px-3 py-1 rounded-full font-semibold">New</span>' : ''}
          
          <!-- ✨ Quick View Button -->
          <div class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
            <button onclick="quickView(${product.id})" class="bg-white text-gray-800 px-4 py-2 rounded-full font-semibold transform scale-90 group-hover:scale-100 transition-transform">
              Quick View
            </button>
          </div>
        </div>
        
        <div class="p-4">
          <div class="flex items-start justify-between mb-2">
            <h3 class="font-semibold text-lg flex-1">${product.name}</h3>
            <button onclick="toggleWishlist(${product.id})" class="text-gray-400 hover:text-red-500 transition ml-2">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
              </svg>
            </button>
          </div>
          
          <p class="text-gray-600 text-sm mb-3 line-clamp-2">${product.description}</p>
          
          <!-- ✨ تقييم المنتج -->
          <div class="flex items-center gap-1 mb-3">
            ${generateStars(4.5)}
            <span class="text-sm text-gray-500 ml-2">(127 reviews)</span>
          </div>
          
          <div class="flex items-center justify-between">
            <div>
              <span class="text-green-600 font-bold text-xl">$${product.price}</span>
              ${product.oldPrice ? `<span class="text-gray-400 line-through text-sm ml-2">$${product.oldPrice}</span>` : ''}
            </div>
                <button onclick="addToCartQuick(event, ${product.id})" 
                    class="bg-green-600 text-white px-4 py-2 rounded-full text-sm hover:bg-green-700 transition-all hover:shadow-lg active:scale-95">
              <svg class="w-5 h-5 inline-block mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path>
              </svg>
              Add
            </button>
          </div>
        </div>
      `;
      grid.appendChild(card);
    });
    
    grid.style.opacity = '1';
  }, 150);
}

// ✨ توليد النجوم
function generateStars(rating) {
  let stars = '';
  for (let i = 1; i <= 5; i++) {
    if (i <= Math.floor(rating)) {
      stars += '<svg class="w-4 h-4 text-yellow-400 inline-block" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>';
    } else if (i - rating < 1) {
      stars += '<svg class="w-4 h-4 text-yellow-400 inline-block" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" opacity="0.5"></path></svg>';
    } else {
      stars += '<svg class="w-4 h-4 text-gray-300 inline-block" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>';
    }
  }
  return stars;
}

function getCartAPI() {
  if (window.cartStorage) return window.cartStorage;
  console.error('cartStorage not loaded');
  showNotification('Cart system not ready', 'error');
  return null;
}

function toggleButtonState(btn, added = false) {
  if (!btn) return;
  if (added) {
    btn.innerHTML = '<svg class="w-5 h-5 inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg> Added';
    btn.classList.add('bg-green-700');
    btn.disabled = true;
  } else {
    btn.innerHTML = '<svg class="w-5 h-5 inline-block mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>Add';
    btn.classList.remove('bg-green-700');
    btn.disabled = false;
  }
}

// ✨ إضافة سريعة للسلة مع إشعار
function addToCartQuick(event, id) {
  const btn = event?.currentTarget || event?.target?.closest('button');
  const api = getCartAPI();
  if (!api) return;

  const product = window.products?.find?.(p => p.id === id);
  if (!product) {
    showNotification('Product not found', 'error');
    return;
  }

  api.addToCart(product, 1);
  toggleButtonState(btn, true);
  setTimeout(() => toggleButtonState(btn, false), 2000);
}

// ✨ نظام الإشعارات
function showNotification(message, type = 'success') {
  const notification = document.createElement('div');
  notification.className = `fixed top-24 right-6 px-6 py-4 rounded-lg shadow-lg transform translate-x-0 transition-all duration-300 z-50 ${
    type === 'success' ? 'bg-green-600' : 'bg-red-600'
  } text-white`;
  notification.innerHTML = `
    <div class="flex items-center gap-3">
      <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
      </svg>
      <span>${message}</span>
    </div>
  `;
  
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.style.transform = 'translateX(400px)';
    setTimeout(() => notification.remove(), 300);
  }, 3000);
}

// ✨ Quick View Modal
function quickView(id) {
  const product = window.products.find(p => p.id === id);
  
  const modal = document.createElement('div');
  modal.className = 'fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4';
  modal.onclick = (e) => {
    if (e.target === modal) modal.remove();
  };
  
  modal.innerHTML = `
    <div class="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto" onclick="event.stopPropagation()">
      <div class="grid md:grid-cols-2 gap-6 p-6">
        <div>
          <img src="${product.image}" alt="${product.name}" class="w-full rounded-lg">
        </div>
        <div>
          <button onclick="this.closest('.fixed').remove()" class="float-right text-gray-400 hover:text-gray-600">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
          <h2 class="text-3xl font-bold mb-4">${product.name}</h2>
          <div class="flex items-center gap-2 mb-4">
            ${generateStars(4.5)}
            <span class="text-sm text-gray-500">(127 reviews)</span>
          </div>
          <p class="text-gray-600 mb-6">${product.description}</p>
          <div class="text-3xl font-bold text-green-600 mb-6">$${product.price}</div>
          <div class="flex gap-3">
                <button onclick="addToCartQuick(event, ${product.id}); this.closest('.fixed').remove();" 
                    class="flex-1 bg-green-600 text-white px-6 py-3 rounded-full hover:bg-green-700 transition">
              Add to Cart
            </button>
            <a href="product-details.html?id=${product.id}" 
               class="bg-gray-100 text-gray-800 px-6 py-3 rounded-full hover:bg-gray-200 transition">
              Full Details
            </a>
          </div>
        </div>
      </div>
    </div>
  `;
  
  document.body.appendChild(modal);
}

// ✨ Wishlist
function toggleWishlist(id) {
  const btn = event.target.closest('button');
  const svg = btn.querySelector('svg');
  
  if (svg.getAttribute('fill') === 'currentColor') {
    svg.setAttribute('fill', 'none');
    btn.classList.remove('text-red-500');
    btn.classList.add('text-gray-400');
    showNotification('Removed from wishlist', 'success');
  } else {
    svg.setAttribute('fill', 'currentColor');
    btn.classList.remove('text-gray-400');
    btn.classList.add('text-red-500');
    showNotification('Added to wishlist!', 'success');
  }
}

// Event Listeners
filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => {
      b.classList.remove('bg-green-600', 'text-white');
      b.classList.add('bg-white', 'border');
    });
    
    btn.classList.remove('bg-white', 'border');
    btn.classList.add('bg-green-600', 'text-white');
    
    currentFilter = btn.dataset.filter;
    renderProducts(currentFilter, currentSearch, currentSort);
  });
});

if (searchInput) {
  searchInput.addEventListener('input', (e) => {
    currentSearch = e.target.value;
    renderProducts(currentFilter, currentSearch, currentSort);
  });
}

if (sortSelect) {
  sortSelect.addEventListener('change', (e) => {
    currentSort = e.target.value;
    renderProducts(currentFilter, currentSearch, currentSort);
  });
}

// ✨ أنيميشن CSS
const style = document.createElement('style');
style.textContent = `
  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(30px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  .line-clamp-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
`;
document.head.appendChild(style);

// عرض المنتجات عند التحميل
renderProducts();
