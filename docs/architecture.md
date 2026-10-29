# Arsitektur

Browser hanya mengakses portal Next.js. Adapter transaksi berada di server dan default menggunakan `MockDigiposAdapter`. `FutureWindowsAgentAdapter` selalu `NOT_CONFIGURED`; tidak ada forwarding langsung ke port 3000/300 Windows.

Alur target: Browser → Web Portal VPS → Gateway/Windows Agent → service localhost. PostgreSQL dan Redis/BullMQ menjadi persistence/queue produksi berikutnya.
