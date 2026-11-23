import type { Product } from "~/composables/useProducts";

export const useProductFilters = (products: Ref<Product[]>) => {
    // SEARCH AND CATEGORY
    const searchQuery = ref("");
    const selectedCategory = ref("All");
    
      // CATEGORIES
    const categories = computed(() => [
    ...new Set(products.value.map((product) => product.category).filter(Boolean)),
    ]);

    // FILTER PRODUCTS
    const filteredProducts = computed(() => {
    return products.value
    .filter((product) => product.is_active)
    .filter((product) => {
      const search = searchQuery.value.toLowerCase().trim();

      const matchesSearch =
        product.name?.toLowerCase().includes(search) ||
        product.description?.toLowerCase().includes(search) ||
        product.category?.toLowerCase().includes(search);

      const matchesCategory =
        selectedCategory.value === "All" ||
        product.category === selectedCategory.value;

      return matchesSearch && matchesCategory;
    })
    .slice(0, 8)
    })
    return {
    filteredProducts,
    searchQuery,
    selectedCategory,
    categories }
}