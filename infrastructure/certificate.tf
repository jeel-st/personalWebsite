# HTTPS zwischen Cloudflare und dem Server über ein Cloudflare-Origin-Zertifikat.
#
# Warum nicht Let's Encrypt? Bei jedem Neuaufbau des Servers müsste ein neues Zertifikat ausgestellt
# werden, und Let's Encrypt begrenzt, wie oft das für dieselbe Domain geht. Das Origin-Zertifikat wird
# dagegen einmal erzeugt, ist 15 Jahre gültig und wird bei jedem Neuaufbau einfach wieder verwendet.
# Für Besucher stellt Cloudflare selbst ein öffentlich vertrauenswürdiges Zertifikat aus.
#
# Achtung: Der private Schlüssel steht im Terraform-State. Deshalb darf der State nie ins Git-Repo.

resource "tls_private_key" "origin" {
  algorithm   = "ECDSA"
  ecdsa_curve = "P256"
}

resource "tls_cert_request" "origin" {
  private_key_pem = tls_private_key.origin.private_key_pem

  subject {
    common_name = var.domain
  }

  dns_names = [var.domain, "*.${var.domain}"]
}

resource "cloudflare_origin_ca_certificate" "origin" {
  csr                = tls_cert_request.origin.cert_request_pem
  hostnames          = [var.domain, "*.${var.domain}"]
  request_type       = "origin-ecc"
  requested_validity = 5475 # 15 Jahre
}
