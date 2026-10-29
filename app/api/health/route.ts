import { NextResponse } from "next/server";
import { getWindowsAgentClient } from "@/lib/agent";
export async function GET(){const mode=process.env.TRANSACTION_MODE||"MOCK";const liveAllowed=process.env.ALLOW_LIVE_TRANSACTIONS==="true";const windowsAgent=await getWindowsAgentClient().health();return NextResponse.json({status:"ok",portal:"ONLINE",database:process.env.DATABASE_URL?"CONFIGURED":"NOT_CONFIGURED",queue:process.env.REDIS_URL?"CONFIGURED":"NOT_CONFIGURED",windowsAgent,digipos:windowsAgent==="ONLINE"?"ONLINE":"NOT_CONFIGURED",soBarcode:windowsAgent==="ONLINE"?"ONLINE":"NOT_CONFIGURED",mode,liveAllowed:false,integration:"NOT_CONFIGURED",requestId:crypto.randomUUID()},{headers:{"Cache-Control":"no-store"}})}

