import { createHmac, randomUUID, scryptSync, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

export type Role = "ADMIN" | "OPERATOR" | "VIEWER";
export type Permission = "account.read" | "transaction.read" | "transaction.execute" | "transaction.bulk_upload" | "transaction.retry" | "transaction.cancel" | "history.read" | "report.export" | "audit.read";
const rolePermissions: Record<Role, Permission[]> = { ADMIN:["account.read","transaction.read","transaction.execute","transaction.bulk_upload","transaction.retry","transaction.cancel","history.read","report.export","audit.read"], OPERATOR:["account.read","transaction.read","transaction.execute","transaction.bulk_upload","transaction.retry","transaction.cancel","history.read","report.export"], VIEWER:["account.read","transaction.read","history.read"] };
const demoUsers = [{ id:"user-demo", username:"demo", passwordHash:scryptSync("demo1234","agrabudi-demo",32).toString("hex"), role:"ADMIN" as const, accountIds:["acc-demo"] }];
const secret = () => process.env.AUTH_SECRET || "local-development-secret";
export function hashSession(sessionId:string){ return createHmac("sha256",secret()).update(sessionId).digest("hex"); }
export function createSession(userId:string){ const sessionId=`${userId}.${randomUUID()}`; return `${sessionId}.${hashSession(sessionId)}`; }
export function verifySession(token:string){ const parts=token.split("."); if(parts.length<3) return null; const sessionId=parts.slice(0,2).join("."); const expected=hashSession(sessionId); if(!timingSafeEqual(Buffer.from(parts[2]),Buffer.from(expected))) return null; const user=demoUsers.find(item=>item.id===parts[0]); return user ? {id:user.id,username:user.username,role:user.role,accountIds:user.accountIds} : null; }
export function authenticate(username:string,password:string){ const user=demoUsers.find(item=>item.username===username); if(!user) return null; const hash=scryptSync(password,"agrabudi-demo",32).toString("hex"); return hash===user.passwordHash ? {id:user.id,username:user.username,role:user.role,accountIds:user.accountIds} : null; }
export function hasPermission(role:Role, permission:Permission){ return rolePermissions[role].includes(permission); }
export async function getSession(){ const token=(await cookies()).get("agrabudi_session")?.value; return token ? verifySession(token) : null; }
export function assertAccountAccess(session:{accountIds:string[]},accountId:string){ if(!session.accountIds.includes(accountId)) throw new Error("ACCOUNT_ACCESS_DENIED"); }
