import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { getBatch } from "@/lib/bulk";
import { findPersistentBatch } from "@/lib/repositories/batches";
export async function GET(_: Request, { params }: { params: { id: string } }) { const session=await getSession(); if(!session)return NextResponse.json({error:"UNAUTHENTICATED"},{status:401}); const persistent=await findPersistentBatch(params.id); if(persistent){if(!session.accountIds.includes(persistent.accountId))return NextResponse.json({error:"NOT_FOUND"},{status:404});return NextResponse.json({items:persistent.items});} const job=getBatch(params.id); if(!job||!session.accountIds.includes(job.accountId))return NextResponse.json({error:"NOT_FOUND"},{status:404}); return NextResponse.json({items:job.items}); }
