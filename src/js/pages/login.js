/**
 * VitaCare Login System
 * Handles user and admin authentication with enhanced security and UX
 */

// DOM Elements
const userTab = document.getElementById("userTab");
const adminTab = document.getElementById("adminTab");
const form = document.getElementById("loginForm");
const errorMsg = document.getElementById("errorMsg");
const errorText = document.getElementById("errorText");
const successMsg = document.getElementById("successMsg");
const successText = document.getElementById("successText");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const togglePasswordBtn = document.getElementById("togglePassword");

// State Management
let mode = "user"; // 'user' or 'admin'
let isSubmitting = false;

/**
 * Initialize the login page
 */
function init() {
  setupEventListeners();
  checkExistingSession();
  setupPasswordToggle();
  setupFormValidation();
}

/**
 * Setup all event listeners
 */
function setupEventListeners() {
  userTab.addEventListener("click", () => setMode("user"));
  adminTab.addEventListener("click", () => setMode("admin"));
  form.addEventListener("submit", handleLogin);
  
  // Clear error on input
  emailInput.addEventListener("input", clearMessages);
  passwordInput.addEventListener("input", clearMessages);
}

/**
 * Switch between user and admin mode
 * @param {string} newMode - 'user' or 'admin'
 */
function setMode(newMode) {
  mode = newMode;
  updateTabStyles();
  clearMessages();
  
  // Optional: Pre-fill demo credentials for better UX
  if (newMode === "user") {
    emailInput.placeholder = "user@vitacare.com";
  } else {
    emailInput.placeholder = "admin@vitacare.com";
  }
}

/**
 * Update tab button styles based on current mode
 */
function updateTabStyles() {
  if (mode === "user") {
    userTab.className = "flex-1 px-6 py-3 rounded-full bg-green-600 text-white font-semibold transition-all duration-300 shadow-lg";
    adminTab.className = "flex-1 px-6 py-3 rounded-full text-gray-600 font-semibold hover:bg-gray-200 transition-all duration-300";
  } else {
    adminTab.className = "flex-1 px-6 py-3 rounded-full bg-green-600 text-white font-semibold transition-all duration-300 shadow-lg";
    userTab.className = "flex-1 px-6 py-3 rounded-full text-gray-600 font-semibold hover:bg-gray-200 transition-all duration-300";
  }
}

/**
 * Setup password visibility toggle
 */
function setupPasswordToggle() {
  if (togglePasswordBtn) {
    togglePasswordBtn.addEventListener("click", () => {
      const type = passwordInput.type === "password" ? "text" : "password";
      passwordInput.type = type;
      
      const icon = togglePasswordBtn.querySelector("i");
      icon.classList.toggle("fa-eye");
      icon.classList.toggle("fa-eye-slash");
    });
  }
}

/**
 * Setup real-time form validation
 */
function setupFormValidation() {
  emailInput.addEventListener("blur", validateEmail);
  passwordInput.addEventListener("blur", validatePassword);
}

/**
 * Validate email format
 */
function validateEmail() {
  const email = emailInput.value.trim();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
  if (email && !emailRegex.test(email)) {
    showError("Please enter a valid email address");
    return false;
  }
  return true;
}

/**
 * Validate password length
 */
function validatePassword() {
  const password = passwordInput.value;
  
  if (password && password.length < 6) {
    showError("Password must be at least 6 characters");
    return false;
  }
  return true;
}

/**
 * Handle form submission
 * @param {Event} e - Submit event
 */
async function handleLogin(e) {
  e.preventDefault();
  
  // Prevent double submission
  if (isSubmitting) return;
  
  // Get form values
  const email = emailInput.value.trim().toLowerCase();
  const password = passwordInput.value;
  
  // Validate inputs
  if (!email || !password) {
    showError("Please fill in all fields");
    return;
  }
  
  if (!validateEmail() || !validatePassword()) {
    return;
  }
  
  // Clear previous messages
  clearMessages();
  
  // Show loading state
  isSubmitting = true;
  const submitBtn = form.querySelector('button[type="submit"]');
  const originalBtnText = submitBtn.innerHTML;
  submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Logging in...';
  submitBtn.disabled = true;
  
  // Simulate API call delay for better UX
  await new Promise(resolve => setTimeout(resolve, 800));
  
  try {
    // Authenticate user
    const result = authenticateUser(email, password);
    
    if (result.success) {
      // Save session
      saveSession(result.session);
      
      // Show success message
      showSuccess(`Welcome back! Redirecting to ${mode} dashboard...`);
      
      // Redirect after delay
      setTimeout(() => {
        window.location.href = result.redirectUrl;
      }, 1500);
    } else {
      // Show error
      showError(result.message);
      
      // Reset button
      submitBtn.innerHTML = originalBtnText;
      submitBtn.disabled = false;
      isSubmitting = false;
    }
  } catch (error) {
    showError("An unexpected error occurred. Please try again.");
    submitBtn.innerHTML = originalBtnText;
    submitBtn.disabled = false;
    isSubmitting = false;
  }
}

/**
 * Authenticate user credentials
 * @param {string} email - User email
 * @param {string} password - User password
 * @returns {Object} Authentication result
 */
function authenticateUser(email, password) {
  // Demo credentials
  const credentials = {
    user: {
      email: "user@vitacare.com",
      password: "123456",
      name: "John Doe",
      redirectUrl: "account.html"
    },
    admin: {
      email: "admin@vitacare.com",
      password: "admin123",
      name: "Admin User",
      redirectUrl: "admin.html"
    }
  };
  
  const currentCreds = credentials[mode];
  
  // Check credentials
  if (email === currentCreds.email && password === currentCreds.password) {
    return {
      success: true,
      session: {
        role: mode,
        email: email,
        name: currentCreds.name,
        loginAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // 24 hours
      },
      redirectUrl: currentCreds.redirectUrl
    };
  }
  
  return {
    success: false,
    message: `Invalid ${mode} credentials. Please check your email and password.`
  };
}

/**
 * Save user session
 * @param {Object} session - Session data
 */
function saveSession(session) {
  try {
    const sessionData = {
      ...session,
      timestamp: Date.now()
    };
    
    localStorage.setItem("vitacare_session", JSON.stringify(sessionData));
    
    // Also save to sessionStorage for extra security
    sessionStorage.setItem("vitacare_active", "true");
    
    console.log("Session saved successfully");
  } catch (error) {
    console.error("Error saving session:", error);
    showError("Unable to save session. Please try again.");
  }
}

/**
 * Check for existing session and redirect if valid
 */
function checkExistingSession() {
  try {
    const sessionStr = localStorage.getItem("vitacare_session");
    
    if (sessionStr) {
      const session = JSON.parse(sessionStr);
      
      // Check if session is still valid
      if (isSessionValid(session)) {
        // Show message and redirect
        showSuccess("You're already logged in. Redirecting...");
        
        setTimeout(() => {
          const redirectUrl = session.role === "admin" ? "admin.html" : "account.html";
          window.location.href = redirectUrl;
        }, 1000);
      } else {
        // Clear expired session
        clearSession();
      }
    }
  } catch (error) {
    console.error("Error checking session:", error);
    clearSession();
  }
}

/**
 * Validate session expiration
 * @param {Object} session - Session data
 * @returns {boolean} Is session valid
 */
function isSessionValid(session) {
  if (!session || !session.expiresAt) return false;
  
  const expirationDate = new Date(session.expiresAt);
  const now = new Date();
  
  return now < expirationDate;
}

/**
 * Clear user session
 */
function clearSession() {
  localStorage.removeItem("vitacare_session");
  sessionStorage.removeItem("vitacare_active");
}

/**
 * Show error message
 * @param {string} message - Error message
 */
function showError(message) {
  clearMessages();
  
  if (errorText && errorMsg) {
    errorText.textContent = message;
    errorMsg.classList.remove("hidden");
    
    // Smooth scroll to error
    errorMsg.scrollIntoView({ behavior: "smooth", block: "nearest" });
    
    // Add shake animation
    errorMsg.classList.add("animate-shake");
    setTimeout(() => errorMsg.classList.remove("animate-shake"), 500);
  }
}

/**
 * Show success message
 * @param {string} message - Success message
 */
function showSuccess(message) {
  clearMessages();
  
  if (successText && successMsg) {
    successText.textContent = message;
    successMsg.classList.remove("hidden");
    
    // Smooth scroll to success
    successMsg.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }
}

/**
 * Clear all messages
 */
function clearMessages() {
  if (errorMsg) errorMsg.classList.add("hidden");
  if (successMsg) successMsg.classList.add("hidden");
}

/**
 * Handle logout (utility function for other pages)
 */
function logout() {
  clearSession();
  window.location.href = "login.html";
}

// Initialize on page load
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}

// Export functions for use in other scripts
window.VitaCareAuth = {
  logout,
  getSession: () => {
    const sessionStr = localStorage.getItem("vitacare_session");
    return sessionStr ? JSON.parse(sessionStr) : null;
  },
  isLoggedIn: () => {
    const session = window.VitaCareAuth.getSession();
    return session && isSessionValid(session);
  },
  requireAuth: (requiredRole = null) => {
    const session = window.VitaCareAuth.getSession();
    
    if (!session || !isSessionValid(session)) {
      window.location.href = "login.html";
      return false;
    }
    
    if (requiredRole && session.role !== requiredRole) {
      alert("Access denied. Insufficient permissions.");
      window.location.href = "login.html";
      return false;
    }
    
    return true;
  }
};