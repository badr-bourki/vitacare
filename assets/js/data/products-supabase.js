// Supabase-backed products loader for the public products page
// Uses Supabase as source of truth and falls back to static products.js if unavailable.

(function () {
  const supabaseClient = window.VitaCareSupabase?.getClient?.();
  const initError = window.VitaCareSupabase?.initError;

  if (!supabaseClient || initError) {
    console.warn("Supabase client not ready on products page; using static products data.");
    return;
  }

  async function loadProductsFromSupabase() {
    try {
      const { data, error } = await supabaseClient
        .from("products")
        .select("id, name, description, price, stock, image_url, category")
        .order("created_at", { ascending: true });

      if (error) throw error;

      if (!Array.isArray(data) || !data.length) {
        console.info("No products found in Supabase; keeping static products.");
        return;
      }

      // Map Supabase rows to the shape expected by the existing UI
      const mapped = data.map((row) => ({
        id: row.id,
        name: row.name,
        description: row.description || "",
        price: Number(row.price || 0),
        category: row.category || "health",
        image: row.image_url || "/assets/images/products/p1.jpeg",
      }));

      window.products = mapped;

      // Re-render if the products page script already loaded
      if (typeof window.renderProducts === "function") {
        window.renderProducts();
      }
    } catch (err) {
      console.error("Failed to load products from Supabase; falling back to static list.", err);
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", loadProductsFromSupabase);
  } else {
    loadProductsFromSupabase();
  }
})();
