import plugin from 'tailwindcss/plugin';

export default {
  theme: {
    extend: {
      colors: {
        primary: 'var(--color-bg)',
        surface: 'var(--color-surface)',
        secondary: 'var(--color-accent)',
        bodyText: 'var(--color-text)',
        mutedText: 'var(--color-text-muted)',
      },
      fontFamily: {
        sans: ['Oswald', 'sans-serif'],
        serif: ['Bebas Neue', 'serif'],
      }
    }
  },
  plugins: [
    // Erzeugt theme-forest:, theme-sunset:, theme-ocean:, theme-slate: Varianten,
    // die genau wie das frühere "dark:" funktionieren, nur pro Farbschema.
    plugin(({ addVariant }) => {
      const themeIds = ['forest', 'sunset', 'ocean', 'slate'];
      themeIds.forEach((id) => {
        addVariant(`theme-${id}`, `[data-theme='${id}'] &`);
      });
    }),
  ],
}