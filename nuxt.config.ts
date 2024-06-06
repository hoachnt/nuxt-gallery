// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: [
    "@nuxt/fonts",
    "@nuxt/ui",
    "@vueuse/nuxt",
    "nuxt-auth-utils",
    "nuxt-directus",
  ],

  runtimeConfig: {
    public: { directus: { url: process.env.NUXT_PUBLIC_DIRECTUS_URL } },
  },

  ui: {
    icons: ["simple-icons"],
  },

  experimental: {
    viewTransition: true,
  },
});
