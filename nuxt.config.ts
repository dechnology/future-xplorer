// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  imports: { dirs: ['stores'] },
  devtools: { enabled: true },
  modules: ['@nuxtjs/tailwindcss', 'nuxt-icon', '@pinia/nuxt'],
  pinia: {
    autoImports: [
      // automatically imports `defineStore`
      'defineStore', // import { defineStore } from 'pinia'
      ['defineStore', 'definePiniaStore'], // import { defineStore as definePiniaStore } from 'pinia'
    ],
  },
});
