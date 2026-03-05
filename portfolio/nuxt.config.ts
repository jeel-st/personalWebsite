// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['@nuxt/eslint', '@nuxtjs/tailwindcss','@nuxtjs/color-mode','@nuxtjs/google-fonts'],
  colorMode: {
    classSuffix: '' // Extrem wichtig: Sagt dem Modul, dass es die Klasse "dark" (für Tailwind) nutzen soll, nicht "dark-mode"
  },
  googleFonts: {
    families: {
      'Oswald': [400, 700],
      'Bebas Neue': [400, 700]
    }
  }
})