import { randomUUID } from "node:crypto";
import { getDb, isDatabaseConfigured } from "@/lib/db";
import { encryptSecret, decryptSecret, maskSecret } from "./secret-encryption";
export const CONFIG_ID = "so-barcode";
export const defaults = { requestedMode: "MOCK", approvedMode: "MOCK", baseUrl: "", apiPath: "/api/bulk-sellout", timeoutMs: 30000, maxRetries: 2, concurrency: 1 } as const;
export async function getIntegrationConfig() {
  if (!isDatabaseConfigured) return { ...defaults, apiKeyMasked: "", persistence: "DEVELOPMENT_DEFAULTS" as const };
  const db = getDb(); const config = await db.integrationConfig.upsert({ where: { id: CONFIG_ID }, create: { id: CONFIG_ID, ...defaults }, update: {}, include: { secret: true } });
  return { requestedMode: config.requestedMode, approvedMode: config.approvedMode, baseUrl: config.baseUrl, apiPath: config.apiPath, timeoutMs: config.timeoutMs, maxRetries: config.maxRetries, concurrency: config.concurrency, apiKeyMasked: maskSecret(config.secret ? decryptSecret(config.secret.ciphertext) : ""), persistence: "POSTGRESQL" as const };
}
export async function updateIntegrationConfig(input: { requestedMode?: "MOCK" | "LIVE"; baseUrl?: string; apiPath?: string; timeoutMs?: number; maxRetries?: number; concurrency?: number; apiKey?: string }, actorId: string, requestId: string, reason?: string) {
  if (!isDatabaseConfigured) throw new Error("DATABASE_NOT_CONFIGURED");
  const db = getDb(); const old = await db.integrationConfig.findUnique({ where: { id: CONFIG_ID }, include: { secret: true } }); const prior = old || await db.integrationConfig.create({ data: { id: CONFIG_ID, ...defaults } });
  const data = { requestedMode: input.requestedMode ?? prior.requestedMode, baseUrl: input.baseUrl ?? prior.baseUrl, apiPath: input.apiPath ?? prior.apiPath, timeoutMs: input.timeoutMs ?? prior.timeoutMs, maxRetries: input.maxRetries ?? prior.maxRetries, concurrency: input.concurrency ?? prior.concurrency, approvedMode: "MOCK", version: { increment: 1 }, updatedById: actorId };
  const config = await db.integrationConfig.update({ where: { id: CONFIG_ID }, data });
  if (input.apiKey !== undefined) await db.integrationSecret.upsert({ where: { configId: CONFIG_ID }, create: { id: randomUUID(), configId: CONFIG_ID, ciphertext: encryptSecret(input.apiKey), updatedById: actorId }, update: { ciphertext: encryptSecret(input.apiKey), updatedById: actorId } });
  const changedFields = Object.keys(input).filter(key => key !== "apiKey").reduce<Record<string, string>>((out, key) => { out[key] = `${key} changed`; return out; }, {}); if (input.apiKey !== undefined) changedFields.SO_BARCODE_API_KEY = "ROTATED (values omitted)";
  await db.configAuditLog.create({ data: { configId: CONFIG_ID, actorId, action: "ADMIN_SETTINGS_UPDATED", changedFields, requestId, reason } }); return getIntegrationConfig();
}
export async function getLiveSecret() { if (!isDatabaseConfigured) return null; const secret = await getDb().integrationSecret.findUnique({ where: { configId: CONFIG_ID } }); return secret ? decryptSecret(secret.ciphertext) : null; }
