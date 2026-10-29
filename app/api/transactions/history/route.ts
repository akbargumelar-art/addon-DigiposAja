import { NextResponse } from "next/server";
import { getSession, hasPermission } from "@/lib/auth";
export async function GET(){ const session=await getSession(); if(!session) return NextResponse.json({error:"UNAUTHENTICATED"},{status:401}); if(!hasPermission(session.role,"history.read")) return NextResponse.json({error:"FORBIDDEN"},{status:403}); return NextResponse.json({transactions:[],mode:"MOCK",message:"History persistence akan menggunakan PostgreSQL pada fase berikutnya."}); }
