import { NextResponse } from "next/server";
export async function GET(){
  const mode = process.env.TRANSACTION_MODE || "MOCK";
  const liveAllowed = process.env.ALLOW_LIVE_TRANSACTIONS === "true";
  const integration = liveAllowed && mode === "LIVE" ? (process.env.INTEGRATION_STATUS || "NOT_CONFIGURED") : "NOT_CONFIGURED";
  return NextResponse.json({ status:"ok", mode, liveAllowed, integration, agent:integration === "ONLINE" ? "ONLINE" : "OFFLINE", requestId:crypto.randomUUID() }, { headers:{ "Cache-Control":"no-store" } });
}
