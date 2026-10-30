import { describe, expect, it } from "vitest";
import { MockSoBarcodeClient } from "./mock-client";
import { sanitizeRaw } from "./types";

describe("SO Barcode mock adapter", () => {
  const input = { serial: "MOCK-OK-001", accountId: "acc-demo", requestId: "req-1", idempotencyKey: "idem-1" };
  it("maps deterministic mock responses", async () => {
    const client = new MockSoBarcodeClient();
    expect((await client.bulkSellout(input)).status).toBe("SUCCESS");
    expect((await client.bulkSellout({ ...input, serial: "MOCK-ALREADY-REDEEMED-004" })).status).toBe("ALREADY_REDEEMED");
    expect((await client.bulkSellout({ ...input, serial: "MOCK-TIMEOUT-003" })).status).toBe("TIMEOUT");
  });
  it("removes credential-shaped fields", () => {
    expect(sanitizeRaw({ token: "hidden", nested: { apiKey: "hidden", ok: true } })).toEqual({ nested: { ok: true } });
  });
});
