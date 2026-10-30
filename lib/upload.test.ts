import { describe, expect, it } from "vitest";
import * as XLSX from "xlsx";
import { parseUpload } from "./upload";

describe("upload parser", () => {
  it("parses CSV uploads", () => {
    const result = parseUpload(new TextEncoder().encode("serial\nMOCK-OK-001"), "items.csv", "text/csv");
    expect(result.format).toBe("CSV");
    expect(result.preview[0].normalizedSerial).toBe("MOCK-OK-001");
  });
  it("parses XLSX uploads", () => {
    const book = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(book, XLSX.utils.aoa_to_sheet([["serial"], ["MOCK-OK-002"]]), "Sheet1");
    const bytes = XLSX.write(book, { type: "buffer", bookType: "xlsx" });
    const result = parseUpload(new Uint8Array(bytes), "items.xlsx", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
    expect(result.format).toBe("XLSX");
    expect(result.preview[0].normalizedSerial).toBe("MOCK-OK-002");
  });
});
