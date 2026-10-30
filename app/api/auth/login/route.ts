import { NextResponse } from "next/server";
import { z } from "zod";
import { authenticate, createSession } from "@/lib/auth";
import { recordAudit } from "@/lib/audit";
import { authenticatePersistent, createPersistentSession } from "@/lib/repositories/auth";
const schema=z.object({username:z.string().min(1).max(80),password:z.string().min(1).max(128)});
export async function POST(request:Request){ try { const input=schema.parse(await request.json()); const user=process.env.DATABASE_URL ? await authenticatePersistent(input.username,input.password) : authenticate(input.username,input.password); if(!user){recordAudit({action:"LOGIN_FAILED",metadata:{username:input.username}});return NextResponse.json({error:"INVALID_CREDENTIALS"},{status:401});} recordAudit({actorId:user.id,action:"LOGIN_SUCCESS"}); const response=NextResponse.json({user:{id:user.id,username:user.username,role:user.role}}); response.cookies.set("agrabudi_session",(process.env.DATABASE_URL ? await createPersistentSession(user.id) : createSession(user.id))!,{httpOnly:true,secure:process.env.NODE_ENV==="production",sameSite:"lax",path:"/",maxAge:60*60*8}); return response; } catch { return NextResponse.json({error:"INVALID_REQUEST"},{status:400}); } }
