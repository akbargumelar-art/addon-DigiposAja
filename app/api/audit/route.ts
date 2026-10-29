import { NextResponse } from "next/server";
import { getSession, hasPermission } from "@/lib/auth";
import { listAudit } from "@/lib/audit";
export async function GET(){const session=await getSession();if(!session)return NextResponse.json({error:"UNAUTHENTICATED"},{status:401});if(!hasPermission(session.role,"audit.read"))return NextResponse.json({error:"FORBIDDEN"},{status:403});return NextResponse.json({events:listAudit().filter(event=>!event.actorId||event.actorId===session.id),persistence:"IN_MEMORY_DEVELOPMENT_ONLY"});}
