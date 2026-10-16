---
title: Sipster
image: /sipster/cover.png
tags: [Node.js, Express, MongoDB, React Native, Jest, GitLab CI]
summary: Eine Community-App rund um Trinkspiele, mit Spielen, Freunden, Fotos und Events.
year: 2024
order: 7
github: https://github.com/jeel-st/Sipster
---

**Sipster** ist eine Smartphone-App für Spieleabende. Im Kern bietet sie eine Sammlung von Trinkspielen wie *Wahrheit oder Pflicht*, *Bombparty* oder *Beerpong Extreme*, sie ist aber mehr als nur ein Spielekatalog: Nutzer können Freunde hinzufügen, Fotos von ihren Abenden teilen, auf die Beiträge anderer reagieren und sehen, an welchen Events ihre Freunde teilnehmen. Mit gesammelten **Sips** steigt man außerdem im Level auf.

Entstanden ist Sipster als Teamprojekt von fünf Studierenden an der Hochschule der Medien Stuttgart und liegt als lauffähige Alpha-Version vor.

## Architektur

- **App:** React Native mit Expo, sodass sie auf iOS und Android läuft
- **Backend:** eine REST-API mit Node.js und Express, betrieben auf einem eigenen Server
- **Datenbank:** MongoDB, dazu ein eigenes Dateisystem für hochgeladene Bilder
- **Aufbau:** ein Schichtenmodell, kombiniert mit einer Microkernel-Struktur, damit sich neue Spiele als eigenständige Module ergänzen lassen, ohne den Kern der App anzufassen

## Meine Rolle

Ich habe hauptsächlich das Backend entwickelt:

- **Backend-Architektur:** der Aufbau aus Routes, Controllern und Datenbankschicht, der auch zum Projektende hin übersichtlich geblieben ist
- **Registrierung & Login:** das Grundgerüst sowie Regeln für sichere Passwörter
- **Freundschaftssystem:** das Grundgerüst für Freundschaftsanfragen und -listen, später die Umstellung auf eindeutige Nutzer-IDs
- **Bild-Uploads:** Profilbilder und Fotos von Spieleabenden werden hochgeladen und mit Sharp automatisch in mehrere komprimierte Größen umgewandelt, damit die App schnell lädt. An diesem Teil haben Lars Gerigk und ich bis spät in die Nacht gesessen.
- **Sips, Events & Profil:** die APIs für das Punktesystem, für Events und zum Ändern der eigenen Profildaten
- **Server & Datenbank:** das Aufsetzen des Servers und der MongoDB
- **Qualität:** Backend-Tests mit Jest, eine CI/CD-Pipeline in GitLab, Error-Handling und die Dokumentation der REST-API

::: gallery
![Die Backend-Architektur als UML-Diagramm](/sipster/architecture.jpg)
![Jest-Tests für die Sips-API](/sipster/tests.png)
:::

## Was ich gelernt habe

Sipster war mein erstes größeres Projekt mit einem eigenen Server und einer echten Datenbank. Besonders viel gelernt habe ich über das Zusammenspiel von Frontend und Backend, über MongoDB und darüber, wie wichtig eine durchdachte Softwarearchitektur und sauberes Error-Handling sind. Und vor allem darüber, wie viel gute Kommunikation in einem Team mit fünf Leuten ausmacht.

## Team

Joel Starkov, [Lars Gerigk](https://github.com/byGamsa), Lorenz Bauscher, Julia Ebert und Maike König.

## Tech-Stack

- **Backend:** Node.js, Express, MongoDB, Multer, Sharp, bcrypt
- **App:** React Native, Expo, Tailwind CSS
- **Qualität & Deployment:** Jest, GitLab CI/CD
