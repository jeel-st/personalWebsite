---
title: Stream Scheduler
image: /stream-scheduler/cover.png
tags: [TypeScript, Node.js, Express, PostgreSQL, MongoDB, Keycloak, Docker, Kubernetes]
summary: Eine Microservice-Plattform rund um Twitch-Streams für Zuschauer und Creator.
year: 2025–2026
order: 2
---

Der **Stream Scheduler** (intern *Dendree*) ist eine Webplattform rund um Twitch-Streams, die sich an zwei Zielgruppen richtet:

- **Zuschauer** sehen, wann ihre Lieblings-Streamer live gehen, bekommen persönliche Empfehlungen und können Creatorn folgen.
- **Creator** planen ihre Streams, Gäste und Events an einem Ort und teilen sie mit ihrer Community.

## Architektur

Die Plattform ist als **Microservice-Architektur** aufgebaut: mehrere unabhängige Dienste, die sich einzeln entwickeln, deployen und skalieren lassen.

- **Frontend:** eine öffentliche Landingpage und die eigentliche Plattform, beide mit Next.js und React
- **User-Service:** Nutzerverwaltung, Authentifizierung, Profile und soziale Funktionen
- **Scheduling-Service:** Streams, Events und Kalenderlogik
- **Datenhaltung:** PostgreSQL, MongoDB und Redis
- **Login:** Keycloak als zentraler Identity-Provider, inklusive Anmeldung über Twitch
- **Infrastruktur:** Docker-Container, Kubernetes mit automatischer Skalierung, Terraform und CI/CD-Pipelines

## Meine Rolle

Ich habe im Backend gearbeitet und dort große Teile beider Services entwickelt, vom ersten Datenbank-Deployment bis zu den Tests für das erste stabile Release:

- **Authentifizierung:** zuerst ein eigenes Login mit JWT-Access- und Refresh-Tokens, später der Umstieg auf **Keycloak** mit Registrierung, Login, Sessions über Cookies und Proxy-APIs für die Anmeldung über Keycloak und Twitch
- **Soziale Funktionen:** ein komplettes Freundschaftssystem (Anfragen senden, annehmen, ablehnen und zurückziehen, Freunde verwalten), Folgen und Entfolgen von Creatorn mit Follower-Zahlen sowie eine Creator-Suche
- **Creator-Profile:** APIs für Bio, Social-Media-Links und Profildaten sowie für das Ändern von Nutzerdaten und Benutzernamen
- **Scheduling-Service:** von Grund auf aufgesetzt, mit APIs zum Erstellen, Bearbeiten und Löschen von Streams und Events (inklusive Gast-Creatorn) und zum Abrufen aktueller Streams
- **Empfehlungen:** Vorschläge für passende Creator und Streams
- **Sicherheit:** Eingabevalidierung mit Zod und Security-Middleware
- **Datenbanken & Deployment:** Deployments von PostgreSQL und MongoDB in Kubernetes, die Trennung von Keycloak- und Anwendungsdatenbank sowie ein DevSpace-Setup für die Entwicklung im Cluster
- **Tests:** Unit-, Integrations- und End-to-End-Tests für beide Services mit Vitest und Supertest

## Tech-Stack

- **Backend:** Node.js, Express, TypeScript, tsoa (OpenAPI/Swagger), Zod
- **Datenbanken:** PostgreSQL, MongoDB, Redis
- **Auth:** Keycloak, JWT, Twitch-Login
- **Infrastruktur:** Docker, Kubernetes, Terraform, GitHub Actions
- **Frontend:** Next.js, React, Tailwind CSS

## Team

Entwickelt zusammen mit [Lars Gerigk](https://github.com/byGamsa). Der Quellcode ist privat.

<!--
  Tipp (unsichtbar auf der Website): Screenshots aus der Plattform machen das Projekt deutlich greifbarer,
  z. B. Kalender, Creator-Profil oder Event-Planung. Bilder nach public/stream-scheduler/ legen und als
  Galerie einbinden:

  ::: gallery
  ![Kalender](/stream-scheduler/kalender.png)
  ![Creator-Profil](/stream-scheduler/profil.png)
  :::
-->
