---
title: Portfolio Website
image: /portfolio/cover.jpg
tags: [Nuxt, Vue, TypeScript, Tailwind CSS, Canvas]
summary: Meine persönliche Website mit eigenem Mini-Game, Farb-Themes und Projekt-Showcase.
year: 2026
order: 3
github: https://github.com/jeel-st/personalWebsite
---

Die Website, auf der du dich gerade befindest. Direkt unter meinem Namen wartet ein kleines Spiel, die Seite lässt sich in vier Farbstimmungen umschalten, und jedes Projekt öffnet sich in einem eigenen Fenster. Zudem hat man eine gute Übersicht über meine bisherigen Leistungen, Projekte und meinen Lebenslauf.

## Das Mini-Game

Ein Stick-Hero-Klon, komplett selbst auf einem HTML-Canvas gezeichnet, ganz ohne Grafikdateien oder Game-Engine. Gedrückt halten lässt die Brücke wachsen, loslassen lässt sie kippen. Trifft sie die Plattform, läuft der kleine Ninja hinüber.

- **Steigende Schwierigkeit:** Die Brücke wächst mit jedem Punkt schneller, bis zu einer festen Obergrenze, damit es fordernd bleibt, aber nie unschaffbar wird.
- **Perfect Hit:** Landet die Brücke genau auf der roten Markierung in der Plattformmitte, gibt es doppelte Punkte.
- **Parallax-Hintergrund:** Hügelketten, die sich unterschiedlich schnell bewegen, dazu Wolken, Sterne oder ein Sonnenuntergang, je nach Farbschema.
- **Kleine Effekte:** Laufanimation, Staubpartikel, Stauchen bei der Landung und Screen-Shake beim Absturz.

::: gallery
![Das Spiel im Sunset-Theme](/portfolio/game-sunset.jpg)
![Das Spiel im Ocean-Theme](/portfolio/game-ocean.jpg)
:::

## Weitere Features

- **Vier Farb-Themes:** Forest, Sunset, Ocean und Slate. Jedes Theme bringt eigene Hintergrund-, Text- und Akzentfarben mit, umgesetzt über CSS-Variablen. Die Wahl wird gespeichert und schon beim ersten Laden ohne Flackern angewendet.
- **Projekt-Karussell und Projekt-Fenster:** Projekte lassen sich durchblättern (per Klick, Pfeiltasten oder Wischen) und öffnen sich in einem Fenster. Jedes Projekt hat eine eigene URL und lässt sich so direkt verlinken.
- **Inhalte als Markdown:** Jedes Projekt ist eine eigene Markdown-Datei mit Text, Bildern, Galerien und Videos. Ein selbst geschriebenes Vite-Plugin wandelt sie beim Bauen in HTML um, sodass der Browser keine zusätzliche Bibliothek laden muss.
- **Eigener Mauszeiger:** Auf dem Desktop zeigt ein animierter Cursor an, was ein Klick bewirkt, etwa „Open“, „Next →“ oder „Zoom“.
- **Mobile First:** Vollbild-Menü mit Animation, wischbare Galerien und große Touch-Flächen.

::: gallery
![Projekt-Karussell auf der Startseite](/portfolio/carousel.jpg)
![Projekt-Fenster](/portfolio/project-window.jpg)
![Menü auf dem Handy](/portfolio/mobile-menu.jpg)
:::

## Technische Herausforderungen

- **Gleiches Spieltempo auf jedem Bildschirm:** Anfangs lief das Spiel auf einem 144-Hz-Monitor mehr als doppelt so schnell wie auf einem mit 60 Hz, weil sich alles pro Frame bewegt hat. Die Lösung war, alle Bewegungen auf Zeit statt auf Frames umzustellen.
- **Gestochen scharf auf jedem Display:** Das Spiel rechnet intern in einer festen Auflösung, rendert aber in der echten Pixeldichte des Geräts, damit es auf Handys und Retina-Displays nicht unscharf wirkt.
- **Kein ungewollter Zoom auf dem Handy:** Die seitlich herausragenden Karten des Karussells haben die Seite breiter als den Bildschirm gemacht, wodurch mobile Browser beim Drehen des Geräts hinein- und herauszoomten. Gefunden habe ich das mit automatisierten Browser-Tests auf emulierten Geräten.

## Tech-Stack

- **Framework:** Nuxt 4 mit Server-Side Rendering, Vue 3, TypeScript
- **Styling:** Tailwind CSS mit eigenen Theme-Varianten
- **Spiel:** Canvas 2D API
- **Inhalte:** Markdown mit markdown-it, eigenes Vite-Plugin
