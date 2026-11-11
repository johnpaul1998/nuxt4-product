// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  runtimeConfig: {
    public: {
      strapiUrl: 'http://localhost:1337',
      },
    },
     modules: [
    'vuetify-nuxt-module'
  ]
})

