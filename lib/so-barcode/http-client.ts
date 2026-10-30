import type { SoBarcodeBulkSelloutInput, SoBarcodeClient, SoBarcodeResponse } from "./types";
import { sanitizeRaw } from "./types";
export class HttpSoBarcodeClient implements SoBarcodeClient {
  private base = process.env.SO_BARCODE_API_BASE_URL || "";
  private path = process.env.SO_BARCODE_API_PATH || "/api/bulk-sellout";
  async bulkSellout(_input: SoBarcodeBulkSelloutInput): Promise<SoBarcodeResponse> {
    if (process.env.ALLOW_LIVE_TRANSACTIONS !== "true") return { ok: false, status: "FAILED", responseCode: "LIVE_DISABLED", message: "Live SO Barcode disabled" };
    if (!this.base) return { ok: false, status: "FAILED", responseCode: "NOT_CONFIGURED", message: "SO Barcode endpoint not configured" };
    return { ok: false, status: "FAILED", responseCode: "UPSTREAM_CONTRACT_UNVERIFIED", message: "Upstream contract is unverified" };
  }
  async health() { return this.base ? "OFFLINE" as const : "NOT_CONFIGURED" as const; }
}
export function safeHttpResponse(input: unknown) { return sanitizeRaw(input); }
