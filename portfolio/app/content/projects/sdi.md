---
title: Software defined infrastructure
image: /sdi/cover.jpg
tags: [Terraform, Infrastructure as Code, Hetzner Cloud, Cloud-init, VitePress]
summary: Step-by-Step-Anleitungen für die Übungen der Vorlesung Software Defined Infrastructure.
year: 2025–2026
order: 4
github: https://github.com/byGamsa/sdi
demo: https://bygamsa.github.io/sdi/
---

Im Rahmen der Vorlesung **Software Defined Infrastructure** an der Hochschule der Medien Stuttgart haben wir die Übungen nicht nur gelöst, sondern für jede Aufgabe eine ausführliche Step-by-Step-Anleitung geschrieben und als Dokumentations-Website veröffentlicht.

Im Kern geht es um Infrastructure as Code: Server, Netzwerke, Firewalls, DNS-Einträge und Zertifikate werden nicht von Hand in einer Weboberfläche angelegt, sondern mit Terraform beschrieben und automatisch in der Hetzner Cloud erstellt. Jede Übung baut auf der vorherigen auf, vom einzelnen Server bis zu einem privaten Netzwerk mit Gateway.

## Was die Übungen abdecken

- **Server automatisch einrichten** mit Cloud-init, inklusive Webserver-Installation
- **SSH-Host-Keys** sicher verwalten, umgesetzt als wiederverwendbares Terraform-Modul
- **Speicher** über Volumes, Partitionen und Mount-Points
- **DNS-Einträge** automatisch zu jedem neuen Server anlegen
- **Web-Zertifikate** über das ACME-Protokoll ausstellen, testen und in die Server-Erstellung integrieren
- **Mehrere Server** in einem Durchlauf erzeugen
- **Private Netzwerke** mit Subnetz und einem Application-Level-Gateway, über das ein interner Server ohne eigene öffentliche IP ins Internet kommt

## Meine Rolle

Das Projekt habe ich gemeinsam mit [Lars Gerigk](https://github.com/byGamsa) umgesetzt. Ich habe die **Dokumentations-Website mit VitePress aufgesetzt** und einen großen Teil der Übungen selbst gelöst und dokumentiert:

- **SSH & Sicherheit:** das Lösen des *Known-Hosts*-Problems bei neu erstellten Servern und ein eigenes Terraform-Modul für den Umgang mit SSH-Host-Keys
- **Server & Speicher:** Mount-Points, ein erweiterter Webserver und das Erstellen einer festen Anzahl gleichartiger Server
- **DNS:** DNS-Einträge per Terraform sowie Server, die automatisch passende DNS-Einträge bekommen
- **Zertifikate:** Web-Zertifikate über ACME erstellen, testen und mit der Server-Erstellung kombinieren
- **Netzwerke:** ein privates Subnetz und ein Application-Level-Gateway mit HTTP-Proxy, über das der interne Host Pakete installiert

::: gallery
![Startseite der Dokumentation](/sdi/cover.jpg)
![Übung 29: Application-Level-Gateway](/sdi/exercise-gateway.jpg)
![Übung 25: Web-Zertifikat erstellen](/sdi/exercise-certificate.jpg)
:::

## Tech-Stack

- **Infrastructure as Code:** Terraform mit eigenen Modulen
- **Cloud:** Hetzner Cloud (Server, Firewalls, Netzwerke, Primary IPs)
- **Provisionierung:** Cloud-init
- **Zertifikate:** ACME
- **Dokumentation:** VitePress, automatisch veröffentlicht über GitHub Actions und GitHub Pages
