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
    mongoUser: process.env.MONGO_USER,
    mongoPassword: process.env.MONGO_PASSWORD,
    mongoHost: process.env.MONGO_HOST,
    mongoPort: process.env.MONGO_PORT,
    mongoDb: process.env.MONGO_DB,
    jwtSecretKey: process.env.JWT_SECRET_KEY,
    openaiApiKey: process.env.OPENAI_API_KEY,
    s3Domain: process.env.S3_DOMAIN,
    s3AccessKeyId: process.env.S3_ACCESS_KEY_ID,
    s3SecretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
  },
  imports: { dirs: ['stores'] },
  devtools: { enabled: true },
  modules: ['@nuxtjs/tailwindcss', 'nuxt-icon', '@pinia/nuxt', '@nuxt/image'],
  pinia: {
    autoImports: [
      // import { defineStore as definePiniaStore } from 'pinia'
      ['defineStore', 'definePiniaStore'],
      'storeToRefs',
    ],
  },
  image: {
    domains: [
      'dechnology.s3.us-west-2.amazonaws.com',
      'oaidalleapiprodscus.blob.core.windows.net',
    ],
    alias: {
      s3: 'https://dechnology.s3.us-west-2.amazonaws.com/tdri',
    },
    ipx: {
      maxAge: 2592000,
    },
    presets: {
      card: {
        modifiers: {
          format: 'webp',
        },
      },
    },
  },
});
