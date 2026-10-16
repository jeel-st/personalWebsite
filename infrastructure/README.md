# Infrastruktur für joel-starkov.com

Terraform baut einen Hetzner-Server, richtet DNS bei Cloudflare ein und liefert die Website per HTTPS aus.

```
Besucher --HTTPS--> Cloudflare --HTTPS (Origin-Zertifikat)--> Hetzner-Server: Caddy --> Nuxt (Node.js)
```

## Einmalig einrichten

1. **Hetzner:** Projekt anlegen → *Sicherheit* → *API-Tokens* → Token mit **Lesen & Schreiben** erstellen
2. **Cloudflare:** *Mein Profil* → *API-Tokens* → *Token erstellen* → *Benutzerdefiniertes Token* mit diesen Berechtigungen:
   - Zone → **DNS** → Bearbeiten
   - Zone → **SSL und Zertifikate** → Bearbeiten
   - Zonenressourcen: nur `joel-starkov.com`
3. `terraform.tfvars.example` kopieren, in `terraform.tfvars` umbenennen und beide Tokens eintragen
4. Einmal initialisieren:
   ```bash
   terraform init
   ```

## Benutzen

| Was | Befehl |
|---|---|
| Vorschau, was passieren würde | `terraform plan` |
| Server hochfahren | `terraform apply` |
| Server abbauen (Zertifikat & Co. bleiben) | `terraform apply -var server_enabled=false` |
| Alles komplett löschen | `terraform destroy` |
| Neue Code-Version auf den Server bringen | `ssh root@<IP> deploy-portfolio` |

Nach `terraform apply` braucht der Server noch **ca. 3–5 Minuten**, bis die Seite erreichbar ist
(Pakete installieren, Website bauen). Fortschritt ansehen:

```bash
ssh root@<IP> tail -f /var/log/cloud-init-output.log
```

Die IP und den fertigen SSH-Befehl zeigt `terraform output` an.

## Wichtig

- **`terraform.tfvars` und `*.tfstate` nie committen.** Der State enthält den privaten Schlüssel des Zertifikats.
  Beides ist per `.gitignore` ausgeschlossen.
- **Den State nicht verlieren.** Ohne ihn weiß Terraform nicht mehr, was es angelegt hat. Am besten gelegentlich sichern.
- Der Server holt den Code von **GitHub** (`main`). Lokale Änderungen müssen also gepusht sein, bevor sie auf dem Server landen.
- Hetzner berechnet auch ausgeschaltete Server. Zum Sparen den Server deshalb **abbauen**, nicht nur ausschalten.
