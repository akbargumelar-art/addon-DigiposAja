import { NextResponse } from "next/server";
import { z } from "zod";
import { getSession, hasPermission, assertAccountAccess } from "@/lib/auth";
import { createBatch, listBatches } from "@/lib/bulk";
const schema=z.object({digiposAccountId:z.string().min(1),transactionType:z.enum(["VF","REDEEMVTSEL","REDEEMVBYU"]),content:z.string().min(1).max(5_000_000)});
export async function GET(){const session=await getSession();if(!session)return NextResponse.json({error:"UNAUTHENTICATED"},{status:401});return NextResponse.json({jobs:listBatches().filter(item=>session.accountIds.includes(item.accountId)),queue:"IN_MEMORY_DEVELOPMENT_ONLY"});}
export async function POST(request:Request){const session=await getSession();if(!session)return NextResponse.json({error:"UNAUTHENTICATED"},{status:401});if(!hasPermission(session.role,"transaction.bulk_upload"))return NextResponse.json({error:"FORBIDDEN"},{status:403});try{const input=schema.parse(await request.json());assertAccountAccess(session,input.digiposAccountId);return NextResponse.json({job:createBatch(input.digiposAccountId,input.transactionType,input.content)},{status:201});}catch(error){return NextResponse.json({error:error instanceof Error&&error.message==="ACCOUNT_ACCESS_DENIED"?"ACCOUNT_ACCESS_DENIED":"INVALID_REQUEST"},{status:400});}}
