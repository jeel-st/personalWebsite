---
# VORLAGE: Dateien, deren Name mit "_" beginnt, erscheinen NICHT auf der Website.
# Für ein neues Projekt diese Datei kopieren und umbenennen, z. B. in "mein-projekt.md".
# Der Dateiname (ohne .md) wird zur Adresse: /projects?project=mein-projekt

title: Mein Projekt                    # Pflicht
image: /projects/mein-projekt/cover.jpg # Pflicht: Titelbild für Karussell, Grid und Fenster
summary: Ein Satz, worum es geht.      # Pflicht: steht unter dem Titel
tags: [Vue, TypeScript]                # optional
year: 2026                             # optional
order: 5                               # optional: Reihenfolge (kleinere Zahl = weiter vorne)
github: https://github.com/...         # optional: zeigt einen GitHub-Button
demo: https://...                      # optional: zeigt einen Live-Demo-Button
---

Ab hier schreibst du frei in **Markdown**. Ein Absatz endet mit einer Leerzeile.

## Zwischenüberschrift

Text kann **fett**, *kursiv* oder `Code` sein. Links schreibst du so: [Link-Text](https://example.com).
Externe Links öffnen sich automatisch in einem neuen Tab.

- Aufzählungspunkt
- Noch einer

1. Nummerierte Liste
2. Zweiter Schritt

### Bilder

Bilder legst du nach `public/projects/mein-projekt/` und bindest sie so ein (der Text in eckigen Klammern beschreibt das Bild):

![Beschreibung des Bildes](/projects/mein-projekt/screenshot.jpg)

Jedes Bild lässt sich per Klick in einer Vollbild-Ansicht vergrößern.

### Bildergalerie

Mehrere Fotos platzsparend als Raster aus kleinen Vorschaubildern. Per Klick öffnen sie sich groß
und lassen sich durchblättern (Pfeile, Pfeiltasten oder Wischen):

::: gallery
![Erstes Foto](/projects/mein-projekt/foto-1.jpg)
![Zweites Foto](/projects/mein-projekt/foto-2.jpg)
![Drittes Foto](/projects/mein-projekt/foto-3.jpg)
:::

> Ein Zitat oder ein hervorgehobener Hinweis.

### Eigenes HTML

Wo Markdown nicht reicht, kannst du direkt HTML schreiben, z. B. ein Video:

<video src="/projects/mein-projekt/clip.mp4" controls muted playsinline></video>

oder ein YouTube-Video:

<iframe src="https://www.youtube-nocookie.com/embed/VIDEO_ID" title="Trailer" allowfullscreen></iframe>
