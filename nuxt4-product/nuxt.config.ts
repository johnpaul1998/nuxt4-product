// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  runtimeConfig: {
    public: {
      strapiUrl: 'https://product-cms-jecw.onrender.com',
      },
    },
     modules: [
    'vuetify-nuxt-module',
    '@vercel/analytics'
  ]
})
