---
title: Image Classifier für Müllklassifizierung
image: /slt-ai/confusion-matrix.png
tags: [Python, PyTorch, Computer Vision, Transfer Learning, Weights & Biases]
summary: Ein Image Classifier, der Abfall auf Fotos erkennt und der richtigen Tonne zuordnet.
year: 2025–2026
order: 5
github: https://github.com/byGamsa/slt-ai
---

Viele Menschen trennen ihren Müll, und trotzdem landet erstaunlich viel davon in der falschen Tonne. Für das Modul **Ausgewählte Anwendungen der KI** an der Hochschule der Medien Stuttgart haben wir deshalb einen **Image Classifier** entwickelt, der auf einem Foto erkennt, um welche Art Abfall es sich handelt.

Die Kategorien orientieren sich an den Tonnen, die es an der Hochschule tatsächlich gibt:

- Verpackung
- Papier
- Restmüll
- Pfandflasche
- Fremdmüll / kein Müll

## Daten

Ein Modell ist nur so gut wie seine Daten. Wir haben deshalb mit zwei Quellen gearbeitet:

- **Externe Daten:** mehrere öffentliche Datensätze von Kaggle, die wir selbst sortiert und unseren Kategorien zugeordnet haben, rund 2.000 Bilder pro Kategorie
- **Eigene Daten:** Fotos, die wir über das Semester im Alltag an der Hochschule gesammelt haben, rund 225 Bilder pro Kategorie

Trainiert und verglichen haben wir auf den externen Daten, auf den eigenen Daten und auf der Kombination aus beidem.

## Modelle

Wir haben mehrere Ansätze systematisch verglichen, vom einfachen Netz bis zum vortrainierten Modell:

- Multi-Layer Perceptron als einfache Baseline
- Eigenes Convolutional Neural Network (CNN)
- VGG16, einmal von Grund auf trainiert, einmal vortrainiert und einmal per Finetuning angepasst
- ResNet50 mit Finetuning

Für MLP und CNN haben wir zusätzlich eine Hyperparameter-Optimierung mit Weights & Biases durchgeführt.

## Ergebnisse

Das klare Ergebnis: Transfer Learning schlägt eigene Modelle deutlich. Das per Finetuning angepasste VGG16 erreichte rund 82 % Validierungsgenauigkeit, ResNet50 rund 81 %. Unser eigenes CNN kam auf rund 66 %, das MLP auf rund 50 %.

Am zuverlässigsten werden Pfandflaschen erkannt. Am häufigsten verwechselt werden Restmüll und Fremdmüll sowie Verpackung und Papier, also genau die Kategorien, die sich auch für Menschen optisch stark ähneln.

::: gallery
![Confusion Matrix des besten Modells (VGG16 mit Finetuning): Was wird womit verwechselt?](/slt-ai/confusion-matrix.png)
![Trainings- und Validierungsgenauigkeit über die Epochen (VGG16 mit Finetuning)](/slt-ai/training-curve.png)
![Klassenverteilung im kombinierten Datensatz](/slt-ai/class-distribution.png)
:::

## Meine Rolle

Wir waren ein Team aus drei Personen: [Lars Gerigk](https://github.com/byGamsa), Julia Ebert und ich. Meine Schwerpunkte:

- **Datenaufbereitung:** die Pipeline zum Laden und Vorverarbeiten der Bilder, so aufgebaut, dass sie mit jedem unserer Datensätze funktioniert
- **Eigener Datensatz:** Aufbereiten und Komprimieren unserer selbst aufgenommenen Fotos sowie der kombinierte Datensatz aus externen und eigenen Bildern
- **Modelle:** die ersten Schritte mit dem CNN, die VGG16-Varianten (von Grund auf, vortrainiert, Finetuning) und ResNet50 als zweites Transfer-Learning-Modell
- **Auswertung:** die Confusion Matrix zur Analyse der Fehlklassifikationen sowie die Dokumentation der Modelle

## Tech-Stack

- **Deep Learning:** PyTorch, torchvision
- **Auswertung:** scikit-learn, Matplotlib, Seaborn
- **Experiment-Tracking:** Weights & Biases
- **Umgebung:** Jupyter Notebook
