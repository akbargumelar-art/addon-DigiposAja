# API

`GET /api/health` mengembalikan status aplikasi, mode, agent, dan request ID.

`GET /api/transactions/catalog` mengembalikan transaction registry server-side.

Endpoint transaksi berikutnya wajib menerapkan auth, RBAC, Zod validation, account access check, idempotency, audit, dan mock adapter guard sebelum implementasi execute/upload/batch.
