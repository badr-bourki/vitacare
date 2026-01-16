const userTab = document.getElementById("userTab");
const adminTab = document.getElementById("adminTab");
const form = document.getElementById("loginForm");
const errorMsg = document.getElementById("errorMsg");

let mode = "user"; // user | admin

function setMode(newMode) {
  mode = newMode;

  if (mode === "user") {
    userTab.className = "px-5 py-2 rounded-full bg-green-600 text-white font-medium";
    adminTab.className = "px-5 py-2 rounded-full border hover:bg-gray-50 font-medium";
  } else {
    adminTab.className = "px-5 py-2 rounded-full bg-green-600 text-white font-medium";
    userTab.className = "px-5 py-2 rounded-full border hover:bg-gray-50 font-medium";
  }

  errorMsg.classList.add("hidden");
}

userTab.addEventListener("click", () => setMode("user"));
adminTab.addEventListener("click", () => setMode("admin"));

function saveSession(session) {
  localStorage.setItem("vitacare_session", JSON.stringify(session));
}

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value.trim().toLowerCase();
  const password = document.getElementById("password").value;

  // Demo credentials
  const USER_EMAIL = "user@vitacare.com";
  const USER_PASS = "123456";

  const ADMIN_EMAIL = "admin@vitacare.com";
  const ADMIN_PASS = "admin123";

  if (mode === "user") {
    if (email !== USER_EMAIL || password !== USER_PASS) {
      errorMsg.textContent = "Wrong user email or password.";
      errorMsg.classList.remove("hidden");
      return;
    }

    saveSession({ role: "user", email, loginAt: new Date().toISOString() });
    window.location.href = "account.html";
    return;
  }

  // admin
  if (email !== ADMIN_EMAIL || password !== ADMIN_PASS) {
    errorMsg.textContent = "Wrong admin email or password.";
    errorMsg.classList.remove("hidden");
    return;
  }

  saveSession({ role: "admin", email, loginAt: new Date().toISOString() });
  window.location.href = "admin.html";
});
