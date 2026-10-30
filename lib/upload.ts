import * as XLSX from "xlsx";
import { parseSerialFile } from "./bulk";

export const MAX_UPLOAD_BYTES = Number(process.env.MAX_UPLOAD_SIZE_MB || 20) * 1024 * 1024;
export const MAX_UPLOAD_ROWS = Number(process.env.MAX_UPLOAD_ROWS || 10000);
export type UploadFormat = "CSV" | "XLSX";

export function parseUpload(bytes: Uint8Array, fileName: string, mimeType?: string) {
  if (bytes.byteLength > MAX_UPLOAD_BYTES) throw new Error("FILE_TOO_LARGE");
  if (bytes.byteLength === 0) throw new Error("EMPTY_FILE");
  const extension = fileName.toLowerCase().split(".").pop();
  if (extension !== "csv" && extension !== "xlsx") throw new Error("UNSUPPORTED_FILE_TYPE");
  if (extension === "csv") { const content = new TextDecoder().decode(bytes); if (!content.trim()) throw new Error("EMPTY_FILE"); const preview = parseSerialFile(content); if (preview.length > MAX_UPLOAD_ROWS) throw new Error("TOO_MANY_ROWS"); return { format: "CSV" as const, content, preview }; }
  if (mimeType && !["application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "application/octet-stream", "application/vnd.ms-excel"].includes(mimeType)) throw new Error("INVALID_MIME_TYPE");
  const workbook = XLSX.read(bytes, { type: "array", dense: true });
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  if (!sheet) throw new Error("EMPTY_WORKBOOK");
  const rows = XLSX.utils.sheet_to_json<unknown[]>(sheet, { header: 1, raw: false, blankrows: false });
  if (!rows.length) throw new Error("EMPTY_WORKBOOK");
  if (rows.length > MAX_UPLOAD_ROWS + 1) throw new Error("TOO_MANY_ROWS");
  const content = rows.map(row => row.map(value => String(value ?? "")).join(",")).join("\n");
  if (!content.trim()) throw new Error("EMPTY_WORKBOOK");
  return { format: "XLSX" as const, content, preview: parseSerialFile(content) };
}
