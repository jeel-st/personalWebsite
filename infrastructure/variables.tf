# --- Zugangsdaten (kommen aus terraform.tfvars, die nie ins Git-Repo darf) ---

variable "hcloud_token" {
  description = "Hetzner Cloud API-Token (Lesen & Schreiben)"
  type        = string
  sensitive   = true
}

variable "cloudflare_api_token" {
  description = "Cloudflare API-Token mit den Rechten Zone: DNS, SSL und Zertifikate, Zoneneinstellungen (jeweils Bearbeiten)"
  type        = string
  sensitive   = true
}

# --- Server an/aus ---

variable "server_enabled" {
  description = "true = Server und DNS-Einträge existieren, false = Server ist abgebaut (Zertifikat, Firewall usw. bleiben bestehen)"
  type        = bool
  default     = true
}

# --- Domain ---

variable "domain" {
  description = "Hauptdomain der Website, www. wird automatisch mit eingerichtet"
  type        = string
  default     = "joel-starkov.com"
}

# --- Server ---

variable "location" {
  description = "Hetzner-Standort: nbg1 (Nürnberg) oder fsn1 (Falkenstein)"
  type        = string
  default     = "nbg1"
}

variable "server_type" {
  description = "Hetzner-Servertyp (cx23: 2 vCPU, 4 GB RAM). Verfügbare Typen: https://www.hetzner.com/cloud"
  type        = string
  default     = "cx23"
}

variable "image" {
  description = "Betriebssystem des Servers"
  type        = string
  default     = "ubuntu-24.04"
}

variable "ssh_public_key_path" {
  description = "Pfad zu deinem öffentlichen SSH-Schlüssel"
  type        = string
  default     = "~/.ssh/id_ed25519.pub"
}

variable "ssh_allowed_ips" {
  description = "IP-Bereiche, die sich per SSH verbinden dürfen. Am sichersten: nur deine eigene IP, z. B. [\"1.2.3.4/32\"]"
  type        = list(string)
  default     = ["0.0.0.0/0", "::/0"]
}

# --- Code der Website ---

variable "repo_url" {
  description = "Git-Repository, aus dem der Server die Website holt"
  type        = string
  default     = "https://github.com/jeel-st/personalWebsite.git"
}

variable "repo_branch" {
  description = "Branch, der auf dem Server läuft"
  type        = string
  default     = "main"
}

variable "app_dir" {
  description = "Unterordner im Repository, in dem das Nuxt-Projekt liegt"
  type        = string
  default     = "portfolio"
}
