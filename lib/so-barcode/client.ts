import type { SoBarcodeClient } from "./types";
import { MockSoBarcodeClient } from "./mock-client";
import { HttpSoBarcodeClient } from "./http-client";
import { getIntegrationConfig } from "@/lib/configuration/integration-config";
export async function getSoBarcodeClient(): Promise<SoBarcodeClient> {
  const config = await getIntegrationConfig();
  return config.requestedMode === "LIVE" && config.approvedMode === "LIVE" && process.env.ALLOW_LIVE_TRANSACTIONS === "true" ? new HttpSoBarcodeClient() : new MockSoBarcodeClient();
}
