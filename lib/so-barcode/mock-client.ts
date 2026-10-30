import type { SoBarcodeBulkSelloutInput, SoBarcodeClient, SoBarcodeResponse } from "./types";
export class MockSoBarcodeClient implements SoBarcodeClient {
  async bulkSellout(input: SoBarcodeBulkSelloutInput): Promise<SoBarcodeResponse> {
    const serial = input.serial.toUpperCase();
    if (serial.includes("MOCK-TIMEOUT")) { await new Promise(resolve => setTimeout(resolve, 25)); return { ok: false, status: "TIMEOUT", responseCode: "MOCK_TIMEOUT", message: "Mock timeout" }; }
    if (serial.includes("MOCK-ALREADY-REDEEMED")) return { ok: true, status: "ALREADY_REDEEMED", responseCode: "ALREADY_REDEEMED", message: "Serial sudah pernah diredeem" };
    if (serial.includes("MOCK-FAIL")) return { ok: false, status: "FAILED", responseCode: "MOCK_FAILURE", message: "Mock failure" };
    if (serial.includes("MOCK-INVALID")) return { ok: false, status: "INVALID", responseCode: "INVALID_SERIAL", message: "Serial tidak valid" };
    return { ok: true, status: "SUCCESS", responseCode: "OK", message: "Mock sellout berhasil", providerReference: `mock-${input.requestId}` };
  }
  async health() { return "MOCK" as const; }
}
