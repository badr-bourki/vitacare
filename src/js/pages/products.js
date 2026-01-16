// عناصر الصفحة
const productsGrid = document.getElementById("productsGrid");
const filterButtons = document.querySelectorAll(".filter-btn");

// توليد كارت منتج
function productCardHTML(product) {
  return `
    <div class="product-card border bg-white rounded-2xl overflow-hidden hover:shadow-md transition"
         data-category="${product.category}">

      <!-- ✅ Image link -->
      <a href="product-details.html?id=${product.id}">
        <img src="${product.image}" class="w-full h-52 object-cover" alt="${product.name}" />
      </a>

      <div class="p-4">
        <p class="text-sm text-gray-500">${product.category}</p>

        <!-- ✅ Title link -->
        <h3 class="font-semibold text-lg">
          <a href="product-details.html?id=${product.id}" class="hover:text-green-600">
            ${product.name}
          </a>
        </h3>

        <p class="text-sm text-gray-600 mt-1 line-clamp-2">${product.description}</p>

        <div class="flex justify-between items-center mt-3">
          <span class="font-bold text-green-600">$${product.price}</span>
          <button
            class="add-btn bg-green-600 text-white px-4 py-2 rounded-full text-sm hover:bg-green-700"
            data-id="${product.id}">
            Add
          </button>
        </div>
      </div>
    </div>
  `;
}

// عرض المنتجات
function renderProducts(list) {
  productsGrid.innerHTML = list.map(productCardHTML).join("");
}

// فلترة
function filterProducts(category) {
  if (category === "all") return window.products;
  return window.products.filter((p) => p.category === category);
}

// تفعيل زر active
function setActiveButton(activeBtn) {
  filterButtons.forEach((b) => {
    b.classList.remove("bg-green-600", "text-white");
    b.classList.add("bg-white", "border");
  });

  activeBtn.classList.remove("bg-white", "border");
  activeBtn.classList.add("bg-green-600", "text-white");
}

// Events
filterButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    setActiveButton(btn);
    const category = btn.dataset.filter;
    const filtered = filterProducts(category);
    renderProducts(filtered);
  });
});

// ✅ أول تحميل: عرض الكل
renderProducts(window.products);

// ✅ حدث Add to cart (باستعمال event delegation)
productsGrid.addEventListener("click", (e) => {
  const btn = e.target.closest(".add-btn");
  if (!btn) return;

  const id = Number(btn.dataset.id);
  const product = window.products.find((p) => p.id === id);

  if (!product) return;

  window.cartStorage.addToCart(product);

  // رسالة بسيطة
  btn.textContent = "Added ✓";
  setTimeout(() => (btn.textContent = "Add"), 900);
});
