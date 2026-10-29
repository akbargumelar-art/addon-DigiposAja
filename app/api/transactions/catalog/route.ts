import { NextResponse } from "next/server";
import { transactionRegistry } from "@/lib/transactions";
export async function GET(){ return NextResponse.json({mode:"MOCK", catalog:transactionRegistry}); }
