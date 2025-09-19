import { defineNuxtPlugin } from "nuxt/app";
import { initFlowbite } from "flowbite";
export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.hook("app:mounted", () => initFlowbite());
  nuxtApp.hook("page:finish", () => initFlowbite());
});
