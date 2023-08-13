// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  app: {
    head: {
      title: '未來情境探索輔助工具',
      meta: [{ name: 'description', content: '未來情境探索輔助工具' }],
      link: [
        {
          rel: 'icon',
          type: 'image/svg+xml',
          href: '/favicon.svg',
          media: '(prefers-color-scheme: dark)',
        },
        {
          rel: 'icon',
          type: 'image/svg+xml',
          href: '/favicon-light.svg',
          media: '(prefers-color-scheme: light)',
        },
      ],
    },
  },
  runtimeConfig: {
    mongoConnectionStr: process.env.MONGO_CONNECTION_STR,
    jwtSecretKey: process.env.JWT_SECRET_KEY,
  },
  imports: { dirs: ['stores'] },
  devtools: { enabled: true },
  modules: ['@nuxtjs/tailwindcss', 'nuxt-icon', '@pinia/nuxt'],
  pinia: {
    autoImports: [
      // import { defineStore as definePiniaStore } from 'pinia'
      ['defineStore', 'definePiniaStore'],
    ],
  },
});
