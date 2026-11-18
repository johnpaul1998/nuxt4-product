<template>
  <v-container fluid class="pa-0 products-page">
    <!-- HEADER -->
    <section class="products-header">
      <v-container>
        <div class="d-flex justify-space-between align-center flex-wrap ga-4">
          <div>
            <p class="eyebrow">J / P COLLECTION</p>
            <h1>ALL PRODUCTS</h1>
            <p class="subtitle">Explore our complete collection.</p>
          </div>

          <v-btn to="/" variant="outlined" color="black" rounded="pill">
            <v-icon start>mdi-arrow-left</v-icon>
            Back Home
          </v-btn>
        </div>
      </v-container>
    </section>

    <!-- FILTER AND SEARCH -->
    <v-container class="py-8">
      <v-row align="center">
        <v-col cols="12" md="6">
          <v-text-field
            v-model="search"
            label="Search products"
            prepend-inner-icon="mdi-magnify"
            variant="outlined"
            density="comfortable"
            hide-details
            clearable
          />
        </v-col>

        <v-col cols="12" sm="6" md="3">
          <v-select
            v-model="selectedCategory"
            :items="categories"
            label="Category"
            variant="outlined"
            density="comfortable"
            hide-details
          />
        </v-col>

        <v-col cols="12" sm="6" md="3">
          <v-select
            v-model="sortBy"
            :items="sortOptions"
            label="Sort by"
            variant="outlined"
            density="comfortable"
            hide-details
          />
        </v-col>
      </v-row>

      <!-- PRODUCT COUNT -->
      <div class="d-flex justify-space-between align-center mt-8 mb-5">
        <h2 class="section-title">OUR COLLECTION</h2>
        <span class="product-count">
          {{ filteredProducts.length }} PRODUCTS
        </span>
      </div>

      <!-- LOADING -->
      <v-row v-if="pending">
        <v-col v-for="n in 8" :key="n" cols="6" sm="4" md="3">
          <v-skeleton-loader type="image, article" />
        </v-col>
      </v-row>

      <!-- PRODUCTS -->
      <v-row v-else-if="filteredProducts.length">
        <v-col
          v-for="product in filteredProducts"
          :key="product.documentId"
          cols="6"
          sm="4"
          md="3"
        >
          <v-card class="product-card" flat rounded="0">
            <div class="product-image">
              <v-img
                :src="getImageUrl(product.image)"
                aspect-ratio="1"
                cover
                class="product-img"
              >
                <template #placeholder>
                  <div class="d-flex align-center justify-center fill-height">
                    <v-progress-circular indeterminate />
                  </div>
                </template>
              </v-img>
            </div>

            <v-card-text class="pa-3">
              <p class="product-category">
                {{ product.category || "GENERAL" }}
              </p>

              <h3 class="product-name">
                {{ product.name }}
              </h3>

              <p class="product-price">
                ₱{{ Number(product.price).toLocaleString("en-PH") }}
              </p>

              <p class="product-stock">
                {{ product.stock > 0 ? "In Stock" : "Out of Stock" }}
              </p>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <!-- EMPTY STATE -->
      <v-card v-else flat class="text-center pa-12">
        <v-icon size="60" color="grey">mdi-package-variant</v-icon>
        <h3 class="mt-4">No products found</h3>
        <p class="text-grey mt-2">Try another search or category.</p>
      </v-card>
    </v-container>
  </v-container>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";

const config = useRuntimeConfig();
const STRAPI_URL = config.public.strapiUrl;

const search = ref("");
const selectedCategory = ref("All");
const sortBy = ref("Newest");

const sortOptions = [
  "Newest",
  "Name: A-Z",
  "Price: Low to High",
  "Price: High to Low",
];

interface Product {
  id: number;
  documentId: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  is_active: boolean;
  createdAt: string;
  image: any;
}

interface ProductsResponse {
  data: Product[];
  meta: any;
}

const {
  data: productsData,
  pending,
  error,
} = await useFetch<ProductsResponse>(
  `${STRAPI_URL}/api/products?populate=*&pagination[pageSize]=100&sort=createdAt:desc`,
);

// ALL PRODUCTS
const products = computed(() => {
  return productsData.value?.data || [];
});

// DYNAMIC CATEGORIES
const categories = computed(() => {
  const uniqueCategories = [
    ...new Set(
      products.value.map((product) => product.category).filter(Boolean),
    ),
  ];

  return ["All", ...uniqueCategories];
});

// SEARCH, FILTER AND SORT
const filteredProducts = computed(() => {
  let result = [...products.value];

  // SEARCH
  if (search.value) {
    result = result.filter((product) =>
      product.name?.toLowerCase().includes(search.value.toLowerCase()),
    );
  }

  // CATEGORY
  if (selectedCategory.value !== "All") {
    result = result.filter(
      (product) => product.category === selectedCategory.value,
    );
  }

  // SORT
  switch (sortBy.value) {
    case "Name: A-Z":
      result.sort((a, b) => a.name.localeCompare(b.name));
      break;

    case "Price: Low to High":
      result.sort((a, b) => Number(a.price) - Number(b.price));
      break;

    case "Price: High to Low":
      result.sort((a, b) => Number(b.price) - Number(a.price));
      break;

    default:
      result.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );
  }

  return result;
});

// IMAGE URL
function getImageUrl(image: any) {
  if (!image) return "/placeholder.png";

  return (
    image.formats?.medium?.url ||
    image.formats?.small?.url ||
    image.url ||
    "/placeholder.png"
  );
}
</script>

<style scoped>
.products-page {
  background: #f8f8f6;
  min-height: 100vh;
  color: #111;
}

.products-header {
  background: #eeeeea;
  padding: 65px 0;
}

.eyebrow {
  font-size: 11px;
  font-weight: 900;
  letter-spacing: 3px;
  color: #777;
  margin-bottom: 12px;
}

.products-header h1 {
  font-size: clamp(38px, 6vw, 65px);
  font-weight: 1000;
  letter-spacing: -3px;
  line-height: 1;
}

.subtitle {
  color: #777;
  margin-top: 15px;
}

.section-title {
  font-size: 20px;
  font-weight: 900;
  letter-spacing: -0.5px;
}

.product-count {
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 1px;
  color: #888;
}

.product-card {
  background: transparent;
  transition: transform 0.2s ease;
}

.product-card:hover {
  transform: translateY(-5px);
}

.product-image {
  background: #eee;
  overflow: hidden;
}

.product-img {
  transition: transform 0.4s ease;
}

.product-card:hover .product-img {
  transform: scale(1.04);
}

.product-category {
  color: #888;
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 1px;
  margin-bottom: 6px;
  text-transform: uppercase;
}

.product-name {
  font-size: 14px;
  font-weight: 800;
  min-height: 40px;
}

.product-price {
  font-size: 15px;
  font-weight: 900;
  margin-top: 8px;
}

.product-stock {
  font-size: 11px;
  color: #888;
  margin-top: 5px;
}

@media (max-width: 600px) {
  .products-header {
    padding: 40px 0;
  }

  .products-header h1 {
    letter-spacing: -2px;
  }
}
</style>
