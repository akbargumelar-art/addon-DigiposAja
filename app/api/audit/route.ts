import { NextResponse } from "next/server";
import { getSession, hasPermission } from "@/lib/auth";
import { listAudit } from "@/lib/audit";
import { findAudit } from "@/lib/repositories/audit";
import { isDatabaseConfigured } from "@/lib/db";
export async function GET(){const session=await getSession();if(!session)return NextResponse.json({error:"UNAUTHENTICATED"},{status:401});if(!hasPermission(session.role,"audit.read"))return NextResponse.json({error:"FORBIDDEN"},{status:403});const persistent=await findAudit(session.id);if(isDatabaseConfigured)return NextResponse.json({events:persistent,persistence:"POSTGRESQL"});if(process.env.NODE_ENV==="production")return NextResponse.json({error:"DATABASE_NOT_CONFIGURED"},{status:503});return NextResponse.json({events:listAudit().filter(event=>!event.actorId||event.actorId===session.id),persistence:"IN_MEMORY_DEVELOPMENT_ONLY"});}
