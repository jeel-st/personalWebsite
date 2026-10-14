// https://nuxt.com/docs/api/configuration/nuxt-config
import { projectMarkdown } from './build/projectMarkdown';

export default defineNuxtConfig({
  vite: {
    plugins: [projectMarkdown()],
  },
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  css: ['~/assets/css/main.css'],
  modules: [
    '@nuxt/eslint',
    '@nuxtjs/tailwindcss',
    '@nuxtjs/google-fonts',
    // Neue oder gelöschte Projekt-Dateien erkennt der Server-Teil des Dev-Servers nicht von selbst.
    // Daher in diesem Fall den Dev-Server neu starten (Änderungen an bestehenden Dateien klappen ohne).
    (_options, nuxt) => {
      nuxt.hook('builder:watch', async (event, path) => {
        if ((event === 'add' || event === 'unlink') && /content[\\/]projects[\\/].+\.md$/.test(path)) {
          await nuxt.callHook('restart');
        }
      });
    },
  ],
  googleFonts: {
    families: {
      'Oswald': [400, 700],
      'Bebas Neue': [400, 700]
    }
  }
})