import { NextResponse } from "next/server";
import { getSession, hasPermission } from "@/lib/auth";
import { listAudit } from "@/lib/audit";
import { findAudit } from "@/lib/repositories/audit";
export async function GET(){const session=await getSession();if(!session)return NextResponse.json({error:"UNAUTHENTICATED"},{status:401});if(!hasPermission(session.role,"audit.read"))return NextResponse.json({error:"FORBIDDEN"},{status:403});const persistent=await findAudit(session.id);return NextResponse.json({events:persistent.length?persistent:listAudit().filter(event=>!event.actorId||event.actorId===session.id),persistence:persistent.length?"POSTGRESQL":"IN_MEMORY_DEVELOPMENT_ONLY"});}
