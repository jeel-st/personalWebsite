output "website" {
  description = "Adresse der Website"
  value       = var.server_enabled ? "https://${var.domain}" : "Server ist abgebaut (server_enabled = false)"
}

output "server_ipv4" {
  description = "Öffentliche IPv4 des Servers (für SSH, die Website läuft über Cloudflare)"
  value       = var.server_enabled ? hcloud_server.web[0].ipv4_address : null
}

output "ssh" {
  description = "SSH-Befehl für den Server"
  value       = var.server_enabled ? "ssh root@${hcloud_server.web[0].ipv4_address}" : null
}
