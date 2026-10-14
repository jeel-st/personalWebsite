import MarkdownIt from 'markdown-it';
import container from 'markdown-it-container';
import { parse as parseYaml } from 'yaml';
import type { Plugin } from 'vite';

// Wandelt die Projekt-Markdown-Dateien beim Bauen in fertiges HTML um. Dadurch braucht der
// Browser keine Markdown-Bibliothek, er bekommt nur das Ergebnis.
// html: true erlaubt eigenes HTML im Text (z. B. <video>). Das ist unbedenklich, weil die
// Dateien nur von dir selbst kommen, nicht von Besuchern.
const md = new MarkdownIt({ html: true, linkify: true, typographer: true });

// "::: gallery" ... ":::" wird zu <div class="gallery">, das Fenster zeigt den Inhalt als Bilder-Raster an
md.use(container, 'gallery');

const renderLinkOpen = md.renderer.rules.link_open
  ?? ((tokens, idx, options, _env, self) => self.renderToken(tokens, idx, options));
md.renderer.rules.link_open = (tokens, idx, options, env, self) => {
  // Externe Links in neuem Tab öffnen, damit man die Seite nicht verlässt
  const href = String(tokens[idx]!.attrGet('href') ?? '');
  if (/^https?:\/\//.test(href)) {
    tokens[idx]!.attrSet('target', '_blank');
    tokens[idx]!.attrSet('rel', 'noopener noreferrer');
  }
  return renderLinkOpen(tokens, idx, options, env, self);
};

const renderImage = md.renderer.rules.image!;
md.renderer.rules.image = (tokens, idx, options, env, self) => {
  // Bilder erst laden, wenn sie in den sichtbaren Bereich scrollen
  tokens[idx]!.attrSet('loading', 'lazy');
  // Jedes Bild lässt sich per Klick vergrößern, der Cursor zeigt das an
  tokens[idx]!.attrSet('data-cursor-label', 'Zoom');
  return renderImage(tokens, idx, options, env, self);
};

// Dateiname ohne Ordner, z. B. ".../content/projects/gaia-protocol.md" -> "gaia-protocol.md"
const baseName = (file: string) => file.split(/[\\/]/).pop()!;

const FRONTMATTER = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/;
const REQUIRED_FIELDS = ['title', 'image', 'summary'];

export function projectMarkdown(): Plugin {
  return {
    name: 'project-markdown',
    enforce: 'pre',
    transform(code, id) {
      const file = id.split('?')[0]!;
      if (!file.endsWith('.md')) return null;

      const name = baseName(file);
      const match = code.match(FRONTMATTER);
      if (!match) {
        this.error(`${name}: Am Dateianfang fehlt der Eckdaten-Block zwischen zwei "---"-Zeilen.`);
      }

      const meta = (parseYaml(match[1]!) ?? {}) as Record<string, unknown>;
      for (const field of REQUIRED_FIELDS) {
        if (!meta[field]) this.error(`${name}: Das Feld "${field}" fehlt in den Eckdaten.`);
      }

      const project = {
        ...meta,
        // Dateiname ohne .md wird zum Kurznamen in der URL (?project=...)
        slug: name.replace(/\.md$/, ''),
        tags: Array.isArray(meta.tags) ? meta.tags.map(String) : [],
        year: meta.year != null ? String(meta.year) : undefined,
        html: md.render(match[2]!),
      };

      return { code: `export default ${JSON.stringify(project)};`, map: null };
    },
  };
}
