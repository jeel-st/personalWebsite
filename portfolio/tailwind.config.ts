import plugin from 'tailwindcss/plugin';

// Theme-Farbe aus einer CSS-Variable. Als Funktion definiert, damit auch Klassen mit Deckkraft
// (z. B. bg-surface/60 oder border-secondary/20) funktionieren: Aus einer reinen var(...)-Farbe
// kann Tailwind sonst keine halbtransparente Variante erzeugen und lässt die Klasse stillschweigend weg.
function themeColor(variable: string) {
  return ({ opacityValue }: { opacityValue?: string }) =>
    opacityValue === undefined
      ? `var(${variable})`
      : `color-mix(in srgb, var(${variable}) calc(${opacityValue} * 100%), transparent)`;
}

export default {
  theme: {
    extend: {
      colors: {
        primary: themeColor('--color-bg'),
        surface: themeColor('--color-surface'),
        secondary: themeColor('--color-accent'),
        bodyText: themeColor('--color-text'),
        mutedText: themeColor('--color-text-muted'),
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