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

// نقرأ البيانات من query params
const params = new URLSearchParams(window.location.search);

const id = params.get("id");
const total = params.get("total");
const date = params.get("date");

document.getElementById("orderId").textContent = id ? `#${id}` : "—";
document.getElementById("orderTotal").textContent = total ? money(total) : "—";
document.getElementById("orderDate").textContent = date ? formatDate(date) : "—";
