# Keamanan

- MOCK MODE dan `ALLOW_LIVE_TRANSACTIONS=false` adalah default.
- Credential tidak diletakkan di frontend, URL, log, atau source.
- Backend wajib memvalidasi account access, input Zod, idempotency key, request ID, rate limit, audit event, timeout, dan lock serial sebelum produksi.
- Response provider harus dinormalisasi dan disanitasi.
- Port service Windows 3000/300 tidak boleh dibuka ke internet.

Sebelum live: audit request/response nyata, autentikasi gateway, secret manager, cookie httpOnly/secure, RBAC granular, dan approval operasional.
