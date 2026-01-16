const detailsEl = document.getElementById("details");

function getIdFromURL() {
  const params = new URLSearchParams(window.location.search);
  return Number(params.get("id"));
}

function starsHTML(rating = 4.9) {
  const full = Math.floor(rating);
  const hasHalf = rating - full >= 0.5;

  let html = "";
  for (let i = 1; i <= 5; i++) {
    if (i <= full) {
      html += `<span class="text-yellow-400 text-xl">★</span>`;
    } else if (i === full + 1 && hasHalf) {
      html += `<span class="text-yellow-400 text-xl">★</span>`;
    } else {
      html += `<span class="text-gray-300 text-xl">★</span>`;
    }
  }
  return html;
}

function money(n) {
  return `$${Number(n).toFixed(2)}`;
}

const id = getIdFromURL();
const product = window.products.find((p) => p.id === id);

if (!product) {
  detailsEl.innerHTML = `<div class="bg-white p-6 rounded-2xl border">Product not found.</div>`;
} else {
  // بيانات إضافية بسيطة (تقدر تغيّرها لاحقاً لكل منتج)
  const benefits = [
    "High quality ingredients",
    "Supports daily wellness",
    "Premium selected formula",
  ];

  const ingredients = [
    "Natural extracts",
    "Vitamins & minerals",
    "Clean formula",
  ];

  detailsEl.innerHTML = `
    <!-- Left: Image -->
    <div class="bg-white rounded-2xl border overflow-hidden">
      <img src="${product.image}" alt="${product.name}" class="w-full h-[520px] object-cover" />
    </div>

    <!-- Right: Info -->
    <div class="bg-white rounded-2xl border p-6">
      <div class="flex items-center gap-3">
        <div>${starsHTML(4.9)}</div>
        <p class="text-gray-600 text-sm">4.9 (289 reviews)</p>
      </div>

      <h1 class="text-3xl md:text-4xl font-bold mt-3">${product.name}</h1>
      <p class="text-green-700 text-3xl font-extrabold mt-3">${money(product.price)}</p>

      <p class="text-gray-600 mt-4">${product.description}</p>

      <div class="mt-6">
        <h3 class="font-semibold text-lg">Benefits</h3>
        <ul class="mt-3 space-y-2">
          ${benefits.map(b => `
            <li class="flex items-center gap-2 text-gray-700">
              <span class="text-green-600 font-bold">✓</span> ${b}
            </li>
          `).join("")}
        </ul>
      </div>

      <div class="mt-6">
        <h3 class="font-semibold text-lg">Key Ingredients</h3>
        <div class="flex flex-wrap gap-2 mt-3">
          ${ingredients.map(i => `
            <span class="px-4 py-2 rounded-full bg-green-50 text-green-700 text-sm border border-green-100">${i}</span>
          `).join("")}
        </div>
      </div>

      <!-- Quantity + Add -->
      <div class="mt-8 flex flex-col sm:flex-row sm:items-center gap-4">
        <div class="flex items-center border rounded-full overflow-hidden w-fit">
          <button id="decQty" class="w-12 h-12 hover:bg-gray-50">-</button>
          <span id="qty" class="w-14 text-center font-semibold">1</span>
          <button id="incQty" class="w-12 h-12 hover:bg-gray-50">+</button>
        </div>

        <button id="addToCartBtn"
          class="flex-1 bg-green-600 text-white py-3 rounded-full font-medium hover:bg-green-700 transition">
          Add to Cart - ${money(product.price)}
        </button>
      </div>

      <p id="msg" class="text-sm text-green-700 mt-3 hidden">Added to cart ✓</p>
    </div>
  `;

  // Qty logic
  let qty = 1;
  const qtyEl = document.getElementById("qty");
  const dec = document.getElementById("decQty");
  const inc = document.getElementById("incQty");
  const addBtn = document.getElementById("addToCartBtn");
  const msg = document.getElementById("msg");

  function updateBtnText() {
    addBtn.textContent = `Add to Cart - ${money(product.price * qty)}`;
  }

  dec.addEventListener("click", () => {
    qty = Math.max(1, qty - 1);
    qtyEl.textContent = qty;
    updateBtnText();
  });

  inc.addEventListener("click", () => {
    qty += 1;
    qtyEl.textContent = qty;
    updateBtnText();
  });

  addBtn.addEventListener("click", () => {
    for (let i = 0; i < qty; i++) {
      window.cartStorage.addToCart(product);
    }
    msg.classList.remove("hidden");
    setTimeout(() => msg.classList.add("hidden"), 1200);
  });
}
