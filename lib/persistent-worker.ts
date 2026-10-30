import { randomUUID } from "node:crypto";
import { MockDigiposAdapter } from "@/lib/transactions";
import { findPersistentBatch, updatePersistentBatch, updatePersistentItem } from "@/lib/repositories/batches";

const maxAttempts = () => Math.max(1, Number(process.env.MAX_RETRY_ATTEMPTS || 2));
const backoff = (attempt: number) => Math.min(30_000, 250 * 2 ** Math.max(0, attempt - 1));
export async function processPersistentBatch(id: string) {
  const batch = await findPersistentBatch(id); if (!batch || ["CANCELLED", "COMPLETED", "COMPLETED_WITH_ERRORS"].includes(batch.status)) return batch;
  await updatePersistentBatch(id, { status: "RUNNING" });
  const adapter = new MockDigiposAdapter();
  for (const item of batch.items) {
    const current = await findPersistentBatch(id); if (!current || current.status !== "RUNNING") break;
    if (!["PENDING", "FAILED"].includes(item.status) || item.attempts >= maxAttempts()) continue;
    const started = new Date(); const attempts = item.attempts + 1;
    await updatePersistentItem(item.id, { status: "PROCESSING", attempts, startedAt: started, errorCode: null, errorMessage: null });
    try { const response = await adapter.executeTransaction({ transactionType: batch.transactionType as "VF"|"REDEEMVTSEL"|"REDEEMVBYU", digiposAccountId: batch.accountId, target: item.normalizedSerial, idempotencyKey: randomUUID() }); await updatePersistentItem(item.id, { status: "SUCCESS", response, finishedAt: new Date() }); }
    catch (error) { const message = error instanceof Error ? error.message : "MOCK_ERROR"; await updatePersistentItem(item.id, { status: attempts >= maxAttempts() ? "FAILED" : "PENDING", errorCode: message, errorMessage: message, finishedAt: new Date() }); if (attempts < maxAttempts()) await new Promise(resolve => setTimeout(resolve, backoff(attempts))); }
  }
  const final = await findPersistentBatch(id); if (final && final.status === "RUNNING") { const failed = final.items.some(item => item.status === "FAILED"); const pending = final.items.some(item => ["PENDING", "PROCESSING"].includes(item.status)); await updatePersistentBatch(id, { status: pending ? "RUNNING" : failed ? "COMPLETED_WITH_ERRORS" : "COMPLETED" }); }
  return findPersistentBatch(id);
}
