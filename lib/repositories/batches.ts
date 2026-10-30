import { getDb, isDatabaseConfigured } from "@/lib/db";
import type { Prisma } from "@prisma/client";
import type { Batch } from "@/lib/bulk";

export async function createPersistentBatch(input: { id: string; accountId: string; createdById: string; transactionType: string; items: Batch["items"] }) {
  if (!isDatabaseConfigured) throw new Error("DATABASE_NOT_CONFIGURED");
  return getDb().batch.create({ data: { id: input.id, accountId: input.accountId, createdById: input.createdById, transactionType: input.transactionType, mode: "MOCK", status: "READY", items: { create: input.items.map(item => ({ id: item.id, rowNumber: item.rowNumber, serial: item.serial, normalizedSerial: item.normalizedSerial, status: item.status, attempts: item.attempts, errorMessage: item.error })) } }, include: { items: { orderBy: { rowNumber: "asc" } } } });
}
export async function findPersistentBatch(id: string) {
  if (!isDatabaseConfigured) return null;
  return getDb().batch.findUnique({ where: { id }, include: { items: { orderBy: { rowNumber: "asc" } } } });
}
export async function listPersistentBatches(accountIds: string[]) {
  if (!isDatabaseConfigured) return [];
  return getDb().batch.findMany({ where: { accountId: { in: accountIds } }, include: { items: { orderBy: { rowNumber: "asc" } } }, orderBy: { createdAt: "desc" } });
}
export async function updatePersistentBatch(id: string, data: { status?: string; updatedAt?: Date }) {
  if (!isDatabaseConfigured) return null;
  return getDb().batch.update({ where: { id }, data });
}
export async function updatePersistentItem(id: string, data: { status?: string; attempts?: number; response?: unknown; errorCode?: string | null; errorMessage?: string | null; startedAt?: Date | null; finishedAt?: Date | null }) {
  if (!isDatabaseConfigured) return null;
  const jsonData = data.response === undefined ? data : { ...data, response: data.response as Prisma.InputJsonValue };
  return getDb().batchItem.update({ where: { id }, data: jsonData as Prisma.BatchItemUpdateInput });
}

export async function cancelPersistentPendingItems(batchId: string) {
  if (!isDatabaseConfigured) return null;
  return getDb().batchItem.updateMany({ where: { batchId, status: "PENDING" }, data: { status: "CANCELLED", finishedAt: new Date() } });
}
export async function resetPersistentFailedItems(batchId: string, maxAttempts: number) {
  if (!isDatabaseConfigured) return null;
  return getDb().batchItem.updateMany({ where: { batchId, status: "FAILED", attempts: { lt: maxAttempts } }, data: { status: "PENDING", errorCode: null, errorMessage: null } });
}
export async function setPersistentBatchStatus(id: string, status: string) { return updatePersistentBatch(id, { status }); }
