# Agrabudi Digipos Multi-Account Portal

Portal web Next.js untuk multi-account Digipos. Implementasi fase ini **MOCK MODE only**; tidak ada koneksi browser ke Windows Server dan live transaction dinonaktifkan.

## Jalankan

```bash
pnpm install
pnpm dev
pnpm typecheck
pnpm test
pnpm build
```

Dashboard tersedia di `http://localhost:3000`. Health check: `GET /api/health`, katalog: `GET /api/transactions/catalog`.

## Verifikasi production

```bash
pnpm install --frozen-lockfile
pnpm verify
pnpm start
```

Untuk deployment container:

```bash
cp .env.example .env
# Ganti AUTH_SECRET dengan secret acak di server; tetap pertahankan MOCK MODE.
docker compose up -d --build
docker compose ps
curl http://127.0.0.1:3000/api/health
```

## Batasan fase ini

Persistence PostgreSQL, Redis/BullMQ, Auth.js, upload parser, SSE, dan Windows Agent adalah boundary yang disiapkan untuk fase berikutnya. Jangan mengaktifkan live mode tanpa audit endpoint dan approval eksplisit.

Lihat `docs/` untuk arsitektur, keamanan, bulk, deployment, dan rollback.
