# Deployment VPS Ubuntu

## Prasyarat

- Ubuntu LTS dengan Docker Engine dan Compose plugin.
- Reverse proxy HTTPS (Nginx/Caddy) di depan container.
- Firewall hanya membuka 80/443; port service Windows tidak boleh dipublikasikan.

## Deploy

```bash
git clone <repository-url> /opt/agrabudi-digipos
cd /opt/agrabudi-digipos
cp .env.example .env
openssl rand -base64 32
# Isi AUTH_SECRET memakai hasil secret di atas.
# Pastikan TRANSACTION_MODE=MOCK dan ALLOW_LIVE_TRANSACTIONS=false.
docker compose up -d --build
docker compose logs --tail=100 web
curl http://127.0.0.1:3000/api/health
```

Bind container hanya ke loopback seperti di `docker-compose.yml`; reverse proxy yang menangani TLS, security headers, dan domain publik. Buat backup `.env` melalui secret manager, bukan git.

## Update dan rollback

```bash
git fetch --all
git checkout <release-tag>
docker compose up -d --build
# rollback: checkout tag sebelumnya lalu perintah yang sama
```

Deployment production tetap MOCK sampai audit gateway, approval, dan uji transaksi resmi selesai.
