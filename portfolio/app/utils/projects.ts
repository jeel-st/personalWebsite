export interface Project {
  id: number;
  slug: string;
  title: string;
  tag: string;
  image: string;
}

// Platzhalter-Projekte mit den vorhandenen Beispielbildern aus /public.
// Bilder/Titel später einfach durch echte Projekte ersetzen.
export const projects: Project[] = [
  { id: 1, slug: 'projekt-1', title: 'Projekt Eins', tag: 'PROJEKT 1', image: '/bild1.jpg' },
  { id: 2, slug: 'projekt-2', title: 'Projekt Zwei', tag: 'PROJEKT 2', image: '/bild2.png' },
  { id: 3, slug: 'projekt-3', title: 'Projekt Drei', tag: 'PROJEKT 3', image: '/bild3.jpg' },
  { id: 4, slug: 'projekt-4', title: 'Projekt Vier', tag: 'PROJEKT 4', image: '/bild4.png' },
];
