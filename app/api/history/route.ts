import { NextResponse } from "next/server";
import { getSession, hasPermission } from "@/lib/auth";
import { listBatches } from "@/lib/bulk";
export async function GET(request:Request){const session=await getSession();if(!session)return NextResponse.json({error:"UNAUTHENTICATED"},{status:401});if(!hasPermission(session.role,"history.read"))return NextResponse.json({error:"FORBIDDEN"},{status:403});const url=new URL(request.url);const status=url.searchParams.get("status");const account=url.searchParams.get("accountId");const rows=listBatches().filter(batch=>session.accountIds.includes(batch.accountId)&&(!status||batch.status===status)&&(!account||batch.accountId===account));return NextResponse.json({history:rows,persistence:"IN_MEMORY_DEVELOPMENT_ONLY"});}
