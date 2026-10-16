data "cloudflare_zone" "main" {
  filter = {
    name = var.domain
  }
}

# Aktuelle IP-Bereiche von Cloudflare, damit die Firewall nur Anfragen über Cloudflare zum Webserver lässt
data "cloudflare_ip_ranges" "cloudflare" {}

# --- DNS: beide Adressen zeigen über den Cloudflare-Proxy auf den Server ---
# proxied = true: Besucher sehen nur Cloudflare (HTTPS, Schutz vor Angriffen, echte Server-IP bleibt verborgen).
# ttl = 1 bedeutet "automatisch", bei proxied-Einträgen ist das von Cloudflare so vorgegeben.

resource "cloudflare_dns_record" "root_ipv4" {
  count   = var.server_enabled ? 1 : 0
  zone_id = data.cloudflare_zone.main.zone_id
  name    = var.domain
  type    = "A"
  content = hcloud_server.web[0].ipv4_address
  proxied = true
  ttl     = 1
  comment = "Portfolio-Server, verwaltet mit Terraform"
}

resource "cloudflare_dns_record" "root_ipv6" {
  count   = var.server_enabled ? 1 : 0
  zone_id = data.cloudflare_zone.main.zone_id
  name    = var.domain
  type    = "AAAA"
  content = hcloud_server.web[0].ipv6_address
  proxied = true
  ttl     = 1
  comment = "Portfolio-Server, verwaltet mit Terraform"
}

resource "cloudflare_dns_record" "www" {
  count   = var.server_enabled ? 1 : 0
  zone_id = data.cloudflare_zone.main.zone_id
  name    = "www.${var.domain}"
  type    = "CNAME"
  content = var.domain
  proxied = true
  ttl     = 1
  comment = "Portfolio-Server, verwaltet mit Terraform"
}

# --- SSL-Einstellungen der Zone ---

# "Full (strict)": Cloudflare verbindet sich verschlüsselt mit dem Server und prüft dessen Zertifikat
resource "cloudflare_zone_setting" "ssl" {
  zone_id    = data.cloudflare_zone.main.zone_id
  setting_id = "ssl"
  value      = "strict"
}

# Aufrufe über http:// werden automatisch auf https:// umgeleitet
resource "cloudflare_zone_setting" "always_use_https" {
  zone_id    = data.cloudflare_zone.main.zone_id
  setting_id = "always_use_https"
  value      = "on"
}
