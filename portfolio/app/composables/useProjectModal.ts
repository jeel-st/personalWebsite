// Das offene Projekt steht in der URL (?project=slug). Dadurch lassen sich Projekte direkt
// verlinken, und die Zurück-Taste (z. B. am Handy) schließt das Fenster, statt die Seite zu verlassen.
export function useProjectModal() {
  const route = useRoute();
  const router = useRouter();
  // Merkt sich, ob das Fenster per Klick auf dieser Seite geöffnet wurde (dann gibt es einen
  // History-Eintrag, zu dem wir zurückspringen können) oder über einen direkten Link.
  const openedByClick = useState('project-modal-opened-by-click', () => false);

  // Wird das Fenster anders geschlossen (z. B. Zurück-Taste des Browsers), Merker zurücksetzen
  watch(() => route.query.project, (slug) => {
    if (!slug) openedByClick.value = false;
  });

  const currentProject = computed(() => {
    const slug = route.query.project;
    return typeof slug === 'string' ? projects.find(p => p.slug === slug) ?? null : null;
  });

  function open(slug: string) {
    openedByClick.value = true;
    router.push({ query: { ...route.query, project: slug } });
  }

  function close() {
    if (openedByClick.value) {
      openedByClick.value = false;
      router.back();
    } else {
      const { project: _, ...rest } = route.query;
      router.replace({ query: rest });
    }
  }

  return { currentProject, open, close };
}
