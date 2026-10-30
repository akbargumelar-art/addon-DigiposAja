import * as XLSX from "xlsx";
import { parseSerialFile } from "./bulk";

export const MAX_UPLOAD_BYTES = Number(process.env.MAX_UPLOAD_SIZE_MB || 20) * 1024 * 1024;
export type UploadFormat = "CSV" | "XLSX";

export function parseUpload(bytes: Uint8Array, fileName: string, mimeType?: string) {
  if (bytes.byteLength > MAX_UPLOAD_BYTES) throw new Error("FILE_TOO_LARGE");
  const extension = fileName.toLowerCase().split(".").pop();
  if (extension !== "csv" && extension !== "xlsx") throw new Error("UNSUPPORTED_FILE_TYPE");
  if (extension === "csv") return { format: "CSV" as const, content: new TextDecoder().decode(bytes), preview: parseSerialFile(new TextDecoder().decode(bytes)) };
  if (mimeType && !["application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "application/octet-stream", "application/vnd.ms-excel"].includes(mimeType)) throw new Error("INVALID_MIME_TYPE");
  const workbook = XLSX.read(bytes, { type: "array", dense: true });
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  if (!sheet) throw new Error("EMPTY_WORKBOOK");
  const rows = XLSX.utils.sheet_to_json<unknown[]>(sheet, { header: 1, raw: false, blankrows: false });
  const content = rows.map(row => row.map(value => String(value ?? "")).join(",")).join("\n");
  return { format: "XLSX" as const, content, preview: parseSerialFile(content) };
}
