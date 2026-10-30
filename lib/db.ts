import { PrismaClient } from "@prisma/client";

declare global { var __digiposPrisma: PrismaClient | undefined; }

export const isDatabaseConfigured = Boolean(process.env.DATABASE_URL);
export function getDb() {
  if (!isDatabaseConfigured) throw new Error("DATABASE_NOT_CONFIGURED");
  return globalThis.__digiposPrisma ?? (globalThis.__digiposPrisma = new PrismaClient());
}
