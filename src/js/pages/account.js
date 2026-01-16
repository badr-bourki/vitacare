const userInfoEl = document.getElementById("userInfo");
const orderHistoryEl = document.getElementById("orderHistory");
const emptyOrdersEl = document.getElementById("emptyOrders");

const session = JSON.parse(localStorage.getItem("vitacare_session"));

if (!session || session.role !== "user") {
  window.location.href = "login.html"; // إعادة التوجيه إذا لم يكن المستخدم مسجلاً الدخول
}

const { firstName, lastName, email, phone } = session;

function money(n) {
  return `$${Number(n).toFixed(2)}`;
}

function formatDate(iso) {
  try {
    return new Date(iso).toLocaleString();
  } catch {
    return iso;
  }
}

// عرض معلومات المستخدم
userInfoEl.innerHTML = `
  <p><span class="font-semibold">Name:</span> ${firstName} ${lastName}</p>
  <p><span class="font-semibold">Email:</span> ${email}</p>
  <p><span class="font-semibold">Phone:</span> ${phone}</p>
`;

// عرض سجل الطلبات
function renderOrderHistory() {
  const orders = JSON.parse(localStorage.getItem("vitacare_orders")) || [];
  const userOrders = orders.filter(order => order.customer.email === email);

  if (!userOrders.length) {
    orderHistoryEl.innerHTML = "";
    emptyOrdersEl.classList.remove("hidden");
    return;
  }

  emptyOrdersEl.classList.add("hidden");

  orderHistoryEl.innerHTML = userOrders.map(order => `
    <div class="border rounded-2xl p-4 mb-4">
      <div class="flex justify-between items-center">
        <div>
          <p class="font-semibold">Order ID: #${order.id}</p>
          <p class="text-sm text-gray-500">Date: ${formatDate(order.createdAt)}</p>
        </div>
        <div>
          <p class="text-lg font-semibold text-green-600">${money(order.total)}</p>
        </div>
      </div>
      <div class="mt-3">
        <p class="text-sm text-gray-500">Status: <span class="font-semibold">${order.status}</span></p>
      </div>
      <a href="order-details.html?id=${order.id}"
         class="text-green-600 font-medium hover:underline mt-2 inline-block">
        View Order Details
      </a>
    </div>
  `).join("");
}

// أول تحميل
renderOrderHistory();
