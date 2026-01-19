// footer.js - Footer Component
// Add this to your HTML: <div id="footer"></div>

function createFooter() {
    const currentYear = new Date().getFullYear();
    
    const footerHTML = `
        <footer class="bg-gray-900 text-gray-200 pt-14 pb-8">
            <div class="max-w-7xl mx-auto px-6">
                <div class="grid grid-cols-1 md:grid-cols-4 gap-10">
                    
                    <!-- Company Info -->
                    <div>
                        <div class="flex items-center gap-2 mb-3">
                            <div class="w-10 h-10 bg-gradient-to-br from-green-500 to-green-700 rounded-lg flex items-center justify-center">
                                <svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5zm0 18c-3.31 0-6-2.69-6-6s2.69-6 6-6 6 2.69 6 6-2.69 6-6 6z"/>
                                    <circle cx="12" cy="14" r="2"/>
                                </svg>
                            </div>
                            <h3 class="text-2xl font-bold">
                                <span class="text-green-400">Vita</span><span class="text-white">Care</span>
                            </h3>
                        </div>
                        <p class="text-gray-400 text-sm leading-relaxed">
                            منتجات العناية والجمال والصحة والمكملات الغذائية بجودة عالية. 
                            هدفنا: حياة أفضل، صحة أفضل، وثقة أكبر.
                        </p>
                        
                        <!-- Social Media -->
                        <div class="flex gap-3 mt-5">
                            <a href="#" class="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-green-600 transition" aria-label="Facebook">
                                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                                </svg>
                            </a>
                            <a href="#" class="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-green-600 transition" aria-label="Instagram">
                                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                                </svg>
                            </a>
                            <a href="#" class="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-green-600 transition" aria-label="LinkedIn">
                                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                                </svg>
                            </a>
                            <a href="#" class="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-green-600 transition" aria-label="WhatsApp">
                                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                                </svg>
                            </a>
                        </div>
                    </div>
                    
                    <!-- Quick Links -->
                    <div>
                        <h4 class="font-semibold text-lg mb-4 text-white">Quick Links</h4>
                        <ul class="space-y-2 text-gray-400">
                            <li><a class="hover:text-white transition hover:translate-x-1 inline-block" href="index.html">Home</a></li>
                            <li><a class="hover:text-white transition hover:translate-x-1 inline-block" href="products.html">Products</a></li>
                            <li><a class="hover:text-white transition hover:translate-x-1 inline-block" href="about.html">About</a></li>
                            <li><a class="hover:text-white transition hover:translate-x-1 inline-block" href="contact.html">Contact</a></li>
                            <li><a class="hover:text-white transition hover:translate-x-1 inline-block" href="#">Blog</a></li>
                        </ul>
                    </div>
                    
                    <!-- Support -->
                    <div>
                        <h4 class="font-semibold text-lg mb-4 text-white">Support</h4>
                        <ul class="space-y-2 text-gray-400">
                            <li><a class="hover:text-white transition hover:translate-x-1 inline-block" href="#">Shipping & Delivery</a></li>
                            <li><a class="hover:text-white transition hover:translate-x-1 inline-block" href="#">Returns Policy</a></li>
                            <li><a class="hover:text-white transition hover:translate-x-1 inline-block" href="#">Privacy Policy</a></li>
                            <li><a class="hover:text-white transition hover:translate-x-1 inline-block" href="#">Terms & Conditions</a></li>
                            <li><a class="hover:text-white transition hover:translate-x-1 inline-block" href="#">FAQ</a></li>
                        </ul>
                    </div>
                    
                    <!-- Contact -->
                    <div>
                        <h4 class="font-semibold text-lg mb-4 text-white">Contact</h4>
                        <ul class="space-y-3 text-gray-400 text-sm">
                            <li class="flex items-start gap-2">
                                <svg class="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                    <path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd"/>
                                </svg>
                                <span>Casablanca, Morocco</span>
                            </li>
                            <li class="flex items-center gap-2">
                                <svg class="w-5 h-5 text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"/>
                                </svg>
                                <a href="tel:+212600000000" class="hover:text-white transition">+212 6 00 00 00 00</a>
                            </li>
                            <li class="flex items-center gap-2">
                                <svg class="w-5 h-5 text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"/>
                                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"/>
                                </svg>
                                <a href="mailto:support@vitacare.com" class="hover:text-white transition">support@vitacare.com</a>
                            </li>
                        </ul>
                        
                        <!-- Newsletter -->
                        <div class="mt-5">
                            <p class="text-sm text-gray-400 mb-2">Subscribe to our newsletter</p>
                            <div class="flex gap-2">
                                <input type="email" placeholder="Your email" class="flex-1 px-3 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white text-sm focus:outline-none focus:border-green-500">
                                <button class="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition text-sm font-medium">
                                    Subscribe
                                </button>
                            </div>
                        </div>
                    </div>
                    
                </div>
                
                <!-- Bottom Bar -->
                <div class="border-t border-gray-800 mt-10 pt-6 flex flex-col md:flex-row justify-between items-center gap-4 text-gray-500 text-sm">
                    <p>© ${currentYear} VitaCare. All rights reserved.</p>
                    <div class="flex gap-6">
                        <a href="#" class="hover:text-white transition">Privacy</a>
                        <a href="#" class="hover:text-white transition">Terms</a>
                        <a href="#" class="hover:text-white transition">Cookies</a>
                    </div>
                </div>
            </div>
        </footer>
    `;

    // Insert footer into page
    const footerContainer = document.getElementById('footer');
    if (footerContainer) {
        footerContainer.innerHTML = footerHTML;
    }

    // Initialize newsletter subscription
    initNewsletterForm();
}

// Newsletter Subscription Handler
function initNewsletterForm() {
    const form = document.querySelector('footer input[type="email"]');
    const button = document.querySelector('footer button');
    
    if (form && button) {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const email = form.value.trim();
            
            if (email && validateEmail(email)) {
                // Here you would normally send to your backend
                alert('Thank you for subscribing! 🎉');
                form.value = '';
            } else {
                alert('Please enter a valid email address.');
            }
        });
    }
}

// Email Validation
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Initialize on page load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', createFooter);
} else {
    createFooter();
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { createFooter };
}