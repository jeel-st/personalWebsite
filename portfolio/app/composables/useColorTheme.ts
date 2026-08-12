export const COLOR_THEMES = [
  { id: 'forest', label: 'Forest', swatch: '#4b6b4e', isDark: false },
  { id: 'sunset', label: 'Sunset', swatch: '#c2410c', isDark: false },
  { id: 'ocean', label: 'Ocean', swatch: '#60a5fa', isDark: true },
  { id: 'slate', label: 'Slate', swatch: '#94a3b8', isDark: true },
] as const;

export type ColorThemeId = typeof COLOR_THEMES[number]['id'];

export function useColorTheme() {
  const theme = useCookie<ColorThemeId>('color-theme', { default: () => 'forest' });
  const current = computed(() => COLOR_THEMES.find((t) => t.id === theme.value) ?? COLOR_THEMES[0]);
  return { theme, themes: COLOR_THEMES, current };
}
