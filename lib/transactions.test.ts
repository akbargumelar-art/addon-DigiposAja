import { describe, expect, it } from "vitest";
import { FutureWindowsAgentAdapter, MockDigiposAdapter, transactionInputSchema, transactionRegistry } from "./transactions";

describe("transaction registry", () => {
  it("contains all supported transaction categories", () => {
    expect(Object.keys(transactionRegistry)).toHaveLength(14);
    expect(transactionRegistry.PULSA.permission).toBe("transaction.execute");
    expect(transactionRegistry.CEKVC.inquiry).toBe(true);
  });

  it("rejects invalid transaction input", () => {
    const result = transactionInputSchema.safeParse({ transactionType: "PULSA", digiposAccountId: "acc-demo", target: "08" });
    expect(result.success).toBe(false);
  });

  it("returns a mock response without provider credentials", async () => {
    const input = transactionInputSchema.parse({ transactionType: "PULSA", digiposAccountId: "acc-demo", target: "081234567890", idempotencyKey: "00000000-0000-4000-8000-000000000001" });
    const response = await new MockDigiposAdapter().executeTransaction(input);
    expect(response.provider).toBe("MOCK");
    expect(response.status).toBe("SUCCESS");
    expect(JSON.stringify(response)).not.toContain("PIN");
  });

  it("keeps the future Windows adapter disabled", async () => {
    await expect(new FutureWindowsAgentAdapter().executeTransaction({} as never)).rejects.toThrow("belum dikonfigurasi");
  });
});
