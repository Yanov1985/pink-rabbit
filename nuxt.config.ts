export default defineNuxtConfig({
  compatibilityDate: '2025-05-15',
  devtools: { enabled: true },
  pages: true,
  css: ['~/assets/css/main.css'],
  ssr: true,
  // Конфигурация для Tailwind v3 (версия V02)
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
  typescript: {
    strict: false,
    typeCheck: false
  },
  modules: [
    '@nuxtjs/google-fonts'
  ],
  googleFonts: {
    families: {
      'Inter': [300, 400, 500, 600, 700],
      'Roboto': [300, 400, 500, 700]
    }
  },
  plugins: [
    '~/plugins/gsap.client.js'
  ]
})
