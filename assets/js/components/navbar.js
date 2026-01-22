// navbar.js - Navigation Component
// Add this to your HTML: <div id="navbar"></div>

function createNavbar() {
    const navbarHTML = `
        <nav class="bg-white/95 backdrop-blur-md shadow-lg fixed w-full z-50">
            <div class="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">

                <!-- Logo -->
                <a href="index.html" class="flex items-center gap-3 logo-container">
                    <!-- Logo Icon -->
                    <div class="logo-icon w-12 h-12 bg-gradient-to-br from-green-500 to-green-700 rounded-xl flex items-center justify-center shadow-lg transition-transform hover:rotate-6 hover:scale-105">
                        <svg class="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5zm0 18c-3.31 0-6-2.69-6-6s2.69-6 6-6 6 2.69 6 6-2.69 6-6 6z"/>
                            <circle cx="12" cy="14" r="2"/>
                        </svg>
                    </div>
                    <!-- Logo Text -->
                    <div class="flex flex-col">
                        <span class="text-2xl font-bold">
                            <span class="text-green-600">Vita</span><span class="text-gray-900">Care</span>
                        </span>
                        <span class="text-[10px] text-gray-500 font-medium tracking-wider uppercase">Health & Beauty</span>
                    </div>
                </a>

                <!-- Desktop Links -->
                <ul class="hidden md:flex space-x-8 font-medium">
                    <li><a href="index.html" class="nav-link hover:text-green-600 transition py-2 relative">Home</a></li>
                    <li><a href="products.html" class="nav-link hover:text-green-600 transition py-2 relative">Products</a></li>
                    <li><a href="about.html" class="nav-link hover:text-green-600 transition py-2 relative">About</a></li>
                    <li><a href="contact.html" class="nav-link hover:text-green-600 transition py-2 relative">Contact</a></li>
                </ul>

                <!-- Actions -->
                <div class="flex items-center space-x-4">
                    <a href="login.html" class="hidden md:block text-sm font-medium text-gray-700 hover:text-green-600 transition px-4 py-2 rounded-lg hover:bg-gray-50">
                        Login
                    </a>
                    <a href="cart.html"
                        class="cart-btn relative bg-gradient-to-r from-green-600 to-green-700 text-white px-5 py-2.5 rounded-full hover:from-green-700 hover:to-green-800 transition shadow-lg hover:shadow-xl flex items-center gap-2 font-medium">
                        <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z"/>
                        </svg>
                        Cart
                        <span id="cartCount"
                            class="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-6 h-6 rounded-full flex items-center justify-center font-bold shadow-md border-2 border-white">0</span>
                    </a>
                    <!-- Mobile Menu Button -->
                    <button id="mobileMenuBtn" class="md:hidden text-gray-800 p-2 hover:bg-gray-100 rounded-lg transition">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M4 6h16M4 12h16M4 18h16"></path>
                        </svg>
                    </button>
                </div>
            </div>

            <!-- Mobile Menu -->
            <div id="mobileMenu" class="hidden md:hidden bg-white border-t shadow-lg">
                <ul class="flex flex-col space-y-1 px-6 py-4">
                    <li><a href="index.html" class="block hover:text-green-600 hover:bg-green-50 transition px-3 py-2 rounded-lg">Home</a></li>
                    <li><a href="products.html" class="block hover:text-green-600 hover:bg-green-50 transition px-3 py-2 rounded-lg">Products</a></li>
                    <li><a href="about.html" class="block hover:text-green-600 hover:bg-green-50 transition px-3 py-2 rounded-lg">About</a></li>
                    <li><a href="contact.html" class="block hover:text-green-600 hover:bg-green-50 transition px-3 py-2 rounded-lg">Contact</a></li>
                    <li class="pt-2 border-t"><a href="login.html" class="block text-green-600 font-medium hover:bg-green-50 transition px-3 py-2 rounded-lg">Login</a></li>
                </ul>
            </div>
        </nav>

        <style>
            /* Navigation Link Underline Effect */
            .nav-link::after {
                content: '';
                position: absolute;
                bottom: -4px;
                left: 0;
                width: 0;
                height: 2px;
                background: #16a34a;
                transition: width 0.3s ease;
            }
            .nav-link:hover::after {
                width: 100%;
            }
            
            /* Cart Button Pulse Effect */
            @keyframes pulse {
                0%, 100% { transform: scale(1); }
                50% { transform: scale(1.05); }
            }
            .cart-btn:hover {
                animation: pulse 0.5s ease;
            }
        </style>
    `;

    // Insert navbar into page
    const navbarContainer = document.getElementById('navbar');
    if (navbarContainer) {
        navbarContainer.innerHTML = navbarHTML;
    }

    // Initialize mobile menu toggle
    initMobileMenu();
    
    // Update cart count
    updateCartCount();
    
    // Set active link
    setActiveLink();
}

// Mobile Menu Toggle
function initMobileMenu() {
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mobileMenu = document.getElementById('mobileMenu');
    
    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
        });
    }
}

// Update Cart Count
function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const total = cart.reduce((sum, item) => sum + item.quantity, 0);
    const cartCountElement = document.getElementById('cartCount');
    if (cartCountElement) {
        cartCountElement.textContent = total;
    }
}

// Set Active Link Based on Current Page
function setActiveLink() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const links = document.querySelectorAll('.nav-link');
    
    links.forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPage || (currentPage === '' && href === 'index.html')) {
            link.classList.add('text-green-600');
            link.style.setProperty('--width', '100%');
        }
    });
}

// Initialize on page load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', createNavbar);
} else {
    createNavbar();
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { createNavbar, updateCartCount };
}
