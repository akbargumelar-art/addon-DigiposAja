import { NextResponse } from "next/server";
import { getWindowsAgentClient } from "@/lib/agent";
import { getSoBarcodeClient } from "@/lib/so-barcode/client";
export async function GET(){const mode=process.env.TRANSACTION_MODE||"MOCK";const liveAllowed=process.env.ALLOW_LIVE_TRANSACTIONS==="true";const windowsAgent=await getWindowsAgentClient().health();const soBarcode=await getSoBarcodeClient().health();return NextResponse.json({status:"ok",portal:"ONLINE",database:process.env.DATABASE_URL?"CONFIGURED":"NOT_CONFIGURED",queue:process.env.REDIS_URL?"CONFIGURED":"NOT_CONFIGURED",windowsAgent,digipos:windowsAgent==="ONLINE"?"ONLINE":"NOT_CONFIGURED",soBarcode,soBarcodeEndpoint:process.env.SO_BARCODE_API_BASE_URL?"UNVERIFIED":"NOT_CONFIGURED",mode,liveAllowed:false,integration:"NOT_CONFIGURED",requestId:crypto.randomUUID()},{headers:{"Cache-Control":"no-store"}})}

