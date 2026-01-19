// VitaCare Supabase bootstrap + shared helpers
// Loads AFTER https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2

(function () {
  const SUPABASE_URL = "https://rcqjidncnlqowdsukjqk.supabase.co";
  const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJjcWppZG5jbmxxb3dkc3VranFrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg2NzM2OTgsImV4cCI6MjA4NDI0OTY5OH0.o8ncEcOeJMr0aNb7PCfLy3jQ4F5Uz8dxVVOw48CiyxY";

  const api = (window.VitaCareSupabase = window.VitaCareSupabase || {});

  if (!window.supabase || typeof window.supabase.createClient !== "function") {
    api.client = null;
    api.initError = new Error(
      "Supabase JS SDK not found. Ensure the @supabase/supabase-js CDN script loads before src/js/supabase.js"
    );
    return;
  }

  // Create once
  if (!api.client) {
    try {
      api.client = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
      api.initError = null;
    } catch (e) {
      api.client = null;
      api.initError = e;
      return;
    }
  }

  api.getClient = function getClient() {
    return api.client;
  };

  api.getUserRole = async function getUserRole(userId) {
    try {
      const supabaseClient = api.client;
      const { data, error } = await supabaseClient
        .from("roles")
        .select("role")
        .eq("user_id", userId)
        .maybeSingle();

      if (error) return { role: "user", error };
      return { role: data?.role || "user", error: null };
    } catch (error) {
      return { role: "user", error };
    }
  };
})();
