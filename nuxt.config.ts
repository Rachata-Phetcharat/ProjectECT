// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  typescript: { strict: true },
  modules: ["@nuxt/ui", "@nuxt/eslint", "@nuxt/icon"],
  css: ["~/assets/main.css", "~/assets/tokens.css"],
  vite: {
    plugins: [tailwindcss()],
  },
  runtimeConfig: {
    public: {
      apiBase: "https://fastapi888.lukeenortaed.site",
    },
  },
  app: {
    head: {
      titleTemplate: "RAG",
    },
  },
});
