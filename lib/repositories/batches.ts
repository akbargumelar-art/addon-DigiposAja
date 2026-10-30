import { getDb, isDatabaseConfigured } from "@/lib/db";
import type { Batch } from "@/lib/bulk";

export async function createPersistentBatch(input: { accountId: string; createdById: string; transactionType: string; items: Batch["items"] }) {
  if (!isDatabaseConfigured) throw new Error("DATABASE_NOT_CONFIGURED");
  return getDb().batch.create({ data: { accountId: input.accountId, createdById: input.createdById, transactionType: input.transactionType, mode: "MOCK", status: "READY", items: { create: input.items.map(item => ({ id: item.id, rowNumber: item.rowNumber, serial: item.serial, normalizedSerial: item.normalizedSerial, status: item.status, attempts: item.attempts, errorMessage: item.error })) } }, include: { items: true } });
}
export async function findPersistentBatch(id: string) {
  if (!isDatabaseConfigured) return null;
  return getDb().batch.findUnique({ where: { id }, include: { items: { orderBy: { rowNumber: "asc" } } } });
}
export async function listPersistentBatches(accountIds: string[]) {
  if (!isDatabaseConfigured) return [];
  return getDb().batch.findMany({ where: { accountId: { in: accountIds } }, include: { items: true }, orderBy: { createdAt: "desc" } });
}
