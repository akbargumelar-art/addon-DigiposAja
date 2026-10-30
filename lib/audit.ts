export type AuditAction="LOGIN_SUCCESS"|"LOGIN_FAILED"|"ACCOUNT_VIEWED"|"TRANSACTION_INQUIRY"|"TRANSACTION_EXECUTE_MOCK"|"SELLOUT_UPLOAD"|"SELLOUT_JOB_CREATED"|"SELLOUT_JOB_STARTED"|"SELLOUT_ITEM_SUCCESS"|"SELLOUT_ITEM_FAILED"|"SELLOUT_JOB_PAUSED"|"SELLOUT_JOB_RESUMED"|"SELLOUT_JOB_CANCELLED"|"SELLOUT_RETRY"|"EXPORT_CREATED"|"CONFIG_VIEWED";
export type AuditEvent={id:string;actorId?:string;action:AuditAction;resource?:string;metadata?:Record<string,string|number|boolean>;createdAt:string};
const events:AuditEvent[]=[];
export function recordAudit(event:Omit<AuditEvent,"id"|"createdAt">){const saved={...event,id:crypto.randomUUID(),createdAt:new Date().toISOString()};events.unshift(saved);void import("@/lib/repositories/audit").then(({saveAudit})=>saveAudit(event)).catch(()=>undefined);return saved;}
export function listAudit(){return events.slice(0,500);}
