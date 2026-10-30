import { NextResponse } from "next/server";
import { getSession, hasPermission } from "@/lib/auth";
import { exportBatchCsv, getBatch } from "@/lib/bulk";
export async function GET(_: Request, { params }: { params: { id: string } }) { const session=await getSession(); if(!session)return NextResponse.json({error:"UNAUTHENTICATED"},{status:401}); if(!hasPermission(session.role,"report.export"))return NextResponse.json({error:"FORBIDDEN"},{status:403}); const job=getBatch(params.id); if(!job||!session.accountIds.includes(job.accountId))return NextResponse.json({error:"NOT_FOUND"},{status:404}); const csv=exportBatchCsv(params.id); return new Response(csv||"",{headers:{"content-type":"text/csv; charset=utf-8","content-disposition":`attachment; filename="${params.id}.csv"`}}); }
