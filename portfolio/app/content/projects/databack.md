---
title: DataBack
image: /databack/docs-konzept.jpg
tags: [Java, PostgreSQL, JDBC, Picocli, Docker]
summary: Ein Kommandozeilen-Tool für inkrementelle Backups von PostgreSQL-Datenbanken.
year: 2024–2025
order: 6
github: https://github.com/Cryptocryxx/DatabaseApp
---

DataBack ist ein Terminal-Tool, mit dem man PostgreSQL-Datenbanken sichern und wiederherstellen kann. Es speichert nicht bei jedem Backup die komplette Datenbank, sondern nur die Änderungen seit dem letzten Backup. Das spart Speicherplatz, und trotzdem lässt sich jede frühere Version wiederherstellen.

Bedient wird es über zwei Befehle:

```
databack backup  --db-url <URL> --user <USER> --password <PASSWORT>
databack restore --db-url <URL> --user <USER> --password <PASSWORT> --version v3
```

## So funktionieren die inkrementellen Backups

Für jede Tabelle legt DataBack einen eigenen Ordner mit drei Arten von Dateien an:

- **Base-File:** der vollständige Stand der Tabelle beim allerersten Backup. Diese Datei wird danach nie wieder verändert.
- **Incremental-Files:** pro weiterem Backup eine Datei, die nur festhält, welche Einträge **hinzugekommen** und welche **gelöscht** wurden.
- **Current-File:** der aktuelle Stand, der sich aus dem Base-File und allen Änderungen zusammensetzt. Mit ihm wird beim nächsten Backup verglichen.

Damit sich Einträge über mehrere Backups hinweg zuverlässig wiedererkennen lassen, bekommt jedes Objekt einen eigenen eindeutigen Index. Eine zentrale Metadatei hält fest, welche Versionen es gibt und welche Datei zu welcher Tabelle gehört. Tabellenschemata und Constraints werden zusätzlich als SQL-Skripte pro Version gesichert, sodass beim Wiederherstellen auch die Struktur der Datenbank wieder entsteht.

## Meine Rolle

Wir haben DataBack zu dritt entwickelt, zusammen mit Lorenz Bauscher und [Lars Gerigk](https://github.com/byGamsa). Meine Schwerpunkte:

- **Inkrementelle Backups:** das Kernfeature des Tools, also die Logik, die neue Backups mit dem letzten Stand vergleicht und nur die Unterschiede speichert, inklusive des Index für jedes Objekt
- **Export der Datenbank:** die JDBC-Verbindung, das Erzeugen der `CREATE TABLE`-Skripte aus dem Datenbankschema und der Export der Daten als JSON
- **Struktur der Backups:** die Metadatei und die Ordnerstruktur mit einem eigenen Ordner pro Tabelle
- **Grundlagen:** die PostgreSQL-Testumgebung mit Docker, ein eigener Logger sowie Clean Code und Javadoc für die Backup-Logik

Die Dokumentation zu Konzept und Logik haben wir auf [GitBook](https://joels-organization-9.gitbook.io/databack) veröffentlicht.

::: gallery
![Startseite der Dokumentation](/databack/docs.jpg)
![Das Konzept hinter der Ordnerstruktur](/databack/docs-konzept.jpg)
:::

## Tech-Stack

- **Sprache:** Java mit Maven
- **Datenbank:** PostgreSQL über JDBC
- **Kommandozeile:** Picocli
- **Datenformat:** JSON mit Jackson
- **Entwicklungsumgebung:** PostgreSQL in Docker
