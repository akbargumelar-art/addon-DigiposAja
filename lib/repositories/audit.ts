import { getDb, isDatabaseConfigured } from "@/lib/db";
import type { AuditAction, AuditEvent } from "@/lib/audit";

export async function saveAudit(event: Omit<AuditEvent, "id" | "createdAt">) {
  if (!isDatabaseConfigured) return null;
  return getDb().auditLog.create({ data: { actorId: event.actorId, action: event.action, resource: event.resource, metadata: event.metadata } });
}
export async function findAudit(actorId?: string) {
  if (!isDatabaseConfigured) return [];
  return getDb().auditLog.findMany({ where: actorId ? { OR: [{ actorId }, { actorId: null }] } : undefined, orderBy: { createdAt: "desc" }, take: 500 });
}
