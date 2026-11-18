<template>
  <v-container fluid class="pa-0 nike-style">
    <!-- LOADING -->
    <div v-if="pending" class="loading-page">
      <v-container>
        <v-skeleton-loader type="heading" class="mb-8" />
        <v-skeleton-loader type="image" height="400" class="mb-8" />
        <v-row>
          <v-col v-for="n in 4" :key="n" cols="6" md="3">
            <v-skeleton-loader type="card" />
          </v-col>
        </v-row>
      </v-container>
    </div>

    <div v-else>
      <!-- ANNOUNCEMENT -->
      <div class="announcement-bar">FREE SHIPPING ON SELECTED ORDERS</div>

      <!-- NAVBAR -->
      <v-app-bar height="76" color="#F4F4F0" elevation="0" class="main-navbar">
        <v-container
          fluid
          class="navbar-container d-flex align-center px-5 px-md-10"
        >
          <NuxtLink to="/" class="brand-logo"> Mikē<span>.</span> </NuxtLink>

          <v-spacer />

          <div class="desktop-navigation">
            <v-btn href="#top" variant="text" color="black">HOME</v-btn>
            <v-btn href="#products" variant="text" color="black">SHOP</v-btn>
            <v-btn to="/products" variant="text" color="black"
              >COLLECTIONS</v-btn
            >
          </div>

          <v-spacer />

          <div class="desktop-cart">
            <v-badge
              :content="cartItemCount"
              :model-value="cartItemCount > 0"
              color="black"
            >
              <v-btn icon variant="text" @click="cartDrawer = true">
                <v-icon size="25">mdi-shopping-bag-outline</v-icon>
              </v-btn>
            </v-badge>
          </div>

          <div class="mobile-menu">
            <v-btn icon variant="text" @click="mobileMenu = !mobileMenu">
              <v-icon size="28">mdi-menu</v-icon>
            </v-btn>
          </div>
        </v-container>
      </v-app-bar>

      <!-- MOBILE MENU -->
      <v-navigation-drawer
        v-model="mobileMenu"
        location="right"
        temporary
        width="300"
        class="mobile-navigation"
      >
        <div class="mobile-menu-header">
          <span>MENU</span>
          <v-btn icon="mdi-close" variant="text" @click="mobileMenu = false" />
        </div>

        <v-divider />

        <div class="mobile-menu-links">
          <a href="#top" @click="mobileMenu = false">
            HOME <v-icon>mdi-arrow-up-right</v-icon>
          </a>

          <a href="#products" @click="mobileMenu = false">
            SHOP <v-icon>mdi-arrow-up-right</v-icon>
          </a>

          <NuxtLink to="/products" @click="mobileMenu = false">
            COLLECTIONS <v-icon>mdi-arrow-up-right</v-icon>
          </NuxtLink>

          <v-divider class="my-3" />

          <button
            class="mobile-cart-link"
            @click="
              mobileMenu = false;
              cartDrawer = true;
            "
          >
            <span>
              <v-icon class="mr-3">mdi-shopping-bag-outline</v-icon>
              MY CART
            </span>

            <v-badge
              :content="cartItemCount"
              :model-value="cartItemCount > 0"
              color="black"
              inline
            />
          </button>
        </div>

        <template #append>
          <div class="mobile-menu-footer">Mikē</div>
        </template>
      </v-navigation-drawer>

      <!-- CART DRAWER -->
      <v-navigation-drawer
        v-model="cartDrawer"
        location="right"
        temporary
        width="480"
        class="cart-drawer"
      >
        <div class="cart-header">
          <div>
            <span class="cart-eyebrow">Mikē — YOUR SELECTION</span>
            <h2>
              YOUR CART <span>({{ cartItemCount }})</span>
            </h2>
          </div>

          <v-btn icon="mdi-close" variant="text" @click="cartDrawer = false" />
        </div>

        <v-divider />

        <div v-if="cart.length === 0" class="empty-cart">
          <v-icon size="65" color="#aaa">mdi-shopping-outline</v-icon>
          <h3>Nothing here yet.</h3>
          <p>Your next favorite piece is waiting.</p>

          <v-btn
            to="/products"
            color="black"
            rounded="pill"
            class="mt-5"
            @click="cartDrawer = false"
          >
            EXPLORE COLLECTION
          </v-btn>
        </div>

        <div v-else class="cart-content">
          <div class="cart-items">
            <div v-for="item in cart" :key="item.documentId" class="cart-item">
              <div class="cart-item-image">
                <v-img
                  v-if="getImageUrl(item.image)"
                  :src="getImageUrl(item.image)"
                  height="155"
                  cover
                />
                <v-icon v-else size="35">mdi-image-outline</v-icon>
              </div>

              <div class="cart-item-info">
                <div class="d-flex justify-space-between align-start">
                  <div>
                    <span class="cart-item-category">
                      {{ item.category || "COLLECTION" }}
                    </span>
                    <h3>{{ item.name }}</h3>
                  </div>

                  <v-btn
                    icon="mdi-close"
                    size="x-small"
                    variant="text"
                    color="grey"
                    @click="removeFromCart(item.documentId)"
                  />
                </div>

                <div class="cart-item-price">
                  {{ formatPrice(item.price) }}
                </div>

                <div class="cart-item-bottom">
                  <div class="quantity-control">
                    <button
                      :disabled="item.quantity <= 1"
                      @click="decreaseQuantity(item.documentId)"
                    >
                      −
                    </button>

                    <span>{{ item.quantity }}</span>

                    <button
                      :disabled="item.quantity >= item.stock"
                      @click="increaseQuantity(item.documentId)"
                    >
                      +
                    </button>
                  </div>

                  <span class="cart-item-subtotal">
                    {{ formatPrice(item.price * item.quantity) }}
                  </span>
                </div>

                <span class="cart-stock">{{ item.stock }} AVAILABLE</span>
              </div>
            </div>
          </div>

          <div class="cart-summary">
            <div class="cart-summary-top">
              <span>SUBTOTAL</span>
              <strong>{{ formatPrice(cartTotal) }}</strong>
            </div>

            <p>Shipping and taxes calculated at checkout.</p>

            <v-btn
              block
              color="black"
              height="56"
              rounded="pill"
              @click="openCheckout"
            >
              PROCEED TO CHECKOUT
              <v-icon end>mdi-arrow-right</v-icon>
            </v-btn>

            <button class="continue-shopping" @click="cartDrawer = false">
              CONTINUE SHOPPING
            </button>
          </div>
        </div>
      </v-navigation-drawer>

      <!-- CHECKOUT -->
      <v-dialog v-model="checkoutDialog" max-width="1100" scrollable>
        <v-card class="checkout-card" rounded="xl">
          <div class="checkout-header">
            <div>
              <span class="checkout-eyebrow">Mikē — SECURE CHECKOUT</span>
              <h2>ALMOST YOURS.</h2>
              <p>Complete your details to place your order.</p>
            </div>

            <v-btn
              icon="mdi-close"
              variant="text"
              :disabled="isCheckingOut"
              @click="checkoutDialog = false"
            />
          </div>

          <v-divider />

          <v-card-text class="checkout-body">
            <v-row>
              <v-col cols="12" md="7" class="checkout-form-column">
                <div class="checkout-step">
                  <span>01</span>
                  <h3>YOUR DETAILS</h3>
                </div>

                <v-text-field
                  v-model="customer.name"
                  label="Full Name"
                  placeholder="Enter your full name"
                  variant="outlined"
                  rounded="lg"
                  :disabled="isCheckingOut"
                  :error-messages="checkoutErrors.name"
                />

                <v-text-field
                  v-model="customer.email"
                  label="Email Address"
                  placeholder="you@example.com"
                  type="email"
                  variant="outlined"
                  rounded="lg"
                  :disabled="isCheckingOut"
                  :error-messages="checkoutErrors.email"
                />

                <v-text-field
                  v-model="customer.phone"
                  label="Phone Number"
                  placeholder="09XXXXXXXXX"
                  variant="outlined"
                  rounded="lg"
                  :disabled="isCheckingOut"
                  :error-messages="checkoutErrors.phone"
                />

                <v-textarea
                  v-model="customer.address"
                  label="Complete Shipping Address"
                  placeholder="House number, street, barangay, city, province..."
                  variant="outlined"
                  rounded="lg"
                  rows="3"
                  :disabled="isCheckingOut"
                  :error-messages="checkoutErrors.address"
                />

                <div class="checkout-step mt-5">
                  <span>02</span>
                  <h3>PAYMENT METHOD</h3>
                </div>

                <v-radio-group
                  v-model="customer.paymentMethod"
                  :disabled="isCheckingOut"
                  :error-messages="checkoutErrors.paymentMethod"
                  hide-details="auto"
                >
                  <div class="payment-option">
                    <v-radio value="COD">
                      <template #label>
                        <div class="payment-label">
                          <v-icon size="25">mdi-cash-multiple</v-icon>
                          <div>
                            <strong>Cash on Delivery</strong>
                            <small>Pay when your order arrives.</small>
                          </div>
                        </div>
                      </template>
                    </v-radio>
                  </div>

                  <div class="payment-option mt-3">
                    <v-radio value="GCash">
                      <template #label>
                        <div class="payment-label">
                          <v-icon size="25">mdi-cellphone</v-icon>
                          <div>
                            <strong>GCash</strong>
                            <small>Mobile wallet payment.</small>
                          </div>
                        </div>
                      </template>
                    </v-radio>
                  </div>
                </v-radio-group>
              </v-col>

              <v-col cols="12" md="5">
                <div class="checkout-summary">
                  <span class="checkout-summary-eyebrow">YOUR SELECTION</span>
                  <h3>ORDER SUMMARY</h3>

                  <div
                    v-for="item in cart"
                    :key="item.documentId"
                    class="checkout-product"
                  >
                    <div class="checkout-product-image">
                      <v-img
                        v-if="getImageUrl(item.image)"
                        :src="getImageUrl(item.image)"
                        width="75"
                        height="85"
                        cover
                      />
                      <v-icon v-else>mdi-image-outline</v-icon>
                    </div>

                    <div class="checkout-product-info">
                      <strong>{{ item.name }}</strong>
                      <span>
                        {{ formatPrice(item.price) }} × {{ item.quantity }}
                      </span>
                    </div>

                    <strong class="checkout-product-total">
                      {{ formatPrice(item.price * item.quantity) }}
                    </strong>
                  </div>

                  <v-divider class="my-5" />

                  <div class="summary-line">
                    <span>TOTAL ITEMS</span>
                    <strong>{{ cartItemCount }}</strong>
                  </div>

                  <div class="summary-line">
                    <span>SUBTOTAL</span>
                    <strong>{{ formatPrice(cartTotal) }}</strong>
                  </div>

                  <div class="summary-line">
                    <span>SHIPPING</span>
                    <strong>Calculated separately</strong>
                  </div>

                  <v-divider class="my-5" />

                  <div class="checkout-total">
                    <span>TOTAL</span>
                    <strong>{{ formatPrice(cartTotal) }}</strong>
                  </div>

                  <p class="checkout-note">
                    Please review your information before placing your order.
                  </p>

                  <v-alert
                    v-if="checkoutError"
                    type="error"
                    variant="tonal"
                    class="mt-4"
                  >
                    {{ checkoutError }}
                  </v-alert>

                  <v-btn
                    block
                    color="black"
                    height="56"
                    rounded="pill"
                    class="mt-5"
                    :loading="isCheckingOut"
                    :disabled="cart.length === 0"
                    @click="submitCheckout"
                  >
                    PLACE YOUR ORDER
                    <v-icon end>mdi-arrow-right</v-icon>
                  </v-btn>

                  <div class="secure-checkout">
                    <v-icon size="16">mdi-shield-check-outline</v-icon>
                    YOUR ORDER DETAILS ARE PROTECTED
                  </div>
                </div>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-dialog>

      <!-- ORDER SUCCESS -->
      <v-dialog v-model="successDialog" max-width="520" persistent>
        <v-card class="success-card" rounded="xl">
          <div class="success-icon">
            <v-icon size="48" color="white">mdi-check</v-icon>
          </div>

          <v-card-text class="text-center pa-8">
            <span class="success-eyebrow">Mikē — ORDER CONFIRMED</span>
            <h2 class="success-title mt-4">THANK YOU!</h2>

            <p class="success-message mt-3">
              Your order has been successfully placed. We appreciate your
              purchase and can't wait for you to receive your items.
            </p>

            <v-divider class="my-6" />

            <div class="order-reference">
              <span>YOUR ORDER NUMBER</span>
              <strong>{{ completedOrderId }}</strong>
            </div>

            <v-alert
              type="success"
              variant="tonal"
              rounded="lg"
              class="mt-5 text-left"
            >
              Thank you for shopping with Mikē. Your order is now being
              processed.
            </v-alert>

            <v-btn
              block
              color="black"
              size="x-large"
              rounded="pill"
              class="mt-6"
              @click="successDialog = false"
            >
              CONTINUE SHOPPING
              <v-icon end>mdi-arrow-right</v-icon>
            </v-btn>
          </v-card-text>
        </v-card>
      </v-dialog>

      <!-- HERO CAROUSEL -->
      <section id="top" class="hero-section scroll-reveal">
        <v-carousel
          height="760"
          cycle
          :interval="5000"
          show-arrows="hover"
          hide-delimiter-background
          color="white"
        >
          <v-carousel-item v-for="slide in heroSlides" :key="slide.number">
            <div class="hero-slide" :class="slide.class">
              <div class="hero-overlay" />

              <div class="hero-content">
                <div class="hero-accent-line" />
                <span class="hero-eyebrow">{{ slide.eyebrow }}</span>
                <h1 v-html="slide.heading" />
                <p>{{ slide.description }}</p>

                <v-btn
                  href="#products"
                  color="white"
                  rounded="pill"
                  size="x-large"
                  class="hero-button"
                >
                  {{ slide.button }}
                  <v-icon end>mdi-arrow-right</v-icon>
                </v-btn>
              </div>

              <div class="hero-bottom-label">
                {{ slide.number }} — {{ slide.label }}
              </div>
            </div>
          </v-carousel-item>
        </v-carousel>
      </section>

      <!-- CATEGORIES -->
      <section class="scroll-reveal">
        <v-container id="categories" class="section-spacing">
          <div class="section-header">
            <div>
              <span class="eyebrow">EXPLORE THE COLLECTION</span>
              <h2>SHOP BY CATEGORY.</h2>
              <p>Find the perfect essentials for your everyday life.</p>
            </div>
          </div>

          <div class="category-showcase">
            <button
              v-for="(category, index) in categories"
              :key="category"
              class="category-showcase-card"
              @click="selectCategory(category)"
            >
              <span class="category-number">
                {{ String(index + 1).padStart(2, "0") }}
              </span>

              <div class="category-card-content">
                <h3>{{ category }}</h3>
                <span>EXPLORE COLLECTION</span>
              </div>

              <v-icon class="category-arrow">mdi-arrow-up-right</v-icon>
            </button>
          </div>
        </v-container>
      </section>

      <!-- PROMOTION -->
      <v-container class="section-spacing">
        <section class="promo-section">
          <div class="promo-content scroll-reveal">
            <span class="eyebrow light-eyebrow">THE Mikē EXPERIENCE</span>

            <h2>LESS ORDINARY.<br />MORE YOU.</h2>

            <p>
              Discover products that bring style and simplicity into your
              everyday life.
            </p>

            <v-btn
              to="/products"
              color="white"
              rounded="pill"
              size="large"
              class="promo-button"
            >
              EXPLORE COLLECTION
              <v-icon end>mdi-arrow-right</v-icon>
            </v-btn>
          </div>

          <div class="promo-decoration">
            <span>MIKĒ</span>
            <v-icon size="115">mdi-star-four-points-outline</v-icon>
          </div>
        </section>
      </v-container>

      <!-- PRODUCTS -->
      <v-container id="products" class="section-spacing pb-12">
        <div class="section-header product-section-header">
          <div>
            <span class="eyebrow">THE COLLECTION</span>
            <h2>FRESH FINDS.</h2>
            <p>Find your next everyday favorite.</p>
          </div>

          <NuxtLink to="/viewAllProducts" class="view-all-link">
            VIEW ALL
            <v-icon end>mdi-arrow-right</v-icon>
          </NuxtLink>
        </div>

        <!-- SEARCH -->
        <div class="product-search-area">
          <div class="product-search">
            <v-icon icon="mdi-magnify" size="23" color="#777" />

            <input
              v-model="searchQuery"
              type="text"
              placeholder="Search products, categories..."
              class="product-search-input"
            />

            <button
              v-if="searchQuery"
              class="search-clear"
              aria-label="Clear search"
              @click="searchQuery = ''"
            >
              <v-icon icon="mdi-close" />
            </button>
          </div>

          <span class="search-caption">FIND SOMETHING YOU LOVE.</span>
        </div>

        <section class="scroll-reveal">
          <!-- FILTER -->
          <div class="category-list product-category-list">
            <v-chip
              :color="selectedCategory === 'All' ? 'black' : undefined"
              :variant="selectedCategory === 'All' ? 'flat' : 'outlined'"
              size="large"
              @click="selectedCategory = 'All'"
            >
              ALL
            </v-chip>

            <v-chip
              v-for="category in categories"
              :key="category"
              :color="selectedCategory === category ? 'black' : undefined"
              :variant="selectedCategory === category ? 'flat' : 'outlined'"
              size="large"
              @click="selectedCategory = category"
            >
              {{ category.toUpperCase() }}
            </v-chip>
          </div>

          <v-alert v-if="error" type="warning" variant="tonal" class="mt-6">
            Unable to load products. Please check your Strapi connection.
          </v-alert>

          <v-alert
            v-else-if="filteredProducts.length === 0"
            type="info"
            variant="tonal"
            class="mt-6"
          >
            No products found. Try another search.
          </v-alert>

          <!-- PRODUCT GRID -->
          <v-row v-else class="product-grid mt-4">
            <v-col
              v-for="product in filteredProducts"
              :key="product.documentId"
              cols="12"
              sm="6"
              md="4"
              lg="3"
              class="product-column"
            >
              <v-card
                class="product-card"
                rounded="0"
                elevation="0"
                height="100%"
              >
                <div class="product-image">
                  <v-img
                    v-if="getImageUrl(product.image)"
                    :src="getImageUrl(product.image)"
                    height="300"
                    cover
                  />

                  <div v-else class="image-placeholder">
                    <v-icon size="60">mdi-image-outline</v-icon>
                  </div>

                  <v-btn
                    icon
                    size="small"
                    color="white"
                    class="wishlist-button"
                    @click.stop="toggleWishlist(product)"
                  >
                    <v-icon :color="isWishlisted(product) ? 'red' : 'black'">
                      {{
                        isWishlisted(product)
                          ? "mdi-heart"
                          : "mdi-heart-outline"
                      }}
                    </v-icon>
                  </v-btn>

                  <div
                    class="product-tag"
                    :class="{ 'out-of-stock': product.stock <= 0 }"
                  >
                    {{ product.stock > 0 ? "AVAILABLE" : "SOLD OUT" }}
                  </div>
                </div>

                <v-card-text class="product-details">
                  <div class="product-heading">
                    <h3 class="product-name">{{ product.name }}</h3>
                    <p class="product-category">
                      {{ product.category || "EVERYDAY COLLECTION" }}
                    </p>
                  </div>

                  <div class="product-price">
                    {{ formatPrice(product.price) }}
                  </div>

                  <p class="product-description">
                    {{
                      product.description || "A fresh find for everyday living."
                    }}
                  </p>
                </v-card-text>

                <v-card-actions class="product-actions">
                  <v-btn
                    class="add-to-cart-button"
                    color="black"
                    block
                    rounded="pill"
                    height="48"
                    :disabled="product.stock <= 0"
                    @click="addToCart(product)"
                  >
                    ADD TO CART
                    <v-icon end>mdi-plus</v-icon>
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-col>
          </v-row>
        </section>
      </v-container>

      <!-- NEWSLETTER -->
      <section class="newsletter-section">
        <v-container class="py-12 scroll-reveal">
          <v-row align="center">
            <v-col cols="12" md="6">
              <span class="eyebrow">STAY IN THE GAME</span>
              <h2>NEVER MISS<br />A THING.</h2>
              <p>Get the latest updates, new arrivals, and exclusive offers.</p>
            </v-col>

            <v-col cols="12" md="6">
              <v-form
                class="newsletter-form"
                @submit.prevent="subscribeNewsletter"
              >
                <v-text-field
                  v-model="newsletterEmail"
                  label="Your email address"
                  type="email"
                  variant="outlined"
                  bg-color="white"
                  rounded="lg"
                  prepend-inner-icon="mdi-email-outline"
                  :rules="emailRules"
                  required
                />

                <v-btn
                  type="submit"
                  color="black"
                  block
                  size="large"
                  rounded="pill"
                >
                  JOIN THE COMMUNITY
                  <v-icon end>mdi-arrow-right</v-icon>
                </v-btn>
              </v-form>
            </v-col>
          </v-row>
        </v-container>
      </section>

      <!-- FOOTER -->
      <v-footer class="main-footer">
        <v-container class="py-10">
          <v-row>
            <v-col cols="12" md="6">
              <div class="footer-logo">Mikē<span>.</span></div>

              <p class="footer-description">
                Everyday essentials.<br />
                Timeless style. Your way.
              </p>
            </v-col>

            <v-col cols="6" md="3">
              <h4>EXPLORE</h4>
              <div class="footer-links">
                <NuxtLink to="/">Home</NuxtLink>
                <NuxtLink to="/products">Shop</NuxtLink>
              </div>
            </v-col>

            <v-col cols="6" md="3">
              <h4>ABOUT</h4>
              <div class="footer-links">
                <a href="#top">Our Collection</a>
                <a href="#top">Back to Top</a>
              </div>
            </v-col>
          </v-row>

          <v-divider color="#555" class="my-6" />

          <div class="footer-bottom">
            © {{ new Date().getFullYear() }} Mikē. ALL RIGHTS RESERVED.
          </div>
        </v-container>
      </v-footer>

      <!-- NOTIFICATION -->
      <v-snackbar
        v-model="showCartMessage"
        color="black"
        timeout="2500"
        rounded="lg"
      >
        {{ cartMessage }}
      </v-snackbar>
    </div>
  </v-container>
</template>

<script setup lang="ts">
useHead({
  title: "Mikē",
  meta: [
    {
      name: "description",
      content: "Discover everyday essentials and timeless finds at Mikē.",
    },
    {
      name: "theme-color",
      content: "#F4F4F0",
    },
  ],
});

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

interface CartItem extends Product {
  quantity: number;
}

const config = useRuntimeConfig();
const STRAPI_URL = config.public.strapiUrl;

// HERO SLIDES
const heroSlides = [
  {
    number: "01",
    class: "slide-one",
    eyebrow: "THE NEW COLLECTION",
    heading: "MOVE<br>YOUR<br>WAY.",
    description:
      "Everyday essentials. Timeless style. Discover your next favorite find.",
    button: "SHOP NOW",
    label: "EVERYDAY COLLECTION",
  },
  {
    number: "02",
    class: "slide-two",
    eyebrow: "FIND YOUR STYLE",
    heading: "OWN<br>YOUR<br>LOOK.",
    description: "Simple pieces. Strong identity. Make every day your own.",
    button: "EXPLORE NOW",
    label: "STYLE COLLECTION",
  },
  {
    number: "03",
    class: "slide-three",
    eyebrow: "MADE FOR EVERYDAY",
    heading: "LIVE<br>IN<br>STYLE.",
    description:
      "Discover fresh finds designed to fit your everyday lifestyle.",
    button: "DISCOVER MORE",
    label: "LIFESTYLE COLLECTION",
  },
];

// SEARCH AND CATEGORY
const searchQuery = ref("");
const selectedCategory = ref("All");

// DRAWERS
const cartDrawer = ref(false);
const mobileMenu = ref(false);

// CART
const cart = ref<CartItem[]>([]);
const isCartLoaded = ref(false);
const CART_STORAGE_KEY = "mike-shopping-cart";

onMounted(() => {
  try {
    const savedCart = localStorage.getItem(CART_STORAGE_KEY);

    if (savedCart) {
      const parsedCart = JSON.parse(savedCart);

      if (Array.isArray(parsedCart)) {
        cart.value = parsedCart;
      }
    }
  } catch (error) {
    console.error("Unable to restore cart:", error);
    localStorage.removeItem(CART_STORAGE_KEY);
  }

  isCartLoaded.value = true;
});

watch(
  cart,
  (newCart) => {
    if (!isCartLoaded.value) return;
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(newCart));
  },
  { deep: true },
);

// NOTIFICATION
const showCartMessage = ref(false);
const cartMessage = ref("");

// FETCH PRODUCTS
const {
  data: response,
  pending,
  error,
} = await useFetch<{ data: Product[] }>(`${STRAPI_URL}/api/products`, {
  lazy: true,
  query: {
    populate: "image",
    sort: "createdAt:desc",
    "pagination[pageSize]": 100,
    "filters[is_active][$eq]": true,
  },
});

// ========================================
// SCROLL REVEAL
// ========================================

let revealObserver: IntersectionObserver | null = null;

function initializeScrollReveal() {
  if (typeof window === "undefined") return;

  // Respect users who prefer reduced motion
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    document.querySelectorAll(".scroll-reveal").forEach((element) => {
      element.classList.add("is-visible");
    });
    return;
  }

  if (!revealObserver) {
    revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");

            // Animate only once. No flickering when scrolling back.
            revealObserver?.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.08,
        rootMargin: "0px 0px -60px 0px",
      },
    );
  }

  document
    .querySelectorAll(".scroll-reveal:not(.is-visible)")
    .forEach((element) => {
      revealObserver?.observe(element);
    });
}

// IMPORTANT:
// Your page uses v-if="pending", so the sections are not
// available when onMounted initially runs.
// Wait until loading finishes before observing them.

watch(
  pending,
  async (isPending) => {
    if (!isPending) {
      await nextTick();
      initializeScrollReveal();
    }
  },
  { immediate: true, flush: "post" },
);

onMounted(async () => {
  await nextTick();

  if (!pending.value) {
    initializeScrollReveal();
  }
});

onBeforeUnmount(() => {
  revealObserver?.disconnect();
  revealObserver = null;
});

// SHARED PRODUCT STATE
const products = useState<Product[]>("products", () => []);

watch(
  response,
  (newResponse) => {
    if (newResponse?.data) {
      products.value = newResponse.data;
    }
  },
  { immediate: true },
);

// UPDATE PRODUCT STATE AFTER CHECKOUT
function updateProductState(updatedProduct: Product) {
  const index = products.value.findIndex(
    (product) => product.documentId === updatedProduct.documentId,
  );

  if (index === -1) return;

  const existingProduct = products.value[index];
  if (!existingProduct) return;

  products.value[index] = {
    ...existingProduct,
    ...updatedProduct,
    image: updatedProduct.image || existingProduct.image,
  };
}

// CATEGORIES
const categories = computed(() => [
  ...new Set(products.value.map((product) => product.category).filter(Boolean)),
]);

// CATEGORY CLICK
function scrollToProducts() {
  document.getElementById("products")?.scrollIntoView({
    behavior: "smooth",
    block: "start",
  });
}

function selectCategory(category: string) {
  selectedCategory.value = category;
  scrollToProducts();
}

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

// CART COUNT
const cartItemCount = computed(() =>
  cart.value.reduce((total, item) => total + item.quantity, 0),
);

// CART TOTAL
const cartTotal = computed(() =>
  cart.value.reduce((total, item) => total + item.price * item.quantity, 0),
);

// ADD TO CART
function addToCart(product: Product) {
  const existingItem = cart.value.find(
    (item) => item.documentId === product.documentId,
  );

  if (!product.is_active || product.stock <= 0) {
    cartMessage.value = "This product is unavailable.";
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
    cart.value.push({
      ...product,
      quantity: 1,
    });
  }

  cartMessage.value = `${product.name} added to your cart!`;
  showCartMessage.value = true;
}

// QUANTITY
function increaseQuantity(documentId: string) {
  const item = cart.value.find((item) => item.documentId === documentId);

  if (item && item.quantity < item.stock) {
    item.quantity++;
  }
}

function decreaseQuantity(documentId: string) {
  const item = cart.value.find((item) => item.documentId === documentId);

  if (item && item.quantity > 1) {
    item.quantity--;
  }
}

// REMOVE FROM CART
function removeFromCart(documentId: string) {
  cart.value = cart.value.filter((item) => item.documentId !== documentId);
}

// CHECKOUT
const checkoutDialog = ref(false);
const isCheckingOut = ref(false);
const checkoutError = ref("");

const successDialog = ref(false);
const completedOrderId = ref("");

const customer = reactive({
  name: "",
  email: "",
  phone: "",
  address: "",
  paymentMethod: "COD",
});

const checkoutErrors = reactive({
  name: "",
  email: "",
  phone: "",
  address: "",
  paymentMethod: "",
});

function clearCheckoutErrors() {
  Object.keys(checkoutErrors).forEach((key) => {
    checkoutErrors[key as keyof typeof checkoutErrors] = "";
  });
}

function openCheckout() {
  if (cart.value.length === 0) {
    cartMessage.value = "Your cart is empty.";
    showCartMessage.value = true;
    return;
  }

  checkoutError.value = "";
  clearCheckoutErrors();

  cartDrawer.value = false;
  checkoutDialog.value = true;
}

// VALIDATION
function validateCheckout(): boolean {
  clearCheckoutErrors();

  let valid = true;

  if (!customer.name.trim()) {
    checkoutErrors.name = "Full name is required.";
    valid = false;
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customer.email)) {
    checkoutErrors.email = "Enter a valid email address.";
    valid = false;
  }

  if (!customer.phone.trim() || customer.phone.trim().length < 7) {
    checkoutErrors.phone = "Enter a valid phone number.";
    valid = false;
  }

  if (!customer.address.trim()) {
    checkoutErrors.address = "Shipping address is required.";
    valid = false;
  }

  if (!["COD", "GCash"].includes(customer.paymentMethod)) {
    checkoutErrors.paymentMethod = "Select a payment method.";
    valid = false;
  }

  return valid;
}

// STRAPI REQUEST
async function strapiRequest(endpoint: string, method = "GET", body?: unknown) {
  const response = await fetch(`${STRAPI_URL}${endpoint}`, {
    method,
    headers: {
      "Content-Type": "application/json",
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
  });

  const result = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(
      result?.error?.message ||
        result?.message ||
        `Strapi request failed: ${response.status}`,
    );
  }

  return result;
}

// SUBMIT CHECKOUT
async function submitCheckout() {
  checkoutError.value = "";

  if (!validateCheckout()) return;

  if (cart.value.length === 0) {
    checkoutError.value = "Your cart is empty.";
    return;
  }

  isCheckingOut.value = true;

  try {
    // STEP 1: VERIFY PRODUCTS AND STOCK
    const verifiedItems = [];

    for (const item of cart.value) {
      const result = await strapiRequest(
        `/api/products/${encodeURIComponent(item.documentId)}?populate=image`,
      );

      const product = result.data;

      if (!product || !product.is_active) {
        throw new Error(`${item.name} is no longer available.`);
      }

      if (Number(product.stock) < item.quantity) {
        throw new Error(
          `Insufficient stock for ${product.name}. Available: ${product.stock}`,
        );
      }

      verifiedItems.push({
        documentId: product.documentId,
        name: product.name,
        price: Number(product.price),
        stock: Number(product.stock),
        quantity: item.quantity,
      });
    }

    // STEP 2: COMPUTE TOTAL
    const totalItems = verifiedItems.reduce(
      (total, item) => total + item.quantity,
      0,
    );

    const totalAmount = Number(
      verifiedItems
        .reduce((total, item) => total + item.price * item.quantity, 0)
        .toFixed(2),
    );

    // STEP 3: CREATE ORDER
    const orderResult = await strapiRequest("/api/orders", "POST", {
      data: {
        customerName: customer.name.trim(),
        email: customer.email.trim(),
        phone: customer.phone.trim(),
        shippingAddress: customer.address.trim(),
        paymentMethod: customer.paymentMethod,
        order_status: "Pending",
        totalAmount,
        totalItems,
      },
    });

    const orderId = orderResult.data?.documentId;

    if (!orderId) {
      throw new Error("Order was created without a document ID.");
    }

    // STEP 4: CREATE ORDER ITEMS
    for (const item of verifiedItems) {
      await strapiRequest("/api/order-items", "POST", {
        data: {
          quantity: item.quantity,
          unitPrice: item.price,
          subtotal: Number((item.price * item.quantity).toFixed(2)),
          product: {
            connect: [item.documentId],
          },
          order: {
            connect: [orderId],
          },
        },
      });
    }

    // STEP 5: DEDUCT STOCK AND PRESERVE IMAGE
    for (const item of verifiedItems) {
      const before = await strapiRequest(
        `/api/products/${encodeURIComponent(item.documentId)}?populate=image`,
      );

      if (!before.data) {
        throw new Error(`Unable to fetch product: ${item.name}`);
      }

      const remainingStock = item.stock - item.quantity;
      const existingImageId = before.data.image?.id;

      await strapiRequest(
        `/api/products/${encodeURIComponent(item.documentId)}`,
        "PUT",
        {
          data: {
            stock: remainingStock,
            ...(existingImageId
              ? {
                  image: {
                    connect: [existingImageId],
                  },
                }
              : {}),
          },
        },
      );

      const updated = await strapiRequest(
        `/api/products/${encodeURIComponent(item.documentId)}?populate=image`,
      );

      if (!updated.data) {
        throw new Error(`Unable to fetch updated product: ${item.name}`);
      }

      const productWithImage = {
        ...updated.data,
        image: updated.data.image || before.data.image,
      };

      updateProductState(productWithImage);
    }

    // STEP 6: COMPLETE CHECKOUT
    cart.value = [];

    customer.name = "";
    customer.email = "";
    customer.phone = "";
    customer.address = "";
    customer.paymentMethod = "COD";

    checkoutDialog.value = false;
    completedOrderId.value = orderId;
    successDialog.value = true;
  } catch (error: any) {
    console.error("CHECKOUT ERROR:", error);

    checkoutError.value =
      error?.message || "Something went wrong during checkout.";
  } finally {
    isCheckingOut.value = false;
  }
}

// IMAGE URL
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

// PRICE FORMAT
function formatPrice(price: number): string {
  return new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
  }).format(price || 0);
}

// WISHLIST
const wishlist = ref<string[]>([]);

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

function isWishlisted(product: Product): boolean {
  return wishlist.value.includes(product.documentId);
}

// NEWSLETTER
const newsletterEmail = ref("");

const emailRules = [
  (value: string) => !!value || "Email is required.",
  (value: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ||
    "Please enter a valid email address.",
];

function subscribeNewsletter() {
  if (
    !newsletterEmail.value ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newsletterEmail.value)
  ) {
    cartMessage.value = "Please enter a valid email address.";
    showCartMessage.value = true;
    return;
  }

  cartMessage.value = "Welcome to the Mikē community!";
  showCartMessage.value = true;
  newsletterEmail.value = "";
}
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=Outfit:wght@400;500;600;700;800;900&display=swap");

/* ========================================
   THEME
======================================== */

.nike-style {
  --mike-bg: #f4f4f0;
  --mike-dark: #111;
  --mike-accent: #c5ce8a;
  --mike-muted: #888880;

  min-height: 100vh;
  background: var(--mike-bg);
  color: var(--mike-dark);
  font-family: "Inter", sans-serif;
  letter-spacing: -0.2px;
}

.nike-style h1,
.nike-style h2,
.nike-style h3,
.nike-style h4,
.brand-logo,
.footer-logo {
  font-family: "Outfit", sans-serif;
  font-weight: 800;
}

.nike-style button,
.nike-style .v-btn {
  font-family: "Inter", sans-serif;
  font-weight: 700;
}

.nike-style input,
.nike-style textarea {
  font-family: "Inter", sans-serif;
}

.announcement-bar {
  padding: 9px;
  background: var(--mike-dark);
  color: white;
  text-align: center;
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 1.5px;
}

/* ========================================
   NAVBAR
======================================== */

.main-navbar {
  position: sticky !important;
  top: 0;
  z-index: 1000;
  border-bottom: 1px solid #e5e5df;
  backdrop-filter: blur(14px);
  transition: box-shadow 0.3s ease;
}

.main-navbar:hover {
  box-shadow: 0 5px 25px rgba(0, 0, 0, 0.04);
}

.navbar-container {
  max-width: 1500px;
  margin: 0 auto;
}

.brand-logo {
  color: var(--mike-dark);
  font-size: 40px;
  font-weight: 900;
  text-decoration: none;
  letter-spacing: -3px;
  transition: transform 0.3s ease;
}

.brand-logo:hover {
  transform: scale(1.04);
}

.brand-logo span,
.footer-logo span {
  color: var(--mike-accent);
}

.desktop-navigation {
  display: flex;
  align-items: center;
  gap: 12px;
}

.desktop-navigation :deep(.v-btn) {
  position: relative;
  font-size: 11px;
  letter-spacing: 1.2px;
}

.desktop-navigation :deep(.v-btn::after) {
  position: absolute;
  bottom: 5px;
  left: 50%;
  width: 0;
  height: 2px;
  content: "";
  background: var(--mike-accent);
  transform: translateX(-50%);
  transition: width 0.3s ease;
}

.desktop-navigation :deep(.v-btn:hover::after) {
  width: 55%;
}

.mobile-menu {
  display: none;
}

/* ========================================
   MOBILE MENU
======================================== */

.mobile-navigation {
  background: var(--mike-bg);
}

.mobile-menu-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px;
  font-size: 13px;
  font-weight: 900;
  letter-spacing: 2px;
}

.mobile-menu-links {
  display: flex;
  flex-direction: column;
  padding: 20px;
}

.mobile-menu-links a {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 0;
  border-bottom: 1px solid #deded8;
  color: var(--mike-dark);
  font-size: 17px;
  font-weight: 900;
  letter-spacing: 1px;
  text-decoration: none;
}

.mobile-cart-link {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 20px 0;
  border: none;
  background: transparent;
  color: var(--mike-dark);
  font-size: 17px;
  font-weight: 900;
  letter-spacing: 1px;
  cursor: pointer;
}

.mobile-menu-footer {
  padding: 20px;
  border-top: 1px solid #deded8;
  color: #888;
  font-size: 9px;
  font-weight: 800;
  letter-spacing: 1.5px;
}

/* ========================================
   HERO
======================================== */

.hero-section {
  width: 100%;
  overflow: hidden;
  background: var(--mike-dark);
}

.hero-slide {
  position: relative;
  display: flex;
  align-items: center;
  height: 100%;
  min-height: 540px;
  padding: 60px 10%;
  background-position: center;
  background-size: cover;
}

.slide-one {
  background-image: url("https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=1800&q=85");
  background-position: center 35%;
}

.slide-two {
  background-image: url("https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=1800&q=85");
}

.slide-three {
  background-image: url("https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1800&q=85");
}

.hero-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    90deg,
    rgba(0, 0, 0, 0.82),
    rgba(0, 0, 0, 0.42),
    rgba(0, 0, 0, 0.08)
  );
}

.hero-content {
  position: relative;
  z-index: 2;
  max-width: 650px;
  color: white;
  animation: mikeFadeUp 0.9s ease both;
}

.hero-accent-line {
  width: 48px;
  height: 4px;
  margin-bottom: 22px;
  border-radius: 10px;
  background: var(--mike-accent);
}

.hero-eyebrow {
  color: var(--mike-accent);
  font-size: 11px;
  font-weight: 900;
  letter-spacing: 3px;
}

.hero-content h1 {
  margin-top: 25px;
  color: white;
  font-family: "Outfit", sans-serif;
  font-size: clamp(75px, 11vw, 140px);
  font-weight: 900;
  line-height: 0.83;
  letter-spacing: -7px;
  text-shadow: 0 8px 30px rgba(0, 0, 0, 0.25);
}

.hero-content p {
  max-width: 390px;
  margin-top: 25px;
  margin-bottom: 25px;
  color: #deded8;
  font-size: 14px;
  line-height: 1.9;
}

.hero-button {
  color: #111 !important;
  font-weight: 900 !important;
  letter-spacing: 1px;
  transition: all 0.3s ease !important;
}

.hero-button:hover,
.promo-button:hover {
  background: var(--mike-accent) !important;
  transform: translateY(-4px);
}

.hero-bottom-label {
  position: absolute;
  right: 30px;
  bottom: 22px;
  z-index: 2;
  color: var(--mike-accent);
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 2px;
}

/* ========================================
   SECTIONS AND HEADINGS
======================================== */

.section-spacing {
  padding-top: 55px;
}

.section-header {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 20px;
}

.eyebrow {
  color: #92947e;
  font-size: 10px;
  font-weight: 900;
  letter-spacing: 2.5px;
}

.section-header h2 {
  margin-top: 10px;
  font-family: "Outfit", sans-serif;
  font-size: clamp(30px, 4vw, 43px);
  font-weight: 900;
  letter-spacing: -2px;
}

.section-header p {
  margin-top: 8px;
  color: #777;
  font-size: 14px;
}

.view-all-link {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding-bottom: 8px;
  color: var(--mike-dark);
  font-size: 11px;
  font-weight: 900;
  letter-spacing: 1px;
  text-decoration: none;
  transition: color 0.25s ease;
}

.view-all-link:hover {
  color: #858b5c;
}

/* Anchor spacing for sticky navbar */
#products,
#categories {
  scroll-margin-top: 95px;
}

/* ========================================
   CATEGORY SHOWCASE
======================================== */

.category-showcase {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 15px;
  margin-top: 30px;
}

.category-showcase-card {
  position: relative;
  display: flex;
  min-height: 190px;
  flex-direction: column;
  align-items: flex-start;
  justify-content: space-between;
  padding: 25px;
  overflow: hidden;
  border: 1px solid transparent;
  border-radius: 15px;
  background: #e9e9e2;
  color: #111;
  text-align: left;
  cursor: pointer;
  transition: all 0.35s ease;
  animation: mikeFadeUp 0.7s ease both;
}

.category-showcase-card:nth-child(2) {
  background: #dedfd2;
  animation-delay: 0.1s;
}

.category-showcase-card:nth-child(3) {
  background: #d4d6c5;
  animation-delay: 0.2s;
}

.category-showcase-card:hover {
  transform: translateY(-7px);
  border-color: var(--mike-accent);
  background: #111;
  color: white;
}

.category-number {
  font-size: 11px;
  font-weight: 900;
  letter-spacing: 2px;
  opacity: 0.55;
}

.category-card-content h3 {
  overflow-wrap: anywhere;
  font-size: 24px;
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: -1px;
}

.category-card-content span {
  display: block;
  margin-top: 8px;
  font-size: 9px;
  font-weight: 800;
  letter-spacing: 1.5px;
  opacity: 0.6;
}

.category-arrow {
  position: absolute;
  top: 22px;
  right: 22px;
  transition: transform 0.3s ease;
}

.category-showcase-card:hover .category-arrow {
  color: var(--mike-accent);
  transform: translate(4px, -4px);
}

/* ========================================
   PROMOTION
======================================== */

.promo-section {
  position: relative;
  display: flex;
  min-height: 330px;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  padding: 65px;
  overflow: hidden;
  border-radius: 18px;
  background: #111;
  color: white;
}

.promo-content {
  position: relative;
  z-index: 2;
}

.light-eyebrow {
  color: #bdbdbd;
}

.promo-section h2 {
  margin-top: 18px;
  font-family: "Outfit", sans-serif;
  font-size: clamp(40px, 5vw, 65px);
  font-weight: 900;
  line-height: 0.95;
  letter-spacing: -2px;
}

.promo-section p {
  max-width: 400px;
  margin-top: 15px;
  margin-bottom: 25px;
  color: #bdbdb5;
  font-size: 13px;
  line-height: 1.9;
}

.promo-button {
  color: #111 !important;
  font-weight: 900 !important;
  transition: all 0.3s ease !important;
}

.promo-decoration {
  position: absolute;
  top: 50%;
  right: 8%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  color: var(--mike-accent);
  opacity: 0.8;
  transform: translateY(-50%);
}

.promo-decoration span {
  font-family: "Outfit", sans-serif;
  font-size: 65px;
  font-weight: 900;
  letter-spacing: -6px;
}

/* ========================================
   SEARCH AND FILTER
======================================== */

.product-search-area {
  max-width: 650px;
  margin-top: 28px;
}

.product-search {
  display: flex;
  min-height: 58px;
  align-items: center;
  gap: 14px;
  width: 100%;
  padding: 0 18px;
  border: 1px solid transparent;
  background: #e9e9e4;
  transition: all 0.25s ease;
}

.product-search:focus-within {
  border-color: #111;
  background: white;
}

.product-search-input {
  flex: 1;
  min-width: 0;
  height: 56px;
  border: none;
  outline: none;
  background: transparent;
  color: #111;
  font-size: 14px;
}

.product-search-input::placeholder {
  color: #888;
}

.search-clear {
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  background: transparent;
  color: #555;
  cursor: pointer;
}

.search-caption {
  display: block;
  margin-top: 9px;
  color: #888;
  font-size: 9px;
  font-weight: 800;
  letter-spacing: 1.5px;
}

.category-list {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 22px;
}

/* ========================================
   PRODUCT CARDS
======================================== */

.product-grid {
  align-items: stretch;
}

.product-column {
  display: flex;
}

.product-card {
  display: flex;
  width: 100%;
  height: 100%;
  flex-direction: column;
  overflow: hidden;
  border: 1px solid #eaeae4;
  border-radius: 17px !important;
  background: white;
  transition:
    transform 0.35s ease,
    box-shadow 0.35s ease,
    border-color 0.35s ease;
}

.product-card:hover {
  transform: translateY(-7px);
  border-color: #d6d8c5;
  box-shadow: 0 18px 35px rgba(0, 0, 0, 0.07);
}

.product-image {
  position: relative;
  flex-shrink: 0;
  margin: 10px;
  overflow: hidden;
  border-radius: 12px;
  background: #f1f1eb;
}

.product-image :deep(.v-img img) {
  object-fit: contain;
  transition: transform 0.65s cubic-bezier(0.2, 0.7, 0.3, 1);
}

.product-card:hover .product-image :deep(.v-img img) {
  transform: scale(1.08);
}

.image-placeholder {
  display: flex;
  height: 300px;
  align-items: center;
  justify-content: center;
  background: #f5f5f2;
}

.wishlist-button {
  position: absolute;
  top: 12px;
  right: 12px;
  z-index: 2;
  background: white !important;
  box-shadow: 0 3px 12px rgba(0, 0, 0, 0.08);
  transition: transform 0.25s ease;
}

.wishlist-button:hover {
  transform: scale(1.12) rotate(-8deg);
}

.product-tag {
  position: absolute;
  bottom: 12px;
  left: 12px;
  padding: 8px 12px;
  border-radius: 30px;
  background: var(--mike-accent);
  color: #111;
  font-size: 9px;
  font-weight: 900;
  letter-spacing: 1.2px;
  box-shadow: 0 3px 12px rgba(0, 0, 0, 0.06);
}

.out-of-stock {
  background: #111;
  color: white;
}

.product-details {
  display: flex;
  flex: 1;
  flex-direction: column;
  padding: 14px 16px 10px !important;
}

.product-heading {
  min-height: 69px;
}

.product-name {
  font-family: "Outfit", sans-serif;
  font-size: 17px;
  font-weight: 800;
  letter-spacing: -0.4px;
}

.product-category {
  min-height: 14px;
  margin-top: 5px;
  color: #999;
  font-size: 10px;
  font-weight: 700;
  line-height: 1.4;
  letter-spacing: 1.2px;
  text-transform: uppercase;
}

.product-price {
  margin-top: 7px;
  color: #111;
  font-family: "Outfit", sans-serif;
  font-size: 21px;
  font-weight: 900;
  letter-spacing: -0.5px;
}

.product-description {
  display: -webkit-box;
  min-height: 41px;
  margin-top: 9px;
  overflow: hidden;
  color: #85857e;
  font-size: 12px;
  line-height: 1.7;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}

.product-actions {
  margin-top: auto;
  padding: 8px 16px 18px !important;
}

.add-to-cart-button {
  border: 1px solid #111 !important;
  border-radius: 30px !important;
  background: #111 !important;
  color: white !important;
  font-size: 12px !important;
  font-weight: 900 !important;
  letter-spacing: 1.3px !important;
  transition: all 0.25s ease !important;
}

.add-to-cart-button:hover {
  transform: translateY(-2px);
  border-color: var(--mike-accent) !important;
  background: var(--mike-accent) !important;
  color: #111 !important;
}

.add-to-cart-button:disabled {
  border-color: #d5d5d5 !important;
  background: #d5d5d5 !important;
  color: #777 !important;
  opacity: 1 !important;
}

/* ========================================
   CART DRAWER
======================================== */

.cart-drawer {
  max-width: 100vw;
  background: #f8f8f4;
}

.cart-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 30px 25px;
}

.cart-eyebrow,
.checkout-eyebrow {
  color: #999;
  font-size: 9px;
  font-weight: 900;
  letter-spacing: 2px;
}

.cart-header h2 {
  margin-top: 8px;
  font-size: 27px;
  font-weight: 900;
  letter-spacing: -1.5px;
}

.cart-header h2 span {
  color: #999;
  font-size: 16px;
}

.cart-content {
  display: flex;
  height: calc(100% - 95px);
  min-height: 0;
  flex-direction: column;
}

.cart-items {
  flex: 1;
  min-height: 0;
  padding: 20px;
  overflow-y: auto;
}

.cart-item {
  display: grid;
  grid-template-columns: 125px 1fr;
  gap: 16px;
  margin-bottom: 22px;
  padding-bottom: 22px;
  border-bottom: 1px solid #e5e5df;
}

.cart-item-image {
  display: flex;
  height: 155px;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  border-radius: 10px;
  background: #edede8;
}

.cart-item-info {
  min-width: 0;
}

.cart-item-category {
  color: #999;
  font-size: 9px;
  font-weight: 800;
  letter-spacing: 1.3px;
}

.cart-item-info h3 {
  margin-top: 5px;
  font-size: 14px;
  font-weight: 800;
  line-height: 1.4;
}

.cart-item-price {
  margin-top: 13px;
  font-size: 15px;
  font-weight: 900;
}

.cart-item-bottom {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  margin-top: 15px;
}

.quantity-control {
  display: flex;
  align-items: center;
  gap: 13px;
  padding: 5px 10px;
  border: 1px solid #ddd;
  border-radius: 30px;
  background: white;
}

.quantity-control button {
  border: none;
  background: transparent;
  color: #111;
  font-size: 19px;
  cursor: pointer;
}

.quantity-control button:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.quantity-control span {
  font-size: 12px;
  font-weight: 800;
}

.cart-item-subtotal {
  font-size: 11px;
  font-weight: 800;
}

.cart-stock {
  display: block;
  margin-top: 10px;
  color: #999;
  font-size: 9px;
  font-weight: 800;
  letter-spacing: 1px;
}

.cart-summary {
  flex-shrink: 0;
  padding: 23px 25px;
  border-top: 1px solid #e5e5df;
  background: white;
}

.cart-summary-top {
  display: flex;
  justify-content: space-between;
  font-size: 15px;
  font-weight: 900;
}

.cart-summary p {
  margin-top: 9px;
  margin-bottom: 20px;
  color: #999;
  font-size: 11px;
}

.continue-shopping {
  display: block;
  margin: 17px auto 0;
  border: none;
  background: transparent;
  font-size: 10px;
  font-weight: 900;
  letter-spacing: 1px;
  cursor: pointer;
}

.empty-cart {
  padding: 90px 25px;
  color: #777;
  text-align: center;
}

.empty-cart h3 {
  margin-top: 20px;
  color: #111;
  font-size: 22px;
  font-weight: 900;
}

/* ========================================
   CHECKOUT
======================================== */

.checkout-card,
.success-card {
  overflow: hidden;
  background: #f8f8f4;
}

.checkout-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 30px 35px;
}

.checkout-header p {
  margin-top: 5px;
  color: #888;
  font-size: 12px;
}

.checkout-header h2 {
  font-family: "Outfit", sans-serif;
  font-weight: 900;
  letter-spacing: -1.5px;
}

.checkout-body {
  padding: 30px 35px !important;
}

.checkout-form-column {
  padding-right: 35px;
}

.checkout-step {
  display: flex;
  align-items: center;
  gap: 13px;
  margin-bottom: 22px;
}

.checkout-step span {
  display: flex;
  width: 30px;
  height: 30px;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: #111;
  color: white;
  font-size: 11px;
  font-weight: 900;
}

.checkout-step h3 {
  font-size: 13px;
  font-weight: 900;
  letter-spacing: 1px;
}

.checkout-form-column :deep(.v-field) {
  background: white;
}

.payment-option {
  padding: 13px;
  border: 1px solid #e5e5df;
  border-radius: 12px;
  background: white;
}

.payment-label {
  display: flex;
  align-items: center;
  gap: 13px;
  padding: 5px;
  color: #111;
}

.payment-label strong,
.payment-label small {
  display: block;
}

.payment-label strong {
  font-size: 12px;
  font-weight: 900;
}

.payment-label small {
  margin-top: 4px;
  color: #888;
  font-size: 10px;
}

.checkout-summary {
  height: 100%;
  padding: 25px;
  border: 1px solid #e9e9e3;
  border-radius: 15px;
  background: white;
}

.checkout-summary-eyebrow {
  color: #999;
  font-size: 9px;
  font-weight: 900;
  letter-spacing: 1.5px;
}

.checkout-summary > h3 {
  margin-top: 7px;
  margin-bottom: 20px;
  font-size: 20px;
  font-weight: 900;
  letter-spacing: -0.7px;
}

.checkout-product {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 0;
  border-bottom: 1px solid #eee;
}

.checkout-product-image {
  display: flex;
  width: 65px;
  height: 75px;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  border-radius: 8px;
  background: #f0f0eb;
}

.checkout-product-info {
  display: flex;
  flex: 1;
  min-width: 0;
  flex-direction: column;
  gap: 6px;
}

.checkout-product-info strong {
  font-size: 11px;
  line-height: 1.4;
}

.checkout-product-info span {
  color: #999;
  font-size: 10px;
}

.checkout-product-total {
  font-size: 11px;
  white-space: nowrap;
}

.summary-line {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 14px;
  color: #777;
  font-size: 11px;
}

.summary-line strong {
  color: #111;
  text-align: right;
}

.checkout-total {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  font-weight: 900;
}

.checkout-total strong {
  font-size: 23px;
  letter-spacing: -1px;
}

.checkout-note {
  margin-top: 15px;
  color: #999;
  font-size: 10px;
  line-height: 1.7;
}

.secure-checkout {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 7px;
  margin-top: 17px;
  color: #999;
  font-size: 8px;
  font-weight: 800;
  letter-spacing: 1px;
}

/* ========================================
   ORDER SUCCESS
======================================== */

.success-icon {
  display: flex;
  width: 85px;
  height: 85px;
  align-items: center;
  justify-content: center;
  margin: 35px auto 0;
  border-radius: 50%;
  background: #111;
}

.success-eyebrow {
  color: #888;
  font-size: 10px;
  font-weight: 900;
  letter-spacing: 2px;
}

.success-title {
  color: #111;
  font-family: "Outfit", sans-serif;
  font-size: 42px;
  font-weight: 900;
  letter-spacing: -2px;
}

.success-message {
  color: #777;
  font-size: 14px;
  line-height: 1.8;
}

.order-reference {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 18px;
  border-radius: 12px;
  background: #eeeeea;
}

.order-reference span {
  color: #888;
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 1.5px;
}

.order-reference strong {
  color: #111;
  font-size: 19px;
  word-break: break-all;
}

/* ========================================
   NEWSLETTER
======================================== */

.newsletter-section {
  padding: 25px 0;
  background: #e8e9df;
}

.newsletter-section h2 {
  margin-top: 18px;
  font-family: "Outfit", sans-serif;
  font-size: clamp(42px, 6vw, 67px);
  font-weight: 900;
  line-height: 0.95;
  letter-spacing: -3px;
}

.newsletter-section p {
  max-width: 400px;
  margin-top: 18px;
  color: #686960;
  font-size: 13px;
  line-height: 1.8;
}

.newsletter-form {
  max-width: 500px;
  margin-left: auto;
}

.newsletter-form :deep(.v-field) {
  border-radius: 12px;
  background: white;
}

.newsletter-form :deep(.v-btn) {
  height: 53px;
  font-weight: 900;
  letter-spacing: 1px;
  transition: all 0.3s ease;
}

.newsletter-form :deep(.v-btn:hover) {
  transform: translateY(-3px);
  background: #343a22 !important;
}

/* ========================================
   FOOTER
======================================== */

.main-footer {
  border-top: 4px solid var(--mike-accent);
  background: #111;
  color: white;
}

.footer-logo {
  font-size: 55px;
  font-weight: 900;
  letter-spacing: -5px;
}

.footer-description {
  color: #aaa;
  font-size: 13px;
  line-height: 1.8;
}

.main-footer h4 {
  margin-bottom: 18px;
  color: var(--mike-accent);
  font-size: 11px;
  letter-spacing: 2px;
}

.footer-links {
  display: flex;
  flex-direction: column;
  gap: 13px;
}

.footer-links a {
  color: #aaa;
  font-size: 13px;
  text-decoration: none;
  transition: all 0.25s ease;
}

.footer-links a:hover {
  color: var(--mike-accent);
  transform: translateX(5px);
}

.footer-bottom {
  color: #85857e;
  font-size: 10px;
  letter-spacing: 1.5px;
}

/* ========================================
   ANIMATIONS
======================================== */

@keyframes mikeFadeUp {
  from {
    opacity: 0;
    transform: translateY(25px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.section-header,
.product-search-area,
.product-category-list,
.product-grid,
.promo-section,
.newsletter-section {
  animation: mikeFadeUp 0.8s ease both;
}

/* ========================================
   RESPONSIVE
======================================== */

@media (max-width: 960px) {
  .desktop-navigation,
  .desktop-cart {
    display: none !important;
  }

  .mobile-menu {
    display: flex !important;
    align-items: center;
  }

  .category-showcase {
    grid-template-columns: repeat(2, 1fr);
  }

  .promo-decoration {
    right: 4%;
    opacity: 0.3;
  }
}

@media (max-width: 600px) {
  .brand-logo {
    font-size: 34px;
  }

  .hero-slide {
    min-height: 540px;
    padding: 40px 25px;
    background-position: 60% center;
  }

  .hero-content h1 {
    font-size: 76px;
    letter-spacing: -5px;
  }

  .hero-content p {
    font-size: 14px;
  }

  .hero-accent-line {
    width: 35px;
  }

  .hero-bottom-label {
    right: 15px;
    font-size: 8px;
  }

  .section-spacing {
    padding-top: 38px;
  }

  .section-header h2 {
    font-size: 25px;
  }

  .product-section-header {
    align-items: flex-start;
  }

  .view-all-link {
    flex-shrink: 0;
    font-size: 9px;
  }

  .category-showcase {
    grid-template-columns: 1fr;
    gap: 10px;
  }

  .category-showcase-card {
    min-height: 145px;
    padding: 20px;
  }

  .category-card-content h3 {
    font-size: 21px;
  }

  .promo-section {
    min-height: 300px;
    padding: 35px 25px;
  }

  .promo-decoration {
    display: none;
  }

  .product-card {
    border-radius: 13px !important;
  }

  .product-image {
    margin: 7px;
    border-radius: 10px;
  }

  .product-image :deep(.v-img) {
    height: 220px !important;
  }

  .image-placeholder {
    height: 220px;
  }

  .product-details {
    padding: 12px 12px 8px !important;
  }

  .product-heading {
    min-height: 64px;
  }

  .product-name {
    min-height: 36px;
    font-size: 13px;
  }

  .product-price {
    margin-top: 10px;
    font-size: 16px;
  }

  .product-description {
    min-height: 38px;
    font-size: 11px;
  }

  .product-actions {
    padding: 8px 12px 14px !important;
  }

  .add-to-cart-button {
    height: 44px !important;
    font-size: 10px !important;
  }

  .product-tag {
    padding: 6px 9px;
    font-size: 8px;
  }

  .wishlist-button {
    top: 8px;
    right: 8px;
  }

  .newsletter-section {
    padding: 10px 0;
  }

  .newsletter-section h2 {
    font-size: 45px;
  }

  .newsletter-form {
    margin-left: 0;
  }

  .footer-logo {
    font-size: 45px;
  }

  .cart-item {
    grid-template-columns: 105px 1fr;
    gap: 12px;
  }

  .cart-item-image {
    height: 140px;
  }

  .cart-header {
    padding: 23px 18px;
  }

  .cart-items {
    padding: 15px;
  }

  .cart-summary {
    padding: 18px;
  }

  .checkout-header {
    padding: 22px 18px;
  }

  .checkout-body {
    padding: 18px !important;
  }

  .checkout-form-column {
    padding-right: 12px;
  }

  .checkout-summary {
    padding: 20px 15px;
  }

  .checkout-total strong {
    font-size: 20px;
  }
}

/* ACCESSIBILITY */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}

/* ========================================
   SCROLL REVEAL ANIMATIONS
======================================== */

.scroll-reveal {
  opacity: 0;
  transform: translate3d(0, 55px, 0);
  transition:
    opacity 0.9s ease,
    transform 0.9s cubic-bezier(0.22, 1, 0.36, 1);

  will-change: opacity, transform;
}

.scroll-reveal.is-visible {
  opacity: 1;
  transform: translate3d(0, 0, 0);
}

/* HERO */
.hero-section.scroll-reveal {
  transform: translate3d(0, 35px, 0) scale(0.985);
}

.hero-section.scroll-reveal.is-visible {
  transform: translate3d(0, 0, 0) scale(1);
}

/* PROMOTION */
.promo-content.scroll-reveal {
  transform: translate3d(-45px, 0, 0);
}

.promo-content.scroll-reveal.is-visible {
  transform: translate3d(0, 0, 0);
}

/* PRODUCT CARDS */
.product-column {
  animation: none;
}

.product-grid .product-column {
  opacity: 0;
  transform: translateY(35px);
  transition:
    opacity 0.7s ease,
    transform 0.7s cubic-bezier(0.22, 1, 0.36, 1);
}

.scroll-reveal.is-visible .product-column {
  opacity: 1;
  transform: translateY(0);
}

.scroll-reveal.is-visible .product-column:nth-child(1) {
  transition-delay: 0.05s;
}

.scroll-reveal.is-visible .product-column:nth-child(2) {
  transition-delay: 0.12s;
}

.scroll-reveal.is-visible .product-column:nth-child(3) {
  transition-delay: 0.19s;
}

.scroll-reveal.is-visible .product-column:nth-child(4) {
  transition-delay: 0.26s;
}

.scroll-reveal.is-visible .product-column:nth-child(n + 5) {
  transition-delay: 0.3s;
}

/* ACCESSIBILITY */
@media (prefers-reduced-motion: reduce) {
  .scroll-reveal,
  .hero-section.scroll-reveal,
  .promo-content.scroll-reveal,
  .product-grid .product-column {
    opacity: 1 !important;
    transform: none !important;
    transition: none !important;
  }
}
</style>
