// Die Projekte stehen als Markdown-Dateien in app/content/projects (eine Datei pro Projekt).
// Wie man ein neues anlegt, steht in app/content/projects/_vorlage.md.
// Das Umwandeln in HTML passiert beim Bauen, siehe /build/projectMarkdown.ts.

export interface Project {
  /** Dateiname ohne .md, wird für die URL benutzt (/projects?project=slug) */
  slug: string;
  title: string;
  image: string;
  tags: string[];
  summary: string;
  year?: string;
  order?: number;
  github?: string;
  demo?: string;
  /** Fertig gerenderter Text aus dem Markdown-Teil der Datei */
  html: string;
}

const files = import.meta.glob<Project>(
  ['../content/projects/*.md', '!../content/projects/_*.md'],
  { eager: true, import: 'default' },
);

export const projects: Project[] = Object.values(files).sort(
  (a, b) => (a.order ?? Infinity) - (b.order ?? Infinity) || a.title.localeCompare(b.title),
);
