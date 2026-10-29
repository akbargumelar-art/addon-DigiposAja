import { NextResponse } from "next/server";
import { getSession, hasPermission } from "@/lib/auth";
import { listAccounts } from "@/lib/accounts";
export async function GET(){ const session=await getSession(); if(!session) return NextResponse.json({error:"UNAUTHENTICATED"},{status:401}); if(!hasPermission(session.role,"account.read")) return NextResponse.json({error:"FORBIDDEN"},{status:403}); return NextResponse.json({accounts:listAccounts().filter(account=>session.accountIds.includes(account.id))}); }
