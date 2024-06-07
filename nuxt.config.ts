// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: [
    "@nuxt/fonts",
    "@nuxt/ui",
    "@vueuse/nuxt",
    "nuxt-auth-utils",
    "nuxt-directus",
    "@nuxt/image",
  ],

  image: {
    format: ["webp", "avif"],
    screens: {
      xs: 320,
      sm: 640,
      md: 768,
      lg: 1024,
      xl: 1280,
      xxl: 1536,
      "2xl": 1536,
    },
    domains: ["directus.hoachnt.com"],
    provider: "directus",
    directus: {
      baseURL: "https://directus.hoachnt.com/assets/",
    },
  },

  runtimeConfig: {
    public: {
      directus: { url: process.env.NUXT_PUBLIC_DIRECTUS_URL },
      session: {
        name: "nuxt-session",
        cookie: {
          sameSite: "lax",
        },
      },
    },
  },

  ui: {
    icons: ["simple-icons"],
  },

  experimental: {
    viewTransition: true,
  },
});
