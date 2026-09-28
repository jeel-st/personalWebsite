export interface Project {
  id: number;
  /** Eindeutiger Kurzname für die URL, z. B. /projects?project=portfolio */
  slug: string;
  title: string;
  /** Bild in /public, z. B. '/projects/portfolio.jpg' */
  image: string;
  /** Technologien/Stichworte, erscheinen als kleine Chips */
  tags: string[];
  /** Ein Satz, steht im Fenster direkt unter dem Titel */
  summary: string;
  /** Ausführliche Beschreibung. Absätze durch eine Leerzeile trennen. */
  description: string;
  year?: string;
  /** Optionale Links, der Button erscheint nur, wenn ein Link eingetragen ist */
  github?: string;
  demo?: string;
}

// So fügst du ein neues Projekt hinzu:
// 1. Bild nach /public legen (z. B. /public/projects/mein-projekt.jpg)
// 2. Einen der Einträge unten kopieren, eine neue id und einen neuen slug vergeben, Felder ausfüllen
// Die Reihenfolge hier ist auch die Reihenfolge im Karussell und auf /projects.

export const projects: Project[] = [
  {
    id: 1,
    slug: 'projekt-1',
    title: 'Gaia Protocol',
    image: '/bild1.jpg',
    tags: ['Gaming', 'VR', 'Unity', 'C#'],
    summary: 'Ein kooperatives 2-Spieler-VR-Überlebenserlebnis.',
    description: `In diesem kooperativen 2-Spieler-VR-Erlebnis steuert ihr zwei Drifter-Einheiten und werdet gemeinsam in verlassene Raketensilos entsandt. Eure Missionen:

- Kristalle für den Hyperantrieb der Raumstation sichern

- Eingeschlossene Überlebende retten

- Alte Systeme aktivieren und verbliebene Raketen starten

- Nebenaufgaben für taktische Vorteile erfüllen

Feindliche, KI-gesteuerte Roboter patrouillieren die Anlagen und reagieren auf jede Bewegung – jeder Einsatz erfordert Präzision, Planung und vor allem Zusammenarbeit. Denn wie beim Drift entscheidet euer Zusammenspiel über Leben und Tod: Ein perfektes Team macht den Unterschied zwischen Auslöschung und Hoffnung.


`,
    year: '2026',
  },
  {
    id: 2,
    slug: 'projekt-2',
    title: 'Projekt Zwei',
    image: '/bild2.png',
    tags: ['Tag A'],
    summary: 'Short one-line summary of the project.',
    description: `Placeholder: describe what the project is and why you built it.`,
  },
  {
    id: 3,
    slug: 'projekt-3',
    title: 'Projekt Drei',
    image: '/bild3.jpg',
    tags: ['Tag B', 'Tag C'],
    summary: 'Short one-line summary of the project.',
    description: `Placeholder: describe what the project is and why you built it.`,
  },
  {
    id: 4,
    slug: 'projekt-4',
    title: 'Projekt Vier',
    image: '/bild4.png',
    tags: ['Tag C'],
    summary: 'Short one-line summary of the project.',
    description: `Placeholder: describe what the project is and why you built it.`,
  },
];
