// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  modules: ["@nuxt/ui", "@nuxt/eslint", "@nuxt/icon"],
  css: ["~/assets/main.css"],
  vite: {
    plugins: [tailwindcss()],
  },
  // runtimeConfig: {
  //   public: {
  //     apiBase: process.env.API_BASE || "http://atom888.3bbddns.com:16251/",
  //   },
  // },
});
