<template>
  <v-container fluid class="pa-0">
    <!-- NAVIGATION BAR -->
    <v-app-bar color="white" elevation="1" height="75">
      <v-container class="d-flex align-center">
        <v-toolbar-title class="font-weight-bold text-primary">
          ShopKart
        </v-toolbar-title>

        <v-spacer />

        <v-btn to="/" variant="text" color="primary"> Home </v-btn>

        <v-btn to="/products" variant="text"> Products </v-btn>

        <!-- CART ICON -->
        <v-badge
          :content="cartItemCount"
          :model-value="cartItemCount > 0"
          color="error"
          floating
        >
          <v-btn icon variant="text" @click="cartDrawer = true">
            <v-icon size="28">mdi-cart-outline</v-icon>
          </v-btn>
        </v-badge>
      </v-container>
    </v-app-bar>

    <!-- CART SIDE DRAWER -->
    <v-navigation-drawer
      v-model="cartDrawer"
      location="right"
      temporary
      width="400"
      class="cart-drawer"
    >
      <div class="d-flex align-center justify-space-between pa-4">
        <h2 class="text-h5 font-weight-bold">Your Cart</h2>

        <v-btn icon="mdi-close" variant="text" @click="cartDrawer = false" />
      </div>

      <v-divider />

      <!-- EMPTY CART -->
      <div v-if="cart.length === 0" class="text-center pa-8">
        <v-icon size="75" color="grey-lighten-1"> mdi-cart-outline </v-icon>

        <h3 class="mt-4">Your cart is empty</h3>

        <p class="text-medium-emphasis mt-2">
          Add some products to get started!
        </p>
      </div>

      <!-- CART ITEMS -->
      <div v-else class="pa-4">
        <v-card
          v-for="item in cart"
          :key="item.documentId"
          variant="outlined"
          class="mb-3"
        >
          <v-card-text>
            <v-row align="center">
              <v-col cols="4">
                <v-img
                  :src="getImageUrl(item.image) || undefined"
                  height="85"
                  cover
                  class="rounded"
                >
                  <template #placeholder>
                    <div class="image-placeholder">
                      <v-icon>mdi-image-outline</v-icon>
                    </div>
                  </template>
                </v-img>
              </v-col>

              <v-col cols="8">
                <div class="d-flex justify-space-between">
                  <strong>{{ item.name }}</strong>

                  <v-btn
                    icon="mdi-delete-outline"
                    color="error"
                    size="small"
                    variant="text"
                    @click="removeFromCart(item.documentId)"
                  />
                </div>

                <p class="text-body-2 mt-1">
                  Subtotal:
                  <strong class="text-primary">
                    {{ formatPrice(item.price * item.quantity) }}
                  </strong>
                </p>
                <div class="d-flex align-center mt-2">
                  <v-btn
                    icon="mdi-minus"
                    size="x-small"
                    variant="outlined"
                    :disabled="item.quantity <= 1"
                    @click="decreaseQuantity(item.documentId)"
                  />

                  <span class="mx-3 font-weight-bold">
                    {{ item.quantity }}
                  </span>

                  <v-btn
                    icon="mdi-plus"
                    size="x-small"
                    variant="outlined"
                    :disabled="item.quantity >= item.stock"
                    @click="increaseQuantity(item.documentId)"
                  />
                </div>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>

        <v-divider class="my-4" />

        <!-- CART TOTAL -->
        <div class="d-flex justify-space-between mb-2">
          <span>Items</span>
          <strong>{{ cartItemCount }}</strong>
        </div>

        <div class="d-flex justify-space-between mb-4">
          <span class="text-h6 font-weight-bold">Subtotal</span>

          <span class="text-h6 font-weight-bold text-primary">
            {{ formatPrice(cartTotal) }}
          </span>
        </div>

        <v-btn
          color="error"
          variant="outlined"
          block
          class="mb-3"
          @click="clearCart"
        >
          Clear Cart
        </v-btn>

        <v-btn color="primary" block size="large" disabled>
          Proceed to Checkout
        </v-btn>

        <p class="text-caption text-center mt-2 text-medium-emphasis">
          Checkout will be available in a future update.
        </p>
      </div>
    </v-navigation-drawer>

    <!-- HERO SECTION -->
    <section class="hero-section">
      <v-container class="py-16">
        <v-row align="center">
          <v-col cols="12" md="7">
            <h1 class="text-h3 text-md-h2 font-weight-bold mb-4">
              Discover Your Next Favorite Product
            </h1>

            <p class="text-h6 mb-6">
              Find quality products at affordable prices. Shopping made simple
              with ShopKart.
            </p>

            <v-btn
              to="/products"
              color="white"
              variant="flat"
              size="large"
              rounded="lg"
            >
              Shop Now
              <v-icon end>mdi-arrow-right</v-icon>
            </v-btn>
          </v-col>

          <v-col cols="12" md="5" class="text-center">
            <v-icon size="180" color="white"> mdi-shopping </v-icon>
          </v-col>
        </v-row>
      </v-container>
    </section>

    <!-- SEARCH -->
    <v-container class="py-8">
      <v-text-field
        v-model="searchQuery"
        label="Search products..."
        prepend-inner-icon="mdi-magnify"
        variant="outlined"
        rounded="lg"
        clearable
        hide-details
      />
    </v-container>

    <!-- CATEGORIES -->
    <v-container>
      <h2 class="text-h5 font-weight-bold mb-4">Shop by Category</h2>

      <div class="d-flex flex-wrap ga-2 mb-8">
        <v-chip
          :color="selectedCategory === 'All' ? 'primary' : undefined"
          :variant="selectedCategory === 'All' ? 'flat' : 'outlined'"
          @click="selectedCategory = 'All'"
        >
          All
        </v-chip>

        <v-chip
          v-for="category in categories"
          :key="category"
          :color="selectedCategory === category ? 'primary' : undefined"
          :variant="selectedCategory === category ? 'flat' : 'outlined'"
          @click="selectedCategory = category"
        >
          {{ category }}
        </v-chip>
      </div>
    </v-container>

    <!-- PROMOTIONS SECTION -->
    <v-container class="pb-8">
      <v-card rounded="xl" color="deep-purple-darken-2" class="pa-6 pa-md-10">
        <v-row align="center">
          <v-col cols="12" md="8">
            <v-chip color="yellow" class="mb-4" size="small">
              SPECIAL OFFER
            </v-chip>

            <h2 class="text-h4 font-weight-bold text-white mb-3">
              Great Deals Await!
            </h2>

            <p class="text-body-1 text-white mb-5">
              Discover amazing products and enjoy shopping with ShopKart.
            </p>

            <v-btn
              to="/products"
              color="yellow"
              class="text-black"
              rounded="lg"
            >
              Explore Products
              <v-icon end>mdi-arrow-right</v-icon>
            </v-btn>
          </v-col>

          <v-col cols="12" md="4" class="text-center">
            <v-icon size="130" color="yellow"> mdi-tag-heart </v-icon>
          </v-col>
        </v-row>
      </v-card>
    </v-container>

    <!-- FEATURED PRODUCTS -->
    <v-container class="pb-12">
      <div class="d-flex align-center justify-space-between mb-5">
        <h2 class="text-h5 font-weight-bold">Featured Products</h2>

        <v-btn to="/products" variant="text" color="primary">
          View All
          <v-icon end>mdi-arrow-right</v-icon>
        </v-btn>
      </div>

      <div v-if="pending" class="text-center pa-10">
        <v-progress-circular indeterminate color="primary" />
        <p class="mt-3">Loading products...</p>
      </div>

      <v-alert v-else-if="error" type="warning" variant="tonal">
        Unable to load products. Please check your Strapi connection.
      </v-alert>

      <v-alert
        v-else-if="filteredProducts.length === 0"
        type="info"
        variant="tonal"
      >
        No products found.
      </v-alert>

      <v-row v-else>
        <v-col
          v-for="product in filteredProducts"
          :key="product.documentId"
          cols="12"
          sm="6"
          md="4"
          lg="3"
        >
          <v-card rounded="lg" elevation="2" height="100%">
            <div class="product-image-container">
              <v-img
                v-if="getImageUrl(product.image)"
                :src="getImageUrl(product.image)"
                height="200"
                cover
              />

              <div v-else class="image-placeholder">
                <v-icon size="65" color="grey"> mdi-image-outline </v-icon>
              </div>

              <!-- WISHLIST BUTTON -->
              <v-btn
                icon
                size="small"
                elevation="2"
                class="wishlist-button"
                :color="isWishlisted(product) ? 'red' : 'white'"
                @click.stop="toggleWishlist(product)"
              >
                <v-icon :color="isWishlisted(product) ? 'white' : 'red'">
                  {{
                    isWishlisted(product) ? "mdi-heart" : "mdi-heart-outline"
                  }}
                </v-icon>
              </v-btn>
            </div>

            <v-card-item>
              <v-card-title class="text-subtitle-1 font-weight-bold">
                {{ product.name }}
              </v-card-title>

              <v-card-subtitle>
                {{ product.category || "General" }}
              </v-card-subtitle>
            </v-card-item>

            <v-card-text>
              <p class="text-body-2 text-medium-emphasis mb-3">
                {{ product.description || "No description available." }}
              </p>

              <div class="d-flex align-center justify-space-between">
                <span class="text-h6 font-weight-bold text-primary">
                  {{ formatPrice(product.price) }}
                </span>

                <v-chip size="small" color="success" variant="tonal">
                  {{ product.stock }} in stock
                </v-chip>
              </div>
            </v-card-text>

            <v-card-actions class="pa-4">
              <v-btn
                color="primary"
                block
                :disabled="product.stock <= 0"
                @click="addToCart(product)"
              >
                <v-icon start>mdi-cart-plus</v-icon>
                Add to Cart
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </v-container>

    <!-- FOOTER -->
    <v-footer color="grey-darken-4" class="text-white">
      <v-container class="text-center py-6">
        <h3 class="text-h5 font-weight-bold mb-2">ShopKart</h3>

        <p class="text-body-2 text-grey-lighten-1">
          Your simple and convenient online shopping destination.
        </p>

        <v-divider class="my-4" color="grey" />

        <p class="text-caption">
          © {{ new Date().getFullYear() }} ShopKart. All rights reserved.
        </p>
      </v-container>
    </v-footer>

    <!-- CART NOTIFICATION -->
    <v-snackbar v-model="showCartMessage" color="success" timeout="2000">
      {{ cartMessage }}
    </v-snackbar>
  </v-container>
</template>

<script setup lang="ts">
// STRAPI CONFIGURATION
const config = useRuntimeConfig();
const STRAPI_URL = config.public.strapiUrl;

// PRODUCT INTERFACE
interface Product {
  id: number;
  documentId: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  is_active: boolean;
  image: any;
}

// CART INTERFACE
interface CartItem extends Product {
  quantity: number;
}

// SEARCH AND CATEGORY STATE
const searchQuery = ref("");
const selectedCategory = ref("All");

// CART STATE
const cartDrawer = ref(false);
const cart = ref<CartItem[]>([]);

// NOTIFICATION STATE
const showCartMessage = ref(false);
const cartMessage = ref("");

// FETCH PRODUCTS FROM STRAPI
const {
  data: response,
  pending,
  error,
} = await useFetch<{ data: Product[] }>(`${STRAPI_URL}/api/products`, {
  query: {
    populate: "image",
    sort: "createdAt:desc",
    "pagination[pageSize]": 100,

    // Only active products
    "filters[is_active][$eq]": true,
  },
});

// PRODUCT DATA
const products = computed(() => {
  return response.value?.data ?? [];
});

// UNIQUE CATEGORIES
const categories = computed(() => {
  return [
    ...new Set(
      products.value.map((product) => product.category).filter(Boolean),
    ),
  ];
});

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
    .slice(0, 8);
});

// CART ITEM COUNT
const cartItemCount = computed(() => {
  return cart.value.reduce((total, item) => total + item.quantity, 0);
});

// CART TOTAL
const cartTotal = computed(() => {
  return cart.value.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );
});

// ADD TO CART
function addToCart(product: Product) {
  const existingItem = cart.value.find(
    (item) => item.documentId === product.documentId,
  );

  // Reject inactive products
  if (!product.is_active) {
    cartMessage.value = "This product is unavailable.";
    showCartMessage.value = true;
    return;
  }

  // Reject out-of-stock products
  if (product.stock <= 0) {
    cartMessage.value = "This product is out of stock.";
    showCartMessage.value = true;
    return;
  }
  if (existingItem) {
    if (existingItem.quantity >= product.stock) {
      cartMessage.value = "Maximum available stock reached.";
      showCartMessage.value = true;
      return;
    }

    existingItem.quantity++;
  } else {
    if (product.stock <= 0) return;

    cart.value.push({
      ...product,
      quantity: 1,
    });
  }

  cartMessage.value = `${product.name} added to cart!`;
  showCartMessage.value = true;
}

// INCREASE QUANTITY
function increaseQuantity(documentId: string) {
  const item = cart.value.find((item) => item.documentId === documentId);

  if (!item) return;

  if (item.quantity < item.stock) {
    item.quantity++;
  }
}

// DECREASE QUANTITY
function decreaseQuantity(documentId: string) {
  const item = cart.value.find((item) => item.documentId === documentId);

  if (!item) return;

  if (item.quantity > 1) {
    item.quantity--;
  }
}

// REMOVE ITEM
function removeFromCart(documentId: string) {
  cart.value = cart.value.filter((item) => item.documentId !== documentId);
}

// CLEAR CART
function clearCart() {
  cart.value = [];
}

// GET PRODUCT IMAGE URL
function getImageUrl(image: any): string {
  const imageData = Array.isArray(image) ? image[0] : image;

  if (!imageData?.url) return "";

  const imageUrl =
    imageData.formats?.medium?.url ||
    imageData.formats?.small?.url ||
    imageData.url;

  if (imageUrl.startsWith("http://") || imageUrl.startsWith("https://")) {
    return imageUrl;
  }

  return `${STRAPI_URL}${imageUrl}`;
}

// FORMAT PRICE
function formatPrice(price: number): string {
  return new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
  }).format(price || 0);
}

// WISHLIST STATE
const wishlist = ref<string[]>([]);

// TOGGLE WISHLIST
function toggleWishlist(product: Product) {
  const productId = product.documentId;

  if (wishlist.value.includes(productId)) {
    wishlist.value = wishlist.value.filter((id) => id !== productId);

    cartMessage.value = `${product.name} removed from wishlist.`;
  } else {
    wishlist.value.push(productId);

    cartMessage.value = `${product.name} added to wishlist!`;
  }

  showCartMessage.value = true;
}

// CHECK WISHLIST
function isWishlisted(product: Product): boolean {
  return wishlist.value.includes(product.documentId);
}
</script>

<style scoped>
.hero-section {
  background: linear-gradient(120deg, #1565c0, #42a5f5);
  color: white;
}

.image-placeholder {
  height: 200px;
  background-color: #eeeeee;
  display: flex;
  align-items: center;
  justify-content: center;
}

.cart-drawer {
  max-width: 100vw;
}

.product-image-container {
  position: relative;
}

.wishlist-button {
  position: absolute;
  top: 10px;
  right: 10px;
  z-index: 2;
}
</style>
