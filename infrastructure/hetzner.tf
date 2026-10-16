# Prüft schon bei "terraform plan", ob es den Servertyp gibt (statt erst mitten im "apply" zu scheitern)
data "hcloud_server_type" "selected" {
  name = var.server_type
}

resource "hcloud_ssh_key" "default" {
  name       = "portfolio-key"
  public_key = file(pathexpand(var.ssh_public_key_path))
}

resource "hcloud_firewall" "web" {
  name = "portfolio-firewall"

  # Webserver nur über Cloudflare erreichbar, direkte Zugriffe auf die Server-IP werden blockiert
  rule {
    description = "HTTP nur von Cloudflare"
    direction   = "in"
    protocol    = "tcp"
    port        = "80"
    source_ips  = concat(data.cloudflare_ip_ranges.cloudflare.ipv4_cidrs, data.cloudflare_ip_ranges.cloudflare.ipv6_cidrs)
  }

  rule {
    description = "HTTPS nur von Cloudflare"
    direction   = "in"
    protocol    = "tcp"
    port        = "443"
    source_ips  = concat(data.cloudflare_ip_ranges.cloudflare.ipv4_cidrs, data.cloudflare_ip_ranges.cloudflare.ipv6_cidrs)
  }

  rule {
    description = "SSH"
    direction   = "in"
    protocol    = "tcp"
    port        = "22"
    source_ips  = var.ssh_allowed_ips
  }

  rule {
    description = "Ping"
    direction   = "in"
    protocol    = "icmp"
    source_ips  = ["0.0.0.0/0", "::/0"]
  }
}

resource "hcloud_server" "web" {
  count        = var.server_enabled ? 1 : 0
  name         = "portfolio"
  server_type  = data.hcloud_server_type.selected.name
  image        = var.image
  location     = var.location
  ssh_keys     = [hcloud_ssh_key.default.id]
  firewall_ids = [hcloud_firewall.web.id]

  public_net {
    ipv4_enabled = true
    ipv6_enabled = true
  }

  # Richtet den Server beim ersten Start komplett ein (siehe cloud-init.yaml.tftpl)
  user_data = templatefile("${path.module}/cloud-init.yaml.tftpl", {
    domain             = var.domain
    repo_url           = var.repo_url
    repo_branch        = var.repo_branch
    app_dir            = var.app_dir
    origin_certificate = cloudflare_origin_ca_certificate.origin.certificate
    origin_private_key = tls_private_key.origin.private_key_pem
  })

  labels = {
    project = "portfolio"
  }
}
