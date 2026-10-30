import type { SoBarcodeClient } from "./types";
import { MockSoBarcodeClient } from "./mock-client";
import { HttpSoBarcodeClient } from "./http-client";
export function getSoBarcodeClient(): SoBarcodeClient {
  return process.env.SO_BARCODE_MODE === "LIVE" ? new HttpSoBarcodeClient() : new MockSoBarcodeClient();
}
