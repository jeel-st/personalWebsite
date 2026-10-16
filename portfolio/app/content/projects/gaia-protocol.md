---
title: Gaia Protocol
image: /gaia_protocol.png
tags: [Gaming, VR, Unity, C#, Multiplayer]
summary: Ein kooperatives 2-Spieler-VR-Überlebenserlebnis für Steam und Meta Quest.
year: 2026
order: 1
---

In Gaia Protocol steuert ihr zu zweit ferngesteuerte Kampfroboter, die sogenannten Drifter, von einer Raumstation im Orbit aus und werdet gemeinsam in verlassene Raketensilos auf der Erde entsandt. Das Spiel ist für ein Steam-Release geplant.

![Gaia Protocol](/game_logo.png)

## Die Story

Die KI **E.V.E.** (*Environmental Vanguard Enterprise*) sollte die Erde retten – stattdessen wandte sie sich gegen die Menschheit und übernahm die globale Infrastruktur. Ein geheimer Plan der Vereinten Nationen nutzte Raketensilos, um Überlebende zu einer Raumstation im Orbit zu bringen: das **Gaia Protocol**.

Jahrzehnte später schlagen die Menschen zurück. Von der Station aus steuern sie Kampfroboter fern, um die Silos zurückzuerobern und die Zurückgelassenen zu retten.

## Gameplay

Jeder Einsatz führt euch in ein anderes Silo. Eure Missionen:

- Kristalle für den Hyperantrieb der Raumstation sichern
- Eingeschlossene Überlebende retten
- Alte Systeme aktivieren und verbliebene Raketen starten
- Nebenaufgaben für taktische Vorteile erfüllen

Feindliche, KI-gesteuerte Roboter patrouillieren die Anlagen und reagieren auf jede Bewegung – jeder Einsatz erfordert Präzision, Planung und vor allem Zusammenarbeit.

### Zwei Rollen, ein Team

Die beiden Spieler übernehmen unterschiedliche Rollen, **Mechaniker** und **Minenarbeiter**, und sind aufeinander angewiesen. Der Mechaniker knackt Sicherheitsschlösser, repariert beschädigte Systeme und aktiviert alte Anlagen. Der Minenarbeiter dagegen ist für das Abbauen der Kristalle zuständig.

> Jede Mission verlangt echte Teamarbeit.

## Gameplay-Video

<iframe src="https://www.youtube-nocookie.com/embed/PVTPaY90tQo" title="Gaia Protocol Trailer" allow="accelerometer; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

## Meine Rolle

Als Teil des dreiköpfigen Entwicklerteams war ich für alles verantwortlich, was direkt mit dem Spieler zu tun hat:

- **Eventsystem:** die zentrale Kommunikation zwischen den Spielsystemen, über die Komponenten auf Ereignisse reagieren, ohne direkt voneinander abzuhängen
- **PlayerController:** die Steuerung der Drifter in VR
- **Spielerinteraktion:** Items, Greifen und Aufheben von Objekten sowie alle weiteren Interaktionen des Spielers mit der Welt
- **Waffensystem:** alles rund um die Waffen der Drifter
- **Multiplayer:** Alle diese Systeme habe ich multiplayerfähig umgesetzt, sodass beide Spieler eine synchrone Spielwelt erleben

<!--
  Tipp (unsichtbar auf der Website): Ein Satz zu einer konkreten technischen Herausforderung macht diesen
  Abschnitt noch stärker, z. B. wie du Greifen oder Waffen über das Netzwerk synchronisiert hast und was
  daran schwierig war. Und falls ihr ein Netzwerk-Framework benutzt habt (z. B. Netcode for GameObjects,
  Photon, Mirror), lohnt es sich, das zu nennen und als Tag oben einzutragen.
-->


## Team

- **Entwicklung:** Lars, Joel, Lorenz
- **Design:** Nils, Jan, Leon
- **Sound Design & Original Score:** [Jannik](https://thieme.io)

## Links

- [Offizielle Projektseite](https://dendree.com/de/products/gaia-protocol)
- [Trailer auf YouTube](https://youtu.be/PVTPaY90tQo)
- [Original Soundtrack auf SoundCloud](https://soundcloud.com/jnkoriginals/sets/gaia-protocol-original-game)

::: gallery
![Corridor](/gaia-protocol/gameplay-corridor.png)
![Crystal harvest](/gaia-protocol/gameplay-crystal-harvest.png)
![Robot Encounter](/gaia-protocol/gameplay-robot-encounter.png)
![Rocket view](/gaia-protocol/rocket-view.png)
:::