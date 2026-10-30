export interface SoBarcodeBulkSelloutInput {
  serial: string;
  accountId: string;
  requestId: string;
  idempotencyKey: string;
}
export type SoBarcodeStatus = "SUCCESS" | "ALREADY_REDEEMED" | "FAILED" | "TIMEOUT" | "INVALID";
export interface SoBarcodeResponse {
  ok: boolean;
  status: SoBarcodeStatus;
  responseCode?: string;
  message?: string;
  providerReference?: string;
  rawSafe?: unknown;
}
export interface SoBarcodeClient {
  bulkSellout(input: SoBarcodeBulkSelloutInput): Promise<SoBarcodeResponse>;
  health(): Promise<"MOCK" | "NOT_CONFIGURED" | "ONLINE" | "OFFLINE">;
}
export function sanitizeRaw(value: unknown): unknown {
  if (!value || typeof value !== "object") return value;
  const blocked = /api[-_]?key|token|secret|password|pin|cookie|authorization/i;
  return Object.fromEntries(Object.entries(value as Record<string, unknown>).filter(([key]) => !blocked.test(key)).map(([key, item]) => [key, typeof item === "object" ? sanitizeRaw(item) : item]));
}
