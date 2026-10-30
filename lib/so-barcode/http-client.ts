import type { SoBarcodeBulkSelloutInput, SoBarcodeClient, SoBarcodeResponse } from "./types";
import { sanitizeRaw } from "./types";
import { getIntegrationConfig, getLiveSecret } from "@/lib/configuration/integration-config";
export class HttpSoBarcodeClient implements SoBarcodeClient {
  async bulkSellout(_input: SoBarcodeBulkSelloutInput): Promise<SoBarcodeResponse> {
    const config = await getIntegrationConfig();
    if (config.approvedMode !== "LIVE" || process.env.ALLOW_LIVE_TRANSACTIONS !== "true") return { ok: false, status: "FAILED", responseCode: "LIVE_DISABLED", message: "Live SO Barcode disabled" };
    if (!config.baseUrl) return { ok: false, status: "FAILED", responseCode: "NOT_CONFIGURED", message: "SO Barcode endpoint not configured" };
    void getLiveSecret();
    return { ok: false, status: "FAILED", responseCode: "UPSTREAM_CONTRACT_UNVERIFIED", message: "Upstream contract is unverified" };
  }
  async health() { const config = await getIntegrationConfig(); return config.baseUrl ? "OFFLINE" as const : "NOT_CONFIGURED" as const; }
}
export function safeHttpResponse(input: unknown) { return sanitizeRaw(input); }
